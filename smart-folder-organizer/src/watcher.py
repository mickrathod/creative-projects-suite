import os
import time
import threading
from typing import Callable, Optional
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from .organizer import FolderOrganizer, HISTORY_FILE

IGNORED_EXTENSIONS = {
    ".tmp", ".crdownload", ".part", ".download", ".partial",
    ".swp", ".lock", ".temp"
}


class FolderWatcherHandler(FileSystemEventHandler):
    """Event handler for new files in monitored folder."""

    def __init__(self, organizer: FolderOrganizer, on_event_callback: Optional[Callable[[str], None]] = None):
        super().__init__()
        self.organizer = organizer
        self.on_event_callback = on_event_callback
        self.processing_lock = threading.Lock()

    def log(self, message: str):
        if self.on_event_callback:
            self.on_event_callback(message)
        else:
            print(f"[Watcher] {message}")

    def on_created(self, event):
        if event.is_directory:
            return
        self._handle_file_event(event.src_path)

    def on_moved(self, event):
        if event.is_directory:
            return
        self._handle_file_event(event.dest_path)

    def _handle_file_event(self, file_path: str):
        filename = os.path.basename(file_path)
        ext = os.path.splitext(filename)[1].lower()

        # Skip ignored temporary extensions, hidden files, or history log
        if ext in IGNORED_EXTENSIONS or filename.startswith(".") or filename.startswith("~$") or filename == HISTORY_FILE:
            return

        # Handle in a background thread to prevent blocking the watchdog observer
        threading.Thread(target=self._process_file_safely, args=(file_path,), daemon=True).start()

    def _process_file_safely(self, file_path: str):
        with self.processing_lock:
            # Wait for file to finish downloading/writing
            if not self._wait_until_file_ready(file_path):
                return

            if not os.path.exists(file_path):
                return

            self.log(f"Detected incoming file: {os.path.basename(file_path)}")

            try:
                # Scan only the single target file
                plan = self.organizer.scan_files()
                matching_plan = [p for p in plan if os.path.abspath(p["original_path"]) == os.path.abspath(file_path)]

                if matching_plan:
                    results = self.organizer.execute_plan(matching_plan, dry_run=False)
                    if results["moved_files"]:
                        moved = results["moved_files"][0]
                        self.log(f"✅ Organized: '{os.path.basename(moved['from'])}' -> '{os.path.basename(moved['to'])}' ({moved['doc_type']})")
                    elif results["skipped"]:
                        self.log(f"ℹ️ File already organized: {os.path.basename(file_path)}")
            except Exception as e:
                self.log(f"❌ Error organizing {os.path.basename(file_path)}: {e}")

    def _wait_until_file_ready(self, file_path: str, timeout: int = 15) -> bool:
        """Wait until file size is stable and file is not locked by another process."""
        start_time = time.time()
        last_size = -1

        while time.time() - start_time < timeout:
            if not os.path.exists(file_path):
                return False

            try:
                current_size = os.path.getsize(file_path)
                # Try opening file to confirm it is not locked by an active download/write
                with open(file_path, "rb") as f:
                    pass

                if current_size == last_size and current_size > 0:
                    # Size hasn't changed over 1 second, file write is complete
                    return True

                last_size = current_size
            except (PermissionError, OSError):
                # File locked by browser or writer
                pass

            time.sleep(1.0)

        return os.path.exists(file_path)


class BackgroundWatcher:
    """Manages starting and stopping folder watchdog observer."""

    def __init__(self, source_dir: str, target_dir: Optional[str] = None, strategy: str = "by_category", on_log: Optional[Callable[[str], None]] = None):
        self.source_dir = source_dir
        self.target_dir = target_dir
        self.strategy = strategy
        self.on_log = on_log
        self.observer: Optional[Observer] = None
        self.is_running = False

    def start(self):
        if self.is_running:
            return

        organizer = FolderOrganizer(self.source_dir, self.target_dir, self.strategy)
        handler = FolderWatcherHandler(organizer, on_event_callback=self.on_log)

        self.observer = Observer()
        self.observer.schedule(handler, path=self.source_dir, recursive=False)
        self.observer.start()
        self.is_running = True
        if self.on_log:
            self.on_log(f"🚀 Live watcher active on: {self.source_dir}")

    def stop(self):
        if not self.is_running or not self.observer:
            return

        try:
            self.observer.stop()
            self.observer.join(timeout=2.0)
        except Exception:
            pass
        finally:
            self.is_running = False
            self.observer = None
            if self.on_log:
                self.on_log("🛑 Live watcher stopped.")

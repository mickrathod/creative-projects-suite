import os
import sys
import argparse

# Reconfigure stdout for safe Windows console output
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from src.organizer import FolderOrganizer
from src.watcher import BackgroundWatcher
from src.gui import main as run_gui


def main():
    parser = argparse.ArgumentParser(description="Smart File & PDF Organizer (Privacy Edition)")
    parser.add_argument("--source", "-s", type=str, help="Source / Inbox folder to organize")
    parser.add_argument("--target", "-t", type=str, help="Destination folder (defaults to source/Organized)")
    parser.add_argument("--strategy", choices=["by_category", "by_date", "by_vendor", "flat_renamed"], default="by_category", help="Organization strategy")
    parser.add_argument("--dry-run", action="store_true", help="Simulate scan without moving or renaming files")
    parser.add_argument("--undo", action="store_true", help="Undo the last batch of organized files")
    parser.add_argument("--watch", action="store_true", help="Run in continuous background auto-watch mode")
    parser.add_argument("--cli", action="store_true", help="Force CLI mode instead of GUI")

    args = parser.parse_args()

    # If no CLI arguments provided, launch the modern GUI
    if not args.source and not args.cli and not args.undo:
        run_gui()
        return

    if args.undo:
        target = args.target or args.source or os.getcwd()
        organizer = FolderOrganizer(target, target)
        res = organizer.undo_last_batch()
        if res["success"]:
            print(f"[OK] Reverted {res['reverted']} file(s) from batch {res['batch_id']}.")
        else:
            print(f"[ERROR] {res['message']}")
        return

    if not args.source or not os.path.exists(args.source):
        print(f"[ERROR] Source folder does not exist: {args.source}")
        sys.exit(1)

    target = args.target or os.path.join(args.source, "Organized")
    organizer = FolderOrganizer(args.source, target, strategy=args.strategy)

    if args.watch:
        print(f"[*] Starting live watcher on: {args.source}")
        watcher = BackgroundWatcher(args.source, target, strategy=args.strategy, on_log=print)
        watcher.start()
        try:
            while True:
                import time
                time.sleep(1)
        except KeyboardInterrupt:
            watcher.stop()
            print("[*] Stopped watcher.")
        return

    plan = organizer.scan_files()
    print(f"[*] Found {len(plan)} file(s) to process.")

    for item in plan:
        print(f" -> {item['original_filename']} ({item['doc_type']} | {item['vendor']}) -> {item['proposed_filename']}")

    results = organizer.execute_plan(plan, dry_run=args.dry_run)
    mode_str = "[DRY-RUN]" if args.dry_run else "[EXECUTED]"
    print(f"{mode_str} Processed: {results['processed']}, Skipped: {results['skipped']}, Errors: {len(results['errors'])}")


if __name__ == "__main__":
    main()

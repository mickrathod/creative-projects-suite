import os
import sys
import threading
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from typing import Optional

# Support running directly or as a module
try:
    from .organizer import FolderOrganizer
    from .watcher import BackgroundWatcher
except ImportError:
    from organizer import FolderOrganizer
    from watcher import BackgroundWatcher

# Dark Theme Color Palette
THEME = {
    "bg_dark": "#12141d",
    "bg_card": "#1a1d29",
    "bg_input": "#222636",
    "border": "#2c3147",
    "text_primary": "#ffffff",
    "text_secondary": "#94a3b8",
    "accent_blue": "#3b82f6",
    "accent_green": "#10b981",
    "accent_amber": "#f59e0b",
    "accent_red": "#ef4444",
    "accent_purple": "#8b5cf6"
}


class SmartOrganizerGUI(tk.Tk):
    """Modern Desktop GUI for Automated PDF & Folder Organizer."""

    def __init__(self):
        super().__init__()
        self.title("Smart File & PDF Organizer (Privacy Edition)")
        self.geometry("1100x750")
        self.minsize(950, 650)
        self.configure(bg=THEME["bg_dark"])

        # State variables
        self.source_dir_var = tk.StringVar(value="")
        self.target_dir_var = tk.StringVar(value="")
        self.in_place_var = tk.BooleanVar(value=False)
        self.strategy_var = tk.StringVar(value="by_category")
        self.current_plan = []
        self.watcher: Optional[BackgroundWatcher] = None
        self.is_watching = False

        self._setup_styles()
        self._build_ui()

        # Set default sample folder if exists
        sample_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "tests", "sample_inbox"))
        if os.path.exists(sample_path):
            self.source_dir_var.set(sample_path)
            self.target_dir_var.set(os.path.join(os.path.dirname(sample_path), "organized_output"))

    def _setup_styles(self):
        self.style = ttk.Style(self)
        self.style.theme_use("clam")

        # Global ttk styles
        self.style.configure(".", background=THEME["bg_dark"], foreground=THEME["text_primary"])
        self.style.configure("Card.TFrame", background=THEME["bg_card"], relief="flat")

        # Treeview styling
        self.style.configure(
            "Custom.Treeview",
            background=THEME["bg_input"],
            foreground=THEME["text_primary"],
            fieldbackground=THEME["bg_input"],
            rowheight=28,
            font=("Segoe UI", 9)
        )
        self.style.configure(
            "Custom.Treeview.Heading",
            background=THEME["bg_card"],
            foreground=THEME["text_secondary"],
            font=("Segoe UI", 9, "bold"),
            relief="flat"
        )
        self.style.map("Custom.Treeview", background=[("selected", THEME["accent_blue"])])

    def _build_ui(self):
        # 1. Header Banner
        header_frame = tk.Frame(self, bg=THEME["bg_card"], padx=20, pady=12, highlightbackground=THEME["border"], highlightthickness=1)
        header_frame.pack(fill="x", side="top")

        title_lbl = tk.Label(
            header_frame,
            text="📁 Smart File & PDF Organizer",
            font=("Segoe UI", 16, "bold"),
            bg=THEME["bg_card"],
            fg=THEME["text_primary"]
        )
        title_lbl.pack(side="left")

        badge_lbl = tk.Label(
            header_frame,
            text="🔒 100% Offline • Zero API Keys • Privacy First",
            font=("Segoe UI", 9, "bold"),
            bg="#1e293b",
            fg=THEME["accent_green"],
            padx=10,
            pady=4
        )
        badge_lbl.pack(side="right")

        # Main Scrollable / Stacked Container
        main_container = tk.Frame(self, bg=THEME["bg_dark"], padx=18, pady=14)
        main_container.pack(fill="both", expand=True)

        # 2. Configuration Card (Folder Pickers & Strategy)
        config_card = tk.Frame(main_container, bg=THEME["bg_card"], padx=16, pady=14, highlightbackground=THEME["border"], highlightthickness=1)
        config_card.pack(fill="x", pady=(0, 12))

        # Row 1: Source Folder
        r1 = tk.Frame(config_card, bg=THEME["bg_card"])
        r1.pack(fill="x", pady=4)
        tk.Label(r1, text="Source Folder (Inbox):", font=("Segoe UI", 9, "bold"), bg=THEME["bg_card"], fg=THEME["text_secondary"], width=20, anchor="w").pack(side="left")
        e1 = tk.Entry(r1, textvariable=self.source_dir_var, bg=THEME["bg_input"], fg=THEME["text_primary"], insertbackground="white", font=("Segoe UI", 9), relief="flat", highlightbackground=THEME["border"], highlightthickness=1)
        e1.pack(side="left", fill="x", expand=True, padx=8, ipady=4)
        tk.Button(r1, text="Browse...", command=self._browse_source, bg=THEME["bg_input"], fg=THEME["text_primary"], font=("Segoe UI", 9), relief="flat", padx=12, cursor="hand2").pack(side="left")
        tk.Button(r1, text="Use Downloads", command=self._set_downloads_folder, bg="#1e293b", fg=THEME["text_secondary"], font=("Segoe UI", 8), relief="flat", padx=8, cursor="hand2").pack(side="left", padx=(6, 0))

        # Row 2: Target Folder
        r2 = tk.Frame(config_card, bg=THEME["bg_card"])
        r2.pack(fill="x", pady=4)
        tk.Label(r2, text="Destination Folder:", font=("Segoe UI", 9, "bold"), bg=THEME["bg_card"], fg=THEME["text_secondary"], width=20, anchor="w").pack(side="left")
        self.target_entry = tk.Entry(r2, textvariable=self.target_dir_var, bg=THEME["bg_input"], fg=THEME["text_primary"], insertbackground="white", font=("Segoe UI", 9), relief="flat", highlightbackground=THEME["border"], highlightthickness=1)
        self.target_entry.pack(side="left", fill="x", expand=True, padx=8, ipady=4)
        self.target_btn = tk.Button(r2, text="Browse...", command=self._browse_target, bg=THEME["bg_input"], fg=THEME["text_primary"], font=("Segoe UI", 9), relief="flat", padx=12, cursor="hand2")
        self.target_btn.pack(side="left")
        tk.Checkbutton(
            r2,
            text="Organize in-place",
            variable=self.in_place_var,
            command=self._toggle_in_place,
            bg=THEME["bg_card"],
            fg=THEME["text_secondary"],
            selectcolor=THEME["bg_dark"],
            activebackground=THEME["bg_card"],
            activeforeground="white"
        ).pack(side="left", padx=8)

        # Row 3: Sorting Strategy
        r3 = tk.Frame(config_card, bg=THEME["bg_card"])
        r3.pack(fill="x", pady=(8, 0))
        tk.Label(r3, text="Organization Style:", font=("Segoe UI", 9, "bold"), bg=THEME["bg_card"], fg=THEME["text_secondary"], width=20, anchor="w").pack(side="left")

        strategies = [
            ("By Category (Invoices, Receipts, etc.)", "by_category"),
            ("By Date (Year / Month)", "by_date"),
            ("By Vendor / Sender", "by_vendor"),
            ("Flat Renamed Only", "flat_renamed")
        ]
        for label, val in strategies:
            tk.Radiobutton(
                r3,
                text=label,
                variable=self.strategy_var,
                value=val,
                bg=THEME["bg_card"],
                fg=THEME["text_primary"],
                selectcolor=THEME["bg_dark"],
                activebackground=THEME["bg_card"],
                activeforeground="white",
                font=("Segoe UI", 9)
            ).pack(side="left", padx=6)

        # 3. Action Toolbar
        action_bar = tk.Frame(main_container, bg=THEME["bg_dark"])
        action_bar.pack(fill="x", pady=(0, 10))

        # Preview Dry-Run
        self.btn_preview = tk.Button(
            action_bar,
            text="🔍 1. Scan & Preview (Dry-Run)",
            command=self._run_scan_preview,
            bg=THEME["accent_amber"],
            fg="#111827",
            font=("Segoe UI", 9, "bold"),
            relief="flat",
            padx=16,
            pady=6,
            cursor="hand2"
        )
        self.btn_preview.pack(side="left", padx=(0, 8))

        # Execute Organize
        self.btn_execute = tk.Button(
            action_bar,
            text="⚡ 2. Execute Organization",
            command=self._run_execution,
            bg=THEME["accent_green"],
            fg="#ffffff",
            font=("Segoe UI", 9, "bold"),
            relief="flat",
            padx=16,
            pady=6,
            cursor="hand2"
        )
        self.btn_execute.pack(side="left", padx=(0, 8))

        # 1-Click Undo
        self.btn_undo = tk.Button(
            action_bar,
            text="↩️ Undo Last Batch",
            command=self._run_undo,
            bg="#374151",
            fg=THEME["text_primary"],
            font=("Segoe UI", 9),
            relief="flat",
            padx=12,
            pady=6,
            cursor="hand2"
        )
        self.btn_undo.pack(side="left", padx=(0, 8))

        # Auto-Watch Toggle
        self.btn_watch = tk.Button(
            action_bar,
            text="▶️ Start Live Auto-Watch",
            command=self._toggle_auto_watch,
            bg=THEME["accent_purple"],
            fg="#ffffff",
            font=("Segoe UI", 9, "bold"),
            relief="flat",
            padx=14,
            pady=6,
            cursor="hand2"
        )
        self.btn_watch.pack(side="right")

        # 4. Preview Data Table
        table_card = tk.Frame(main_container, bg=THEME["bg_card"], highlightbackground=THEME["border"], highlightthickness=1)
        table_card.pack(fill="both", expand=True, pady=(0, 10))

        columns = ("original", "type", "vendor", "date", "ref", "amount", "target")
        self.tree = ttk.Treeview(table_card, columns=columns, show="headings", style="Custom.Treeview")

        self.tree.heading("original", text="Original Filename")
        self.tree.heading("type", text="Detected Type")
        self.tree.heading("vendor", text="Vendor / Sender")
        self.tree.heading("date", text="Date")
        self.tree.heading("ref", text="Ref / Invoice #")
        self.tree.heading("amount", text="Total")
        self.tree.heading("target", text="Target Destination & Name")

        self.tree.column("original", width=220, anchor="w")
        self.tree.column("type", width=120, anchor="w")
        self.tree.column("vendor", width=120, anchor="w")
        self.tree.column("date", width=90, anchor="center")
        self.tree.column("ref", width=110, anchor="w")
        self.tree.column("amount", width=80, anchor="e")
        self.tree.column("target", width=280, anchor="w")

        tree_scroll_y = ttk.Scrollbar(table_card, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=tree_scroll_y.set)

        self.tree.pack(side="left", fill="both", expand=True)
        tree_scroll_y.pack(side="right", fill="y")

        # 5. Live Activity Log Footer
        log_frame = tk.Frame(main_container, bg=THEME["bg_card"], highlightbackground=THEME["border"], highlightthickness=1)
        log_frame.pack(fill="x", side="bottom")

        log_hdr = tk.Frame(log_frame, bg=THEME["bg_card"], padx=10, pady=4)
        log_hdr.pack(fill="x")
        tk.Label(log_hdr, text="Activity Log & Status", font=("Segoe UI", 8, "bold"), bg=THEME["bg_card"], fg=THEME["text_secondary"]).pack(side="left")

        self.log_text = tk.Text(log_frame, height=5, bg=THEME["bg_input"], fg=THEME["text_primary"], font=("Consolas", 9), relief="flat", padx=8, pady=6)
        self.log_text.pack(fill="x", padx=8, pady=(0, 6))
        self.log("Ready. Select an inbox folder and click 'Scan & Preview (Dry-Run)' to start.")

    def log(self, text: str):
        """Appends message to activity log in a thread-safe way."""
        def _append():
            self.log_text.insert(tk.END, f"{text}\n")
            self.log_text.see(tk.END)
        self.after(0, _append)

    def _browse_source(self):
        d = filedialog.askdirectory(title="Select Source / Inbox Folder")
        if d:
            self.source_dir_var.set(d)
            if not self.target_dir_var.get() and not self.in_place_var.get():
                self.target_dir_var.set(os.path.join(d, "Organized"))

    def _browse_target(self):
        d = filedialog.askdirectory(title="Select Destination Folder")
        if d:
            self.target_dir_var.set(d)

    def _set_downloads_folder(self):
        user_home = os.path.expanduser("~")
        downloads = os.path.join(user_home, "Downloads")
        if os.path.exists(downloads):
            self.source_dir_var.set(downloads)
            self.target_dir_var.set(os.path.join(downloads, "Organized"))
            self.log(f"Set source to Downloads folder: {downloads}")

    def _toggle_in_place(self):
        if self.in_place_var.get():
            self.target_entry.configure(state="disabled")
            self.target_btn.configure(state="disabled")
        else:
            self.target_entry.configure(state="normal")
            self.target_btn.configure(state="normal")

    def _get_target_dir(self) -> str:
        if self.in_place_var.get():
            return self.source_dir_var.get()
        return self.target_dir_var.get() or self.source_dir_var.get()

    def _run_scan_preview(self):
        source = self.source_dir_var.get().strip()
        if not source or not os.path.exists(source):
            messagebox.showwarning("Invalid Source", "Please select a valid source folder.")
            return

        target = self._get_target_dir()
        strategy = self.strategy_var.get()

        self.log(f"Scanning files in '{source}' using strategy '{strategy}'...")

        # Clear existing table rows
        for row in self.tree.get_children():
            self.tree.delete(row)

        try:
            organizer = FolderOrganizer(source, target, strategy)
            self.current_plan = organizer.scan_files()

            if not self.current_plan:
                self.log("⚠️ No organizeable files found in the source directory.")
                return

            # Populate preview table
            for item in self.current_plan:
                rel_target = os.path.join(item["destination_subdir"], item["proposed_filename"]) if item["destination_subdir"] else item["proposed_filename"]
                self.tree.insert(
                    "",
                    "end",
                    values=(
                        item["original_filename"],
                        item["doc_type"],
                        item["vendor"],
                        item["date"],
                        item["ref_number"],
                        item["amount"],
                        rel_target
                    )
                )

            self.log(f"📋 Scan complete: {len(self.current_plan)} file(s) analyzed. Review the preview table above.")
        except Exception as e:
            self.log(f"❌ Error during scan: {e}")
            messagebox.showerror("Scan Error", str(e))

    def _run_execution(self):
        if not self.current_plan:
            messagebox.showinfo("No Plan Ready", "Please run 'Scan & Preview (Dry-Run)' first to review changes.")
            return

        source = self.source_dir_var.get().strip()
        target = self._get_target_dir()
        strategy = self.strategy_var.get()

        confirm = messagebox.askyesno(
            "Confirm Organization",
            f"Are you sure you want to organize {len(self.current_plan)} file(s)?\n\nYou can revert this at any time using 'Undo Last Batch'."
        )
        if not confirm:
            return

        try:
            organizer = FolderOrganizer(source, target, strategy)
            results = organizer.execute_plan(self.current_plan, dry_run=False)

            self.log(f"✅ Organization complete! {results['processed']} file(s) moved/renamed, {results['skipped']} skipped.")
            if results["errors"]:
                for err in results["errors"]:
                    self.log(f"⚠️ Error with {err['file']}: {err['error']}")

            # Clear plan & table
            self.current_plan = []
            for row in self.tree.get_children():
                self.tree.delete(row)

            messagebox.showinfo(
                "Success",
                f"Successfully organized {results['processed']} file(s)!\nSaved to: {target}"
            )
        except Exception as e:
            self.log(f"❌ Error during execution: {e}")
            messagebox.showerror("Execution Error", str(e))

    def _run_undo(self):
        source = self.source_dir_var.get().strip()
        target = self._get_target_dir()
        strategy = self.strategy_var.get()

        confirm = messagebox.askyesno("Confirm Undo", "Revert the last batch of organized files back to their original locations?")
        if not confirm:
            return

        try:
            organizer = FolderOrganizer(source, target, strategy)
            res = organizer.undo_last_batch()
            if res["success"]:
                self.log(f"↩️ Rollback complete! Reverted {res['reverted']} file(s) to their original paths.")
                messagebox.showinfo("Undo Successful", f"Reverted {res['reverted']} file(s).")
                # Refresh table
                self._run_scan_preview()
            else:
                self.log(f"⚠️ Undo notice: {res['message']}")
                messagebox.showwarning("Cannot Undo", res["message"])
        except Exception as e:
            self.log(f"❌ Error during undo: {e}")
            messagebox.showerror("Undo Error", str(e))

    def _toggle_auto_watch(self):
        if not self.is_watching:
            source = self.source_dir_var.get().strip()
            if not source or not os.path.exists(source):
                messagebox.showwarning("Invalid Source", "Please select a valid source folder to monitor.")
                return

            target = self._get_target_dir()
            strategy = self.strategy_var.get()

            self.watcher = BackgroundWatcher(source, target, strategy, on_log=self.log)
            self.watcher.start()
            self.is_watching = True
            self.btn_watch.configure(text="⏹️ Stop Live Auto-Watch", bg=THEME["accent_red"])
        else:
            if self.watcher:
                self.watcher.stop()
                self.watcher = None
            self.is_watching = False
            self.btn_watch.configure(text="▶️ Start Live Auto-Watch", bg=THEME["accent_purple"])


def main():
    app = SmartOrganizerGUI()
    app.mainloop()


if __name__ == "__main__":
    main()

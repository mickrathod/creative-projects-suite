import React, { useState } from 'react';
import { Icon } from '../Common/Icons';
import { sounds } from '../../audio/sound-effects';
import { exportBackup, importBackup } from '../../data/storage';

export const BackupModal = ({ isOpen, onClose, onDataReloaded }) => {
  const [importText, setImportText] = useState('');
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleExport = () => {
    sounds.playClick();
    exportBackup();
    setMsg('Backup file downloaded successfully!');
  };

  const handleImport = () => {
    sounds.playClick();
    if (!importText.trim()) {
      setMsg('Please paste backup JSON data first.');
      return;
    }
    const success = importBackup(importText.trim());
    if (success) {
      setMsg('Data successfully imported!');
      sounds.playSuccess();
      setTimeout(() => {
        if (onDataReloaded) onDataReloaded();
        onClose();
      }, 700);
    } else {
      setMsg('Failed to parse backup JSON. Please check formatting.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportText(event.target.result);
      setMsg(`File "${file.name}" loaded into field. Click Import below.`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-card backup" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Icon name="download" size={20} color="var(--cyan-primary)" />
            <h3 className="display-title">DATA BACKUP & SYNC</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body-section">
          <p className="modal-info-text">
            All your Winter Arc holds, workouts, skateboarding hours, and journal logs are stored safely in your browser. You can export a portable JSON backup anytime.
          </p>

          <div className="backup-actions-grid">
            <button className="backup-action-card" onClick={handleExport}>
              <div className="bac-icon">
                <Icon name="download" size={24} color="var(--cyan-primary)" />
              </div>
              <div className="bac-title mono">EXPORT TO FILE</div>
              <p className="bac-sub">Download complete Winter Arc snapshot (.json)</p>
            </button>

            <label className="backup-action-card upload-label">
              <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
              <div className="bac-icon">
                <Icon name="upload" size={24} color="var(--amber-primary)" />
              </div>
              <div className="bac-title mono">LOAD FROM FILE</div>
              <p className="bac-sub">Choose a previously saved .json file</p>
            </label>
          </div>

          <div className="import-paste-box">
            <label className="form-label mono">OR PASTE JSON CODE TO RESTORE:</label>
            <textarea
              rows="3"
              className="mono text-xs"
              placeholder='{"profile": {...}, "daily": {...}}'
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            ></textarea>

            <div className="import-btn-row">
              <button className="btn-import-confirm" onClick={handleImport}>
                Import & Apply Data
              </button>
            </div>
          </div>

          {msg && <div className="modal-status-msg mono">{msg}</div>}
        </div>
      </div>
    </div>
  );
};

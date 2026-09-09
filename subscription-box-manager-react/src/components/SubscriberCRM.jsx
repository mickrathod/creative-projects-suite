import React, { useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import { useBox } from '../context/BoxContext';
import { useToast } from './common/Toast';

const STATUS_OPTIONS = ['Active', 'Paused', 'Cancelled'];
const PLAN_OPTIONS = ['Monthly', 'Quarterly', 'Annual'];

export function SubscriberCRM() {
  const { subscribers, addSubscriber, updateSubscriberStatus, deleteSubscriber } = useBox();
  const { addToast } = useToast();
  const [newSub, setNewSub] = useState({ name: '', email: '', plan: 'Monthly' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newSub.name.trim() || !newSub.email.trim()) {
      addToast('Name and email are required', 'error');
      return;
    }
    addSubscriber(newSub);
    setNewSub({ name: '', email: '', plan: 'Monthly' });
    addToast('Subscriber added!', 'success');
  };

  return (
    <div>
      <div className="panel-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="panel-title">Subscriber CRM</h2>
          <p className="panel-desc">
            Every subscriber, their plan, and lifetime value in one place. Pause or cancel without touching billing manually.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleAdd}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          background: '#090d16',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '18px',
          marginBottom: '28px',
          alignItems: 'end'
        }}
      >
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-input"
            value={newSub.name}
            onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={newSub.email}
            onChange={(e) => setNewSub({ ...newSub, email: e.target.value })}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Plan</label>
          <select
            className="form-select"
            value={newSub.plan}
            onChange={(e) => setNewSub({ ...newSub, plan: e.target.value })}
          >
            {PLAN_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-indigo" style={{ padding: '10px' }}>
          <UserPlus size={15} />
          <span>Add Subscriber</span>
        </button>
      </form>

      {subscribers.length === 0 ? (
        <div style={{ color: 'var(--text-dim)', fontSize: '13px', padding: '20px' }}>
          No subscribers yet.
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Joined</th>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Lifetime Value</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(sub => (
                <tr key={sub.id}>
                  <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td>{sub.name}</td>
                  <td>{sub.email}</td>
                  <td>{sub.plan}</td>
                  <td>${sub.lifetimeValue}</td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }}
                      value={sub.status}
                      onChange={(e) => updateSubscriberStatus(sub.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '5px 9px', fontSize: '11px' }}
                      onClick={() => { deleteSubscriber(sub.id); addToast('Subscriber removed', 'info'); }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

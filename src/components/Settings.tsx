import { useState, useEffect, useCallback } from 'react';
import './Settings.css';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  autoRefresh: boolean;
  refreshInterval: number;
  notifications: boolean;
  soundAlerts: boolean;
  breakingNewsBadge: boolean;
  compactView: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: string;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  autoRefresh: true,
  refreshInterval: 5,
  notifications: true,
  soundAlerts: false,
  breakingNewsBadge: true,
  compactView: false,
  fontSize: 'medium',
  language: 'en',
};

let store: any = null;

async function initStore() {
  if (store) return store;
  try {
    const { load } = await import('@tauri-apps/plugin-store');
    store = await load('settings.json');
    return store;
  } catch {
    return null;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initStore().then(async (s) => {
      if (s) {
        const saved = await s.get('appSettings') as AppSettings | null;
        if (saved) {
          setSettings({ ...defaultSettings, ...saved });
        }
      }
      setLoading(false);
    });
  }, []);

  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      if (store) {
        store.set('appSettings', newSettings);
        store.save();
      }
      return newSettings;
    });
  }, []);

  return { settings, updateSetting, loading };
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('general');
  const { settings, updateSetting, loading } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="settings-content">
          <nav className="settings-tabs">
            <button
              className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
              General
            </button>
            <button
              className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              Appearance
            </button>
            <button
              className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              Notifications
            </button>
            <button
              className={`settings-tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              About
            </button>
          </nav>

          <div className="settings-panel">
            {loading ? (
              <div className="settings-loading">Loading...</div>
            ) : activeTab === 'general' && (
              <div className="settings-section">
                <h3>Data & Refresh</h3>
                
                <label className="settings-row">
                  <span>
                    <span className="settings-label">Auto-refresh feed</span>
                    <span className="settings-desc">Automatically update news feed</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.autoRefresh}
                    onChange={(e) => updateSetting('autoRefresh', e.target.checked)}
                    className="settings-toggle"
                  />
                </label>

                {settings.autoRefresh && (
                  <label className="settings-row">
                    <span>
                      <span className="settings-label">Refresh interval</span>
                      <span className="settings-desc">Time between updates</span>
                    </span>
                    <select
                      value={settings.refreshInterval}
                      onChange={(e) => updateSetting('refreshInterval', Number(e.target.value))}
                      className="settings-select"
                    >
                      <option value={1}>1 minute</option>
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                    </select>
                  </label>
                )}

                <label className="settings-row">
                  <span>
                    <span className="settings-label">Language</span>
                    <span className="settings-desc">Interface language</span>
                  </span>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="settings-select"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </label>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="settings-section">
                <h3>Display</h3>
                
                <label className="settings-row">
                  <span>
                    <span className="settings-label">Theme</span>
                    <span className="settings-desc">Color scheme</span>
                  </span>
                  <select
                    value={settings.theme}
                    onChange={(e) => updateSetting('theme', e.target.value as 'dark' | 'light' | 'system')}
                    className="settings-select"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </label>

                <label className="settings-row">
                  <span>
                    <span className="settings-label">Font size</span>
                    <span className="settings-desc">Base text size</span>
                  </span>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', e.target.value as 'small' | 'medium' | 'large')}
                    className="settings-select"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </label>

                <label className="settings-row">
                  <span>
                    <span className="settings-label">Compact view</span>
                    <span className="settings-desc">Show more news in less space</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.compactView}
                    onChange={(e) => updateSetting('compactView', e.target.checked)}
                    className="settings-toggle"
                  />
                </label>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h3>Alerts & Notifications</h3>
                
                <label className="settings-row">
                  <span>
                    <span className="settings-label">Push notifications</span>
                    <span className="settings-desc">Desktop notifications for breaking news</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => updateSetting('notifications', e.target.checked)}
                    className="settings-toggle"
                  />
                </label>

                <label className="settings-row">
                  <span>
                    <span className="settings-label">Sound alerts</span>
                    <span className="settings-desc">Play sound on breaking news</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.soundAlerts}
                    onChange={(e) => updateSetting('soundAlerts', e.target.checked)}
                    className="settings-toggle"
                  />
                </label>

                <label className="settings-row">
                  <span>
                    <span className="settings-label">Breaking news badge</span>
                    <span className="settings-desc">Show badge in taskbar</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.breakingNewsBadge}
                    onChange={(e) => updateSetting('breakingNewsBadge', e.target.checked)}
                    className="settings-toggle"
                  />
                </label>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="settings-section">
                <div className="about-header">
                  <div className="about-icon">
                    <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="35" stroke="var(--accent-blue)" strokeWidth="3" />
                      <circle cx="50" cy="50" r="25" stroke="var(--accent-red)" strokeWidth="2" />
                      <circle cx="50" cy="50" r="5" fill="var(--text-primary)" />
                    </svg>
                  </div>
                  <div>
                    <h3>GeoIntel Dashboard</h3>
                    <p>Version 1.0.0</p>
                  </div>
                </div>

                <div className="about-info">
                  <p>
                    Real-time geopolitical intelligence and military news dashboard for 
                    security analysts and decision makers.
                  </p>
                </div>

                <div className="tech-stack">
                  <span className="tech-badge">React 18</span>
                  <span className="tech-badge">TypeScript</span>
                  <span className="tech-badge">Tauri 2.0</span>
                  <span className="tech-badge">Rust</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <button 
            className="settings-reset"
            onClick={() => {
              Object.entries(defaultSettings).forEach(([key, value]) => {
                updateSetting(key as keyof AppSettings, value);
              });
            }}
          >
            Reset to defaults
          </button>
          <button className="settings-save" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

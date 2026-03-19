import { useState, useEffect, useCallback } from 'react';
import { useAppData } from '../hooks/useAppData';
import type { CategoryInfo, TagInfo, FeedInfo } from '../types';
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
  const { data: appData, addCategory, deleteCategory, addTag, deleteTag, addFeed, deleteFeed, toggleFeedEnabled } = useAppData();

  const [newCategory, setNewCategory] = useState({ id: '', name: '', icon: 'globe', color: 'blue' });

const ICONS = [
  { id: 'globe', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg> },
  { id: 'shield', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
  { id: 'chart', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg> },
  { id: 'cpu', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" /></svg> },
  { id: 'handshake', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" /></svg> },
  { id: 'lock', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> },
  { id: 'rocket', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg> },
  { id: 'flame', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg> },
  { id: 'bank', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg> },
  { id: 'plane', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 4s-2 1-3 2L12 9l-7-2-6 6 4 4-4 8 8-8 2-2-3.5 3.5 2 8.2c.6 1.4 1.8 2.8 3 2.8s2.4-1.4 3-2.8z" /></svg> },
  { id: 'satellite', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 7L9 3 5 7l4 4m-7 10l4 4-4 4 4 4M12 22V2l5 5-5 5-5-5 5-5z" /></svg> },
  { id: 'bell', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg> },
];
  const [newTag, setNewTag] = useState({ id: '', name: '' });
  const [newFeed, setNewFeed] = useState({ name: '', url: '', category: 'geopolitics' });

  const handleAddCategory = () => {
    if (newCategory.id && newCategory.name) {
      addCategory({ ...newCategory, id: newCategory.id.toLowerCase().replace(/\s+/g, '-') });
      setNewCategory({ id: '', name: '', icon: 'globe', color: 'blue' });
    }
  };

  const handleAddTag = () => {
    if (newTag.id && newTag.name) {
      addTag({ id: newTag.id.toLowerCase().replace(/\s+/g, '-'), name: newTag.name });
      setNewTag({ id: '', name: '' });
    }
  };

  const handleAddFeed = () => {
    if (newFeed.name && newFeed.url) {
      addFeed({
        id: Date.now().toString(),
        name: newFeed.name,
        url: newFeed.url,
        category: newFeed.category,
        enabled: true,
      });
      setNewFeed({ name: '', url: '', category: 'geopolitics' });
    }
  };

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
              className={`settings-tab ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              Categories
            </button>
            <button
              className={`settings-tab ${activeTab === 'tags' ? 'active' : ''}`}
              onClick={() => setActiveTab('tags')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              Tags
            </button>
            <button
              className={`settings-tab ${activeTab === 'feeds' ? 'active' : ''}`}
              onClick={() => setActiveTab('feeds')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36m0-6.18a8.18 8.18 0 0 1 8.18 8.18m-8.18-12.18a12.18 12.18 0 1 0 12.18 12.18"/>
              </svg>
              RSS Feeds
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

            {activeTab === 'categories' && (
              <div className="settings-section">
                <h3>Categories</h3>
                <div className="edit-list">
                  {appData.categories.map((cat: CategoryInfo) => (
                    <div key={cat.id} className="edit-item">
                      <div className="edit-item-info">
                        <span className="edit-item-name">{cat.name}</span>
                        <span className="edit-item-id">{cat.id}</span>
                      </div>
                      <button 
                        className="edit-delete"
                        onClick={() => deleteCategory(cat.id)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="add-form">
                  <input
                    type="text"
                    placeholder="ID (e.g., 'energy')"
                    value={newCategory.id}
                    onChange={(e) => setNewCategory({ ...newCategory, id: e.target.value })}
                    className="settings-input"
                  />
                  <input
                    type="text"
                    placeholder="Name (e.g., 'Energy')"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="settings-input"
                  />
                  <div className="icon-selector">
                    <label className="icon-selector-label">Icon</label>
                    <div className="icon-grid">
                      {ICONS.map((icon) => (
                        <button
                          key={icon.id}
                          type="button"
                          className={`icon-option ${newCategory.icon === icon.id ? 'selected' : ''}`}
                          onClick={() => setNewCategory({ ...newCategory, icon: icon.id })}
                        >
                          {icon.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <select
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="settings-select"
                  >
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                    <option value="amber">Amber</option>
                    <option value="cyan">Cyan</option>
                    <option value="violet">Violet</option>
                    <option value="green">Green</option>
                  </select>
                  <button className="add-btn" onClick={handleAddCategory}>Add</button>
                </div>
              </div>
            )}

            {activeTab === 'tags' && (
              <div className="settings-section">
                <h3>Tags</h3>
                <div className="edit-list">
                  {appData.tags.map((tag: TagInfo) => (
                    <div key={tag.id} className="edit-item">
                      <div className="edit-item-info">
                        <span className="edit-item-name">{tag.name}</span>
                        <span className="edit-item-id">{tag.id}</span>
                      </div>
                      <button 
                        className="edit-delete"
                        onClick={() => deleteTag(tag.id)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="add-form">
                  <input
                    type="text"
                    placeholder="ID (e.g., 'iran')"
                    value={newTag.id}
                    onChange={(e) => setNewTag({ ...newTag, id: e.target.value })}
                    className="settings-input"
                  />
                  <input
                    type="text"
                    placeholder="Name (e.g., 'Irán')"
                    value={newTag.name}
                    onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                    className="settings-input"
                  />
                  <button className="add-btn" onClick={handleAddTag}>Add</button>
                </div>
              </div>
            )}

            {activeTab === 'feeds' && (
              <div className="settings-section">
                <h3>RSS Feeds</h3>
                <div className="edit-list">
                  {appData.feeds.map((feed: FeedInfo) => (
                    <div key={feed.id} className="edit-item">
                      <div className="edit-item-info">
                        <span className="edit-item-name">{feed.name}</span>
                        <span className="edit-item-id">{feed.category}</span>
                      </div>
                      <div className="edit-actions">
                        <label className="mini-toggle">
                          <input
                            type="checkbox"
                            checked={feed.enabled}
                            onChange={() => toggleFeedEnabled(feed.id)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <button 
                          className="edit-delete"
                          onClick={() => deleteFeed(feed.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="add-form">
                  <input
                    type="text"
                    placeholder="Feed Name"
                    value={newFeed.name}
                    onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
                    className="settings-input"
                  />
                  <input
                    type="text"
                    placeholder="RSS URL"
                    value={newFeed.url}
                    onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
                    className="settings-input"
                  />
                  <select
                    value={newFeed.category}
                    onChange={(e) => setNewFeed({ ...newFeed, category: e.target.value })}
                    className="settings-select"
                  >
                    {appData.categories.map((cat: CategoryInfo) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <button className="add-btn" onClick={handleAddFeed}>Add</button>
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

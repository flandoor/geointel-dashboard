import { useState, useEffect, useCallback } from 'react';
import type { CategoryInfo, TagInfo, FeedInfo, AppData } from '../types';
import { defaultCategories, defaultTags, defaultFeeds } from '../types';

let store: any = null;

async function initStore() {
  if (store) return store;
  try {
    const { load } = await import('@tauri-apps/plugin-store');
    store = await load('appdata.json');
    return store;
  } catch {
    return null;
  }
}

export function useAppData() {
  const [data, setData] = useState<AppData>({
    categories: defaultCategories,
    tags: defaultTags,
    feeds: defaultFeeds,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initStore().then(async (s) => {
      if (s) {
        const saved = await s.get('appData') as AppData | null;
        if (saved) {
          setData({
            categories: saved.categories?.length ? saved.categories : defaultCategories,
            tags: saved.tags?.length ? saved.tags : defaultTags,
            feeds: saved.feeds?.length ? saved.feeds : defaultFeeds,
          });
        }
      }
      setLoading(false);
    });
  }, []);

  const saveData = useCallback(async (newData: AppData) => {
    setData(newData);
    if (store) {
      await store.set('appData', newData);
      await store.save();
    }
  }, []);

  const addCategory = useCallback((category: CategoryInfo) => {
    const newData = { ...data, categories: [...data.categories, category] };
    saveData(newData);
  }, [data, saveData]);

  const updateCategory = useCallback((id: string, updates: Partial<CategoryInfo>) => {
    const newData = {
      ...data,
      categories: data.categories.map(c => c.id === id ? { ...c, ...updates } : c),
    };
    saveData(newData);
  }, [data, saveData]);

  const deleteCategory = useCallback((id: string) => {
    const newData = { ...data, categories: data.categories.filter(c => c.id !== id) };
    saveData(newData);
  }, [data, saveData]);

  const addTag = useCallback((tag: TagInfo) => {
    const newData = { ...data, tags: [...data.tags, tag] };
    saveData(newData);
  }, [data, saveData]);

  const updateTag = useCallback((id: string, updates: Partial<TagInfo>) => {
    const newData = {
      ...data,
      tags: data.tags.map(t => t.id === id ? { ...t, ...updates } : t),
    };
    saveData(newData);
  }, [data, saveData]);

  const deleteTag = useCallback((id: string) => {
    const newData = { ...data, tags: data.tags.filter(t => t.id !== id) };
    saveData(newData);
  }, [data, saveData]);

  const addFeed = useCallback((feed: FeedInfo) => {
    const newData = { ...data, feeds: [...data.feeds, feed] };
    saveData(newData);
  }, [data, saveData]);

  const updateFeed = useCallback((id: string, updates: Partial<FeedInfo>) => {
    const newData = {
      ...data,
      feeds: data.feeds.map(f => f.id === id ? { ...f, ...updates } : f),
    };
    saveData(newData);
  }, [data, saveData]);

  const deleteFeed = useCallback((id: string) => {
    const newData = { ...data, feeds: data.feeds.filter(f => f.id !== id) };
    saveData(newData);
  }, [data, saveData]);

  const toggleFeedEnabled = useCallback((id: string) => {
    const newData = {
      ...data,
      feeds: data.feeds.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f),
    };
    saveData(newData);
  }, [data, saveData]);

  const resetToDefaults = useCallback(() => {
    const defaultData: AppData = {
      categories: defaultCategories,
      tags: defaultTags,
      feeds: defaultFeeds,
    };
    saveData(defaultData);
  }, [saveData]);

  return {
    data,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addTag,
    updateTag,
    deleteTag,
    addFeed,
    updateFeed,
    deleteFeed,
    toggleFeedEnabled,
    resetToDefaults,
  };
}
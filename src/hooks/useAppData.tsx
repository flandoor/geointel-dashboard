import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { CategoryInfo, TagInfo, FeedInfo, AppData } from '../types';
import { defaultCategories, defaultTags, defaultFeeds } from '../types';

interface AppDataContextType {
  data: AppData;
  loading: boolean;
  addCategory: (category: CategoryInfo) => void;
  updateCategory: (id: string, updates: Partial<CategoryInfo>) => void;
  deleteCategory: (id: string) => void;
  addTag: (tag: TagInfo) => void;
  updateTag: (id: string, updates: Partial<TagInfo>) => void;
  deleteTag: (id: string) => void;
  addFeed: (feed: FeedInfo) => void;
  updateFeed: (id: string, updates: Partial<FeedInfo>) => void;
  deleteFeed: (id: string) => void;
  toggleFeedEnabled: (id: string) => void;
  toggleBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
  resetToDefaults: () => void;
}

const AppDataContext = createContext<AppDataContextType | null>(null);

let store: any = null;
let storeVersion = 0;

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

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({
    categories: defaultCategories,
    tags: defaultTags,
    feeds: defaultFeeds,
    bookmarkedArticleIds: [],
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
            bookmarkedArticleIds: saved.bookmarkedArticleIds || [],
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
      storeVersion++;
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
      bookmarkedArticleIds: [],
    };
    saveData(defaultData);
  }, [saveData]);

  const toggleBookmark = useCallback((articleId: string) => {
    const current = data.bookmarkedArticleIds;
    const updated = current.includes(articleId)
      ? current.filter(id => id !== articleId)
      : [...current, articleId];
    const newData = { ...data, bookmarkedArticleIds: updated };
    saveData(newData);
  }, [data, saveData]);

  const isBookmarked = useCallback((articleId: string) => {
    return data.bookmarkedArticleIds.includes(articleId);
  }, [data.bookmarkedArticleIds]);

  return (
    <AppDataContext.Provider value={{
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
      toggleBookmark,
      isBookmarked,
      resetToDefaults,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}

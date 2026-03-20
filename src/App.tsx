import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import NewsDetail from './components/NewsDetail';
import MetricsPanel from './components/MetricsPanel';
import Settings from './components/Settings';
import { AppDataProvider, useAppData } from './hooks/useAppData';
import { fetchAllFeeds } from './services/rssService';
import type { NewsArticle } from './types';
import './App.css';

let articlesStore: any = null;

async function initArticlesStore() {
  if (articlesStore) return articlesStore;
  try {
    const { load } = await import('@tauri-apps/plugin-store');
    articlesStore = await load('articles.json');
    return articlesStore;
  } catch {
    return null;
  }
}

async function loadSavedArticles(): Promise<NewsArticle[]> {
  const store = await initArticlesStore();
  if (store) {
    const saved = await store.get('articles') as NewsArticle[] | null;
    return saved || [];
  }
  return [];
}

async function saveArticles(articles: NewsArticle[]) {
  const store = await initArticlesStore();
  if (store) {
    await store.set('articles', articles);
    await store.save();
  }
}

function AppContent() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const hasFetched = useRef(false);
  const feedsCountRef = useRef(0);

  const { data: appData, loading: dataLoading } = useAppData();

  const fetchNews = useCallback(async (silent = false) => {
    if (dataLoading || appData.feeds.length === 0) return;
    if (!silent) setLoading(true);
    try {
      const fetched = await fetchAllFeeds(appData.feeds);
      setArticles(fetched);
      await saveArticles(fetched);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [appData.feeds, dataLoading]);

  useEffect(() => {
    loadSavedArticles().then(cached => {
      if (cached.length > 0) {
        setArticles(cached);
      }
      if (!hasFetched.current) {
        hasFetched.current = true;
        fetchNews(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!dataLoading && appData.feeds.length > 0) {
      if (appData.feeds.length !== feedsCountRef.current) {
        feedsCountRef.current = appData.feeds.length;
        fetchNews(true);
      }
      if (!hasFetched.current) {
        hasFetched.current = true;
        const interval = setInterval(() => fetchNews(true), 5 * 60 * 1000);
        return () => clearInterval(interval);
      }
    }
  }, [appData.feeds, dataLoading, fetchNews]);

  const activeFilters = (selectedCategory ? 1 : 0) + selectedTags.length;

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
    setSelectedFeed(null);
    setSearchQuery('');
  };

  const handleFeedSelect = (feedId: string | null) => {
    setSelectedFeed(feedId);
  };

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  const handleCloseDetail = () => {
    setSelectedArticle(null);
  };

  const filteredArticles = articles.filter((article) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query)) ||
        article.category.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    if (selectedCategory && article.category !== selectedCategory) {
      return false;
    }
    if (selectedTags.length > 0) {
      const hasMatchingTag = article.tags.some((tag) => selectedTags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    if (selectedFeed && article.source !== appData.feeds.find(f => f.id === selectedFeed)?.name) {
      return false;
    }
    return true;
  });

  const breakingNews = filteredArticles.filter((a) => a.isBreaking);
  const regularNews = filteredArticles.filter((a) => !a.isBreaking);

  if (dataLoading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        categories={appData.categories}
        tags={appData.tags}
        feeds={appData.feeds}
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
        selectedFeed={selectedFeed}
        onCategoryChange={handleCategoryChange}
        onTagToggle={handleTagToggle}
        onFeedSelect={handleFeedSelect}
      />

      <main className="main-content">
        <Header 
          activeFilters={activeFilters} 
          onClearFilters={clearFilters}
          onSettingsClick={() => setSettingsOpen(true)}
          isLoading={loading}
          onRefresh={fetchNews}
          feedCount={appData.feeds.filter(f => f.enabled).length}
          articleCount={articles.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="content">
          <MetricsPanel />

          {breakingNews.length > 0 && (
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="breaking-indicator" />
                  Breaking News
                </h2>
                <span className="count">{breakingNews.length} stories</span>
              </div>
              <div className="breaking-grid">
                {breakingNews.map((article, index) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    variant="featured"
                    index={index}
                    onClick={handleArticleClick}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="section">
            <div className="section-header">
              <h2 className="section-title">
                {selectedCategory 
                  ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Intelligence`
                  : 'All News Feed'
                }
              </h2>
              <span className="count">{regularNews.length} stories</span>
            </div>
            <div className="news-grid">
              {regularNews.map((article, index) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  index={index + breakingNews.length}
                  onClick={handleArticleClick}
                />
              ))}
            </div>
          </section>

          {filteredArticles.length === 0 && (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <h3>No results found</h3>
              <p>Try adjusting your filters to see more content</p>
              <button onClick={clearFilters} className="empty-clear-btn">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {selectedArticle && (
        <NewsDetail article={selectedArticle} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

function App() {
  return (
    <AppDataProvider>
      <AppContent />
    </AppDataProvider>
  );
}

export default App;

import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import NewsDetail from './components/NewsDetail';
import NewsListItem from './components/NewsListItem';
import NewsPanel from './components/NewsPanel';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBookmarks, setSelectedBookmarks] = useState(false);
  const hasFetched = useRef(false);
  const feedsCountRef = useRef(0);

  const { data: appData, loading: dataLoading, toggleBookmark, isBookmarked, clearAllBookmarks } = useAppData();

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
    }
  }, [appData.feeds, dataLoading, fetchNews]);

  useEffect(() => {
    if (!dataLoading && appData.feeds.length > 0) {
      const interval = setInterval(() => fetchNews(true), 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [dataLoading, appData.feeds.length, fetchNews]);

  const activeFilters = (selectedCategory ? 1 : 0) + selectedTags.length;

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setSelectedBookmarks(false);
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
    if (viewMode === 'list') {
      setSelectedArticle(article);
    } else {
      setSelectedArticle(article);
      setDetailOpen(true);
    }
  };

  const handleCloseDetail = () => {
    setSelectedArticle(null);
    setDetailOpen(false);
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
    if (selectedFeed) {
      const selectedFeedObj = appData.feeds.find(f => f.id === selectedFeed);
      if (!selectedFeedObj || article.source !== selectedFeedObj.name) {
        return false;
      }
    }
    if (selectedBookmarks && !appData.bookmarkedArticleIds.includes(article.id)) {
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
        selectedBookmarks={selectedBookmarks}
        bookmarkCount={appData.bookmarkedArticleIds.length}
        onCategoryChange={handleCategoryChange}
        onTagToggle={handleTagToggle}
        onFeedSelect={handleFeedSelect}
        onBookmarksToggle={() => { setSelectedBookmarks(!selectedBookmarks); setSelectedCategory(null); }}
        onClearBookmarks={() => { clearAllBookmarks(); setSelectedBookmarks(false); }}
        articleCount={filteredArticles.length}
      />

      <main className="main-content">
        <Header 
          onSettingsClick={() => setSettingsOpen(true)}
          isLoading={loading}
          onRefresh={fetchNews}
          feedCount={appData.feeds.filter(f => f.enabled).length}
          articleCount={articles.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className={`content ${viewMode === 'list' ? 'split-view' : ''}`}>
          <MetricsPanel />

          {viewMode === 'grid' ? (
            <>
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
                        isBookmarked={isBookmarked(article.id)}
                        onBookmarkToggle={toggleBookmark}
                      />
                    ))}
                  </div>
                </section>
              )}

              <section className="section">
                <div className="section-header">
                  <h2 className="section-title">
                    {selectedCategory 
                      ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} News`
                      : 'All News Feed'
                    }
                  </h2>
                  <div className="section-header-right">
                    {activeFilters > 0 && (
                      <button className="clear-filters-inline" onClick={clearFilters}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                        Clear ({activeFilters})
                      </button>
                    )}
                    <span className="count">{regularNews.length} stories</span>
                  </div>
                </div>
                <div className="news-grid">
                  {regularNews.map((article, index) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      index={index + breakingNews.length}
                      onClick={handleArticleClick}
                      isBookmarked={isBookmarked(article.id)}
                      onBookmarkToggle={toggleBookmark}
                    />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="split-view-container">
              <div className="split-list">
                <div className="section-header">
                  <h2 className="section-title">
                    {selectedCategory 
                      ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} News`
                      : 'All News Feed'
                    }
                  </h2>
                  <div className="section-header-right">
                    {activeFilters > 0 && (
                      <button className="clear-filters-inline" onClick={clearFilters}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                        Clear ({activeFilters})
                      </button>
                    )}
                    <span className="count">{filteredArticles.length} stories</span>
                  </div>
                </div>
                <div className="news-list">
                  {filteredArticles.map((article) => (
                    <NewsListItem
                      key={article.id}
                      article={article}
                      isSelected={selectedArticle?.id === article.id}
                      onClick={handleArticleClick}
                      isBookmarked={isBookmarked(article.id)}
                      onBookmarkToggle={toggleBookmark}
                    />
                  ))}
                </div>
              </div>
              <div className="split-panel">
                <NewsPanel 
                  article={selectedArticle} 
                  isBookmarked={selectedArticle ? isBookmarked(selectedArticle.id) : false}
                  onBookmarkToggle={toggleBookmark}
                />
              </div>
            </div>
          )}

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

      {selectedArticle && detailOpen && (
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

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import SummaryTicker from './components/SummaryTicker';
import MetricsPanel from './components/MetricsPanel';
import Settings from './components/Settings';
import { newsArticles } from './data/news';
import type { Category, Tag } from './types';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const activeFilters = (selectedCategory ? 1 : 0) + selectedTags.length;

  const handleCategoryChange = (category: Category | null) => {
    setSelectedCategory(category);
  };

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  const filteredArticles = newsArticles.filter((article) => {
    if (selectedCategory && article.category !== selectedCategory) {
      return false;
    }
    if (selectedTags.length > 0) {
      const hasMatchingTag = article.tags.some((tag) => selectedTags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    return true;
  });

  const breakingNews = filteredArticles.filter((a) => a.isBreaking);
  const regularNews = filteredArticles.filter((a) => !a.isBreaking);

  return (
    <div className="app-container">
      <Sidebar
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
        onCategoryChange={handleCategoryChange}
        onTagToggle={handleTagToggle}
      />

      <main className="main-content">
        <Header 
          activeFilters={activeFilters} 
          onClearFilters={clearFilters}
          onSettingsClick={() => setSettingsOpen(true)}
        />

        <div className="content">
          <div className="top-section">
            <SummaryTicker />
          </div>

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
                  : 'All Intelligence Feed'
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
    </div>
  );
}

export default App;

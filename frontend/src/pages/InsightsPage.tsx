import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, BookOpen, Clock } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Insight } from '../types';
import { api } from '../utils/api';

export const InsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Fertility', 'Maternity', 'Pediatrics', 'Women’s Health'];

  useEffect(() => {
    async function fetchInsights() {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (category !== 'All') queryParams.append('category', category);
        if (search) queryParams.append('search', search);

        const res = await api.get<{ insights: Insight[] }>(`/insights?${queryParams.toString()}`);
        if (res.insights) setInsights(res.insights);
      } catch (err) {
        console.error('Failed to load insights:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [category, search]);

  const featured = insights.find((i) => i.featured) || insights[0];
  const listInsights = featured ? insights.filter((i) => i.id !== featured.id) : insights;

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs items={[{ label: 'Health Journal' }]} />

        {/* Heading Row */}
        <div className="sr-heading-row">
          <div>
            <span className="sr-kicker">A little knowledge. A little reassurance.</span>
            <h1 className="sr-display sr-heading mt-2">
              Health Insights &amp; Journal,<br />
              <em>thoughtful answers.</em>
            </h1>
          </div>
          <p className="sr-copy max-w-md">
            Medical perspectives, patient stories, and clinical guidance written by our reproductive specialists, obstetricians, and pediatricians in Khammam.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[rgba(22,55,76,0.12)]">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                  category === cat
                    ? 'bg-[var(--deep)] text-white'
                    : 'bg-white text-[#5a7d92] border border-[rgba(22,55,76,0.12)] hover:border-[var(--teal)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={15} className="text-[#5a7d92] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              id="insights-search"
              name="search"
              type="search"
              autoComplete="off"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sr-input sr-search-input text-xs rounded-full"
              style={{ paddingLeft: '44px' }}
            />
          </div>
        </div>

        {loading ? (
          <div className="sr-grid sr-grid--three">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="sr-skeleton">
                <div className="sr-skeleton-image" />
                <div className="sr-skeleton-line" />
                <div className="sr-skeleton-line" />
              </div>
            ))}
          </div>
        ) : insights.length === 0 ? (
          <div className="sr-empty">
            <div>
              <h3>No articles found</h3>
              <p>Try clearing your search query or selecting a different health topic.</p>
            </div>
            <button
              onClick={() => {
                setCategory('All');
                setSearch('');
              }}
              className="sr-button sr-button--outline text-xs"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Story */}
            {featured && (
              <Link
                to={`/insights/${featured.slug}`}
                className="sr-card grid grid-cols-1 lg:grid-cols-12 overflow-hidden text-decoration-none text-inherit group"
                style={{ padding: 0 }}
              >
                <div className="lg:col-span-7 sr-media" style={{ minHeight: 340 }}>
                  {featured.image_url ? (
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      width={800}
                      height={450}
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="sr-image-placeholder">
                      <BookOpen size={48} />
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="sr-card-category" style={{ margin: 0 }}>
                        {featured.category || 'Featured Article'}
                      </span>
                      {featured.read_time && (
                        <span className="text-[11px] text-[#5a7d92] flex items-center gap-1">
                          <Clock size={12} />
                          {featured.read_time}
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl text-[var(--ink)] font-normal leading-snug group-hover:text-[var(--coral)] transition mb-4">
                      {featured.title}
                    </h2>

                    <p className="sr-copy text-sm leading-relaxed mb-6">
                      {featured.summary || featured.excerpt}
                    </p>
                  </div>

                  <span className="sr-card-footer pt-6 border-t border-[rgba(22,55,76,0.12)] text-xs">
                    <span>By {featured.author || 'Sreemantha Clinical Team'}</span>
                    <span className="flex items-center gap-1 font-semibold text-[var(--coral)]">
                      Read article <ArrowUpRight size={14} />
                    </span>
                  </span>
                </div>
              </Link>
            )}

            {/* Stories Grid */}
            {listInsights.length > 0 && (
              <div className="sr-grid sr-grid--three">
                {listInsights.map((insight) => (
                  <Link
                    key={insight.id}
                    to={`/insights/${insight.slug}`}
                    className="sr-card"
                  >
                    <div className="sr-media" style={{ height: 210 }}>
                      {insight.image_url ? (
                        <img
                          src={insight.image_url}
                          alt={insight.title}
                          width={400}
                          height={210}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="sr-image-placeholder">
                          <BookOpen size={36} />
                        </div>
                      )}
                    </div>
                    <div className="sr-card-body">
                      {insight.category && (
                        <span className="sr-card-category">{insight.category}</span>
                      )}
                      <h3 className="font-serif text-xl font-normal leading-snug text-[var(--ink)]">
                        {insight.title}
                      </h3>
                      <p className="sr-copy sr-clamp text-xs mt-3">
                        {insight.summary || insight.excerpt}
                      </p>
                      <span className="sr-card-footer mt-auto pt-5 border-t border-[rgba(22,55,76,0.12)]">
                        <span className="text-[11px] text-[#5a7d92] flex items-center gap-1">
                          {insight.read_time && <><Clock size={12} /> {insight.read_time}</>}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--coral)]">
                          Read story <ArrowUpRight size={13} />
                        </span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

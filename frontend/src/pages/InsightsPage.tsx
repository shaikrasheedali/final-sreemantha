import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, BookOpen, Calendar, User, Clock, Tag } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Insight } from '../types';
import { api } from '../utils/api';

export const InsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Fertility', "Women's Health", 'Pregnancy Care', 'Pediatrics & Neonatology', 'Patient Education'];

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
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Insights & Patient Education' }]} />

        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="eyebrow mb-2">Evidence-Based Medical Articles</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073d59] font-heading">
              Healthcare Insights & Patient Guides
            </h1>
            <p className="text-sm text-[#637371] max-w-2xl mt-2 leading-relaxed">
              Curated medical insights, fertility guidelines, pregnancy care advice, and pediatric wellness articles authored by the clinical faculty at Sreemantha Hospital.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search health insights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 rounded-full text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006c93]"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-[#006c93] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white rounded-3xl animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No articles found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any articles matching your search query.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured Hero Article */}
            {featured && !search && category === 'All' && (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group">
                <div className="lg:col-span-7 h-72 sm:h-96 lg:h-auto relative overflow-hidden bg-slate-100">
                  <img
                    src={featured.hero_image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#fa7830] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Featured Insight
                  </span>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="text-[#006c93] font-bold uppercase tracking-wider text-[11px]">
                        {featured.category || "Women's Health"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {featured.read_time || '5 min read'}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-[#006c93] transition-colors font-heading leading-tight mb-4">
                      {featured.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4 mb-6">
                      {featured.excerpt || featured.content?.replace(/<[^>]+>/g, '').slice(0, 180) + '...'}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-[10px]">
                        {featured.author ? featured.author.charAt(0) : 'S'}
                      </div>
                      <span className="font-medium">{featured.author || 'Clinical Faculty'}</span>
                    </div>

                    <Link
                      to={`/insights/${featured.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#006c93] group-hover:text-[#073d59]"
                    >
                      Read Full Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listInsights.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={article.hero_image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#006c93] px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm">
                      {article.category || 'Clinical Guide'}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {article.created_at ? new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                        </span>
                        <span>•</span>
                        <span>{article.read_time || '4 min read'}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#006c93] transition-colors font-heading mb-2 line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {article.excerpt || article.content?.replace(/<[^>]+>/g, '').slice(0, 130) + '...'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <span className="text-[11px] text-slate-500 font-medium">
                        By {article.author || 'Sreemantha Team'}
                      </span>
                      <Link
                        to={`/insights/${article.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#006c93] group-hover:text-[#073d59]"
                      >
                        Read <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

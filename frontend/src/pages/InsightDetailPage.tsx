import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Clock, User, Share2, ArrowLeft,
  ShieldAlert, BookOpen, ChevronRight, Stethoscope
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RichContentRenderer } from '../components/RichContentRenderer';
import { Insight } from '../types';
import { api } from '../utils/api';

export const InsightDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [recentInsights, setRecentInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInsight() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.get<{ insight: Insight; related?: Insight[] }>(`/insights/${slug}`);
        if (res.insight) {
          setInsight(res.insight);
          if (res.related) {
            setRecentInsights(res.related);
          } else {
            const allRes = await api.get<{ insights: Insight[] }>('/insights');
            if (allRes.insights) setRecentInsights(allRes.insights.filter((i) => i.slug !== slug).slice(0, 3));
          }
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        console.error('Failed to load insight:', err);
        setError('Unable to load this article at the moment.');
      } finally {
        setLoading(false);
      }
    }
    loadInsight();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#006c93] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-500 font-medium">Loading medical insight...</p>
        </div>
      </div>
    );
  }

  if (error || !insight) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
          <p className="text-sm text-slate-600 mt-2 mb-6">
            The requested medical insight or blog post does not exist or may have been unpublished.
          </p>
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#006c93] text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Insights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Insights', path: '/insights' },
            { label: insight.title }
          ]}
        />

        {/* Article Header */}
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#006c93]/10 text-[#006c93] text-xs font-bold uppercase tracking-wider mb-4">
            {insight.category || 'Clinical Article'}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#073d59] font-heading leading-tight mb-6">
            {insight.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="w-4 h-4 text-[#006c93]" /> {insight.author || 'Clinical Faculty'}
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {insight.created_at
                ? new Date(insight.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Recent'}
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> {insight.read_time || '5 min read'}
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {insight.hero_image && (
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden mb-12 shadow-md">
            <img
              src={insight.hero_image}
              alt={insight.title}
              className="w-full h-80 sm:h-96 md:h-[450px] object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
            <RichContentRenderer content={insight.content} />

            {/* Medical Disclaimer Box */}
            <div className="mt-12 p-5 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-[11px] text-amber-900 leading-relaxed flex items-start gap-3">
              <Stethoscope className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Medical Information Disclaimer</strong>
                This article is prepared for educational and patient informational purposes only. It should not be used as a substitute for professional medical diagnosis or clinical treatment. Always consult qualified doctors at Sreemantha Hospital for specific medical advice.
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Consultation CTA */}
            <div className="bg-gradient-to-br from-[#073d59] to-[#006c93] p-6 rounded-3xl text-white shadow-lg">
              <h3 className="text-base font-bold font-heading mb-2">Have specific medical questions?</h3>
              <p className="text-slate-200 text-xs leading-relaxed mb-4">
                Schedule a one-on-one consultation with our specialists in Khammam to discuss your personalized treatment options.
              </p>
              <Link
                to="/book-appointment"
                className="block text-center py-2.5 px-4 rounded-xl bg-[#fa7830] hover:bg-[#e06622] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Book Consultation
              </Link>
            </div>

            {/* Recent Articles */}
            {recentInsights.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#006c93]" /> Related Insights
                </h4>
                <div className="space-y-4">
                  {recentInsights.map((r) => (
                    <Link
                      key={r.id}
                      to={`/insights/${r.slug}`}
                      className="group block pb-3 border-b border-slate-100 last:border-0"
                    >
                      <span className="text-[10px] font-bold text-[#006c93] uppercase tracking-wide">
                        {r.category}
                      </span>
                      <h5 className="text-xs font-bold text-slate-800 group-hover:text-[#006c93] transition-colors line-clamp-2 mt-0.5">
                        {r.title}
                      </h5>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

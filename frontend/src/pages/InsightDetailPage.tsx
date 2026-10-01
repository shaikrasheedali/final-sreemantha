import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Share2,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RichContentRenderer } from '../components/RichContentRenderer';
import { Insight } from '../types';
import { api } from '../utils/api';

export const InsightDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [related, setRelated] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.get<{ insight: Insight; related?: Insight[] }>(`/insights/${slug}`);
        if (res.insight) {
          setInsight(res.insight);
          if (res.related) {
            setRelated(res.related);
          } else {
            const allRes = await api.get<{ insights: Insight[] }>('/insights?limit=3');
            if (allRes.insights) {
              setRelated(allRes.insights.filter((i) => i.slug !== slug).slice(0, 3));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load insight detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="sr-section text-center">
        <div className="sr-container">
          <p className="sr-copy">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="sr-section text-center">
        <div className="sr-container">
          <h2 className="sr-display text-2xl mb-4">Article Not Found</h2>
          <Link to="/insights" className="sr-button sr-button--outline text-xs">
            Return to Health Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container max-w-4xl">
        <Breadcrumbs
          items={[
            { label: 'Health Journal', path: '/insights' },
            { label: insight.title },
          ]}
        />

        {/* Article Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="sr-kicker">
              {insight.category || 'Health Guidance'}
            </span>
            {insight.read_time && (
              <span className="sr-pill text-xs">
                <Clock size={12} className="text-[#8f4160]" />
                {insight.read_time}
              </span>
            )}
          </div>

          <h1 className="sr-display sr-heading mt-2 mb-6">
            {insight.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-[#596966] pt-4 border-t border-[#e0e5dd]">
            <span className="flex items-center gap-1.5 font-medium text-[#183f3d]">
              <User size={13} className="text-[#8f4160]" />
              By {insight.author || 'Sreemantha Clinical Faculty'}
            </span>
            {insight.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {new Date(insight.published_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>

        {/* Hero image if available */}
        {insight.image_url && (
          <div className="sr-media rounded-2xl h-[360px] sm:h-[460px] mb-12 overflow-hidden shadow-sm">
            <img src={insight.image_url} alt={insight.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Summary Lead */}
        {(insight.summary || insight.excerpt) && (
          <div className="p-6 sm:p-8 rounded-xl bg-[#e8eee5] border border-[#cbd7c6] mb-10">
            <p className="sr-display text-lg text-[#183f3d] leading-relaxed m-0 italic font-normal">
              “{insight.summary || insight.excerpt}”
            </p>
          </div>
        )}

        {/* Longform Article Content */}
        <article className="p-8 sm:p-12 rounded-xl bg-[#fffefb] border border-[#e0e5dd] mb-16">
          {insight.content ? (
            <div className="sr-copy space-y-6 text-base leading-relaxed text-[#183f3d]">
              <RichContentRenderer content={insight.content} />
            </div>
          ) : (
            <p className="sr-copy leading-relaxed text-base">
              {insight.summary}
            </p>
          )}

          {/* Medical Disclaimer */}
          <div className="mt-12 pt-6 border-t border-[#e0e5dd] text-[11px] text-[#596966] leading-relaxed">
            <strong>Medical Note:</strong> This guide provides general health information and is authored for educational purposes. It does not replace an in-person clinical consultation. Please consult a qualified specialist at Sreemantha Hospital for personalized medical evaluation.
          </div>
        </article>

        {/* Consultation Callout */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#183f3d] text-white flex flex-col sm:flex-row items-center justify-between gap-6 mb-20">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d0ddc2] block mb-1">
              Have questions about your care?
            </span>
            <h3 className="font-serif text-2xl text-white">
              Speak with our senior specialists
            </h3>
            <p className="text-xs text-[#d3dfdb] mt-1 m-0">
              Personalized fertility, maternity and neonatal evaluations in Khammam.
            </p>
          </div>
          <Link to="/book-appointment" className="sr-button sr-button--light shrink-0">
            <Calendar size={15} />
            Book consultation
          </Link>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div>
            <div className="sr-heading-row mb-6">
              <div>
                <span className="sr-kicker">Continue Reading</span>
                <h3 className="sr-display text-2xl mt-1 text-[#183f3d]">
                  Related articles &amp; guides
                </h3>
              </div>
              <Link to="/insights" className="sr-text-link">
                All articles
                <ArrowUpRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/insights/${item.slug}`}
                  className="sr-card"
                >
                  <div className="sr-media" style={{ height: 160 }}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} />
                    ) : (
                      <div className="sr-image-placeholder">
                        <BookOpen size={28} />
                      </div>
                    )}
                  </div>
                  <div className="sr-card-body" style={{ padding: 18 }}>
                    <h4 className="font-serif text-base font-normal leading-snug text-[#183f3d] line-clamp-2">
                      {item.title}
                    </h4>
                    <span className="sr-card-footer mt-auto pt-4 border-t border-[#e0e5dd] text-[11px] text-[#8f4160]">
                      Read story <ArrowUpRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

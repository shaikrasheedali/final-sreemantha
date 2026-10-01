import React, { useEffect, useState } from 'react';
import {
  Plus, Search, Edit3, Trash2, ExternalLink, Check,
  X, AlertCircle, Eye, Save, RefreshCw, FileText
} from 'lucide-react';
import { WysiwygEditor } from '../../components/WysiwygEditor';
import { api } from '../../utils/api';

export type CollectionType = 'facilities' | 'specialties' | 'treatments' | 'doctors' | 'insights';

interface AdminCollectionPageProps {
  type: CollectionType;
  title: string;
  description: string;
}

export const AdminCollectionPage: React.FC<AdminCollectionPageProps> = ({
  type,
  title,
  description
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [form, setForm] = useState<Record<string, any>>({});

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>(`/${type}`);
      // The API returns { facilities: [...] } or { treatments: [...] } etc.
      const list = res[type] || res.items || res.doctors || res.specialties || res.facilities || res.treatments || res.insights || [];
      setItems(list);
    } catch (err: any) {
      console.error(`Failed to load ${type}:`, err);
      showNotice('Failed to load records from server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    setIsEditing(false);
    setSelectedItem(null);
  }, [type]);

  const showNotice = (message: string, noticeType: 'success' | 'error') => {
    setNotification({ message, type: noticeType });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateNew = () => {
    const baseForm: Record<string, any> = {
      status: 'published'
    };

    if (type === 'doctors') {
      baseForm.name = '';
      baseForm.slug = '';
      baseForm.specialty = 'Fertility & Reproductive Medicine';
      baseForm.designation = 'Senior Consultant';
      baseForm.qualifications = 'MBBS, MD';
      baseForm.experience = '10+ Years Experience';
      baseForm.languages = 'English, Telugu, Hindi';
      baseForm.profile_photo = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80';
      baseForm.bio = '<p>Write doctor biography and clinical focus here...</p>';
    } else if (type === 'insights') {
      baseForm.title = '';
      baseForm.slug = '';
      baseForm.category = 'Fertility';
      baseForm.excerpt = '';
      baseForm.author = 'Clinical Faculty';
      baseForm.read_time = '5 min read';
      baseForm.hero_image = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80';
      baseForm.content = '<p>Write comprehensive medical article here...</p>';
      baseForm.featured = false;
    } else {
      // facilities, specialties, treatments
      baseForm.title = '';
      baseForm.slug = '';
      baseForm.category = type === 'facilities' ? 'Advanced Infrastructure' : type === 'specialties' ? 'Reproductive Medicine' : 'Fertility Procedures';
      baseForm.short_description = '';
      baseForm.hero_media = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80';
      baseForm.content = '<p>Detailed clinical explanation, procedures, and patient guidelines...</p>';
      if (type === 'treatments') {
        baseForm.typical_duration = '2 - 3 Weeks';
        baseForm.how_it_works = '<ol><li>Initial evaluation & diagnostics</li><li>Treatment protocol initiation</li><li>Procedure execution</li><li>Monitoring & post-care</li></ol>';
      }
    }

    setForm(baseForm);
    setSelectedItem(null);
    setIsEditing(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setForm({ ...item });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Auto-generate slug if not provided
      const currentNameOrTitle = form.title || form.name || '';
      if (!form.slug && currentNameOrTitle) {
        form.slug = currentNameOrTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      if (selectedItem?.id) {
        // Update existing
        await api.put(`/${type}/${selectedItem.id}`, form);
        showNotice(`${title.slice(0, -1)} updated successfully.`, 'success');
      } else {
        // Create new
        await api.post(`/${type}`, form);
        showNotice(`New ${title.slice(0, -1)} added successfully.`, 'success');
      }

      setIsEditing(false);
      setSelectedItem(null);
      await loadItems();
    } catch (err: any) {
      console.error('Save failed:', err);
      showNotice(err?.message || 'Failed to save item to database.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/${type}/${id}`);
      showNotice('Item deleted permanently.', 'success');
      setDeleteConfirmId(null);
      await loadItems();
    } catch (err: any) {
      console.error('Delete failed:', err);
      showNotice(err?.message || 'Failed to delete record.', 'error');
    }
  };

  const filteredItems = items.filter((item) => {
    const term = search.toLowerCase();
    const nameMatch = (item.title || item.name || '').toLowerCase().includes(term);
    const catMatch = (item.category || item.specialty || '').toLowerCase().includes(term);
    return nameMatch || catMatch;
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-lg animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="p-1 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[var(--coral)] uppercase tracking-wider block mb-1">
            CMS Collection Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] font-display">
            {title}
          </h1>
          <p className="text-xs text-[#5a7d92] mt-1">{description}</p>
        </div>

        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#006c93] hover:bg-[#073d59] text-[var(--ink)] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New {title.replace(/s$/i, '')}
          </button>
        )}
      </div>

      {/* Editor View */}
      {isEditing ? (
        <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(22,55,76,0.12)] mb-6">
            <h2 className="text-lg font-bold text-[var(--ink)] font-display">
              {selectedItem ? `Edit: ${selectedItem.title || selectedItem.name}` : `Create New ${title.replace(/s$/i, '')}`}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 rounded-xl bg-[var(--cream)] text-[#5a7d92] border border-[rgba(22,55,76,0.12)] hover:bg-[var(--mint)] text-[#5a7d92] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Primary Name / Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                  {type === 'doctors' ? "Doctor's Full Name" : 'Title / Item Name'} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={type === 'doctors' ? form.name || '' : form.title || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const updated: Record<string, any> = type === 'doctors' ? { name: val } : { title: val };
                    if (!selectedItem) {
                      // Auto slug
                      updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    }
                    setForm({ ...form, ...updated });
                  }}
                  placeholder={type === 'doctors' ? 'e.g. Dr. Ramesh Kumar' : 'e.g. In-Vitro Fertilization (IVF)'}
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                  URL Slug <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.slug || ''}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. ivf-treatment"
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                />
              </div>
            </div>

            {/* Doctors-Specific Fields */}
            {type === 'doctors' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                    Specialty Domain
                  </label>
                  <input
                    type="text"
                    value={form.specialty || ''}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    placeholder="e.g. Fertility & Reproductive Medicine"
                    className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={form.designation || ''}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    placeholder="e.g. Senior Fertility Specialist"
                    className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={form.experience || ''}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    placeholder="e.g. 15+ Years"
                    className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                  />
                </div>
              </div>
            )}

            {/* General Category / Duration Fields */}
            {type !== 'doctors' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category || ''}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Fertility Care, Intensive Care"
                    className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                  />
                </div>

                {type === 'treatments' && (
                  <div>
                    <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                      Typical Duration
                    </label>
                    <input
                      type="text"
                      value={form.typical_duration || ''}
                      onChange={(e) => setForm({ ...form, typical_duration: e.target.value })}
                      placeholder="e.g. 2 - 3 Weeks"
                      className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Media URL */}
            <div>
              <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                {type === 'doctors' ? 'Profile Photograph URL' : 'Hero Image / Media URL'}
              </label>
              <input
                type="text"
                value={type === 'doctors' ? form.profile_photo || '' : form.hero_media || form.hero_image || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (type === 'doctors') setForm({ ...form, profile_photo: val });
                  else if (type === 'insights') setForm({ ...form, hero_image: val });
                  else setForm({ ...form, hero_media: val });
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
              />
            </div>

            {/* Short Description / Excerpt */}
            {type !== 'doctors' && (
              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                  Short Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={form.short_description || form.excerpt || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (type === 'insights') setForm({ ...form, excerpt: val });
                    else setForm({ ...form, short_description: val });
                  }}
                  placeholder="Provide a concise 1-2 sentence overview for listing cards..."
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                />
              </div>
            )}

            {/* Feature-Rich MS Word-like WYSIWYG Editor */}
            <div>
              <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{type === 'doctors' ? 'Professional Biography & Clinical Experience' : 'Detailed Content Document'}</span>
                <span className="text-[10px] text-amber-400 font-normal">Rich WYSIWYG Document Editor (MS Word features enabled)</span>
              </label>
              <div className="border border-[rgba(22,55,76,0.12)] rounded-2xl overflow-hidden shadow-inner">
                <WysiwygEditor
                  value={type === 'doctors' ? form.bio || '' : form.content || ''}
                  onChange={(newHtml) => {
                    if (type === 'doctors') setForm({ ...form, bio: newHtml });
                    else setForm({ ...form, content: newHtml });
                  }}
                />
              </div>
            </div>

            {/* Additional How It Works for Treatments */}
            {type === 'treatments' && (
              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                  How It Works (Step-by-Step Procedure)
                </label>
                <div className="border border-[rgba(22,55,76,0.12)] rounded-2xl overflow-hidden shadow-inner">
                  <WysiwygEditor
                    value={form.how_it_works || ''}
                    onChange={(newHtml) => setForm({ ...form, how_it_works: newHtml })}
                  />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="pt-4 border-t border-[rgba(22,55,76,0.12)] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl bg-[var(--cream)] text-[#5a7d92] border border-[rgba(22,55,76,0.12)] hover:bg-[var(--mint)] text-[#5a7d92] text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#006c93] hover:bg-[#073d59] text-[var(--ink)] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save to Database'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Listing View Table */
        <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] overflow-hidden shadow-xl">
          {/* Search bar & Refresh */}
          <div className="p-4 sm:p-6 border-b border-[rgba(22,55,76,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#5a7d92] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
              />
            </div>

            <button
              onClick={loadItems}
              title="Refresh Records"
              className="p-2 rounded-xl bg-[var(--cream)] hover:bg-[var(--mint)] text-[#5a7d92] border border-[rgba(22,55,76,0.12)] transition-colors self-end sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-[#5a7d92] text-xs animate-pulse">
              Loading collection data from MySQL database...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center text-[#5a7d92]">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#5a7d92]">No records found</p>
              <p className="text-xs text-[#8ba2b1] mt-1">Click "Add New" to create the first record in this collection.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--cream)] text-[#5a7d92] uppercase tracking-wider text-[10px] font-bold border-b border-[rgba(22,55,76,0.12)]">
                  <tr>
                    <th className="px-6 py-3.5">Name / Title</th>
                    <th className="px-6 py-3.5">Category / Specialty</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--cream)]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[var(--ink)] text-xs">{item.title || item.name}</div>
                        <span className="text-[10px] text-[#8ba2b1]">slug: /{type}/{item.slug}</span>
                      </td>
                      <td className="px-6 py-4 text-[#5a7d92]">
                        {item.category || item.specialty || 'General'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 capitalize">
                          {item.status || 'published'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/${type}/${item.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Preview on Public Website"
                            className="p-1.5 rounded-lg bg-[var(--cream)] hover:bg-[var(--mint)] text-[#5a7d92] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleEdit(item)}
                            title="Edit Record"
                            className="p-1.5 rounded-lg bg-[#006c93]/20 hover:bg-[#006c93]/40 text-[#38bdf8] transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--ink)] font-display">Permanently Delete Item?</h3>
            <p className="text-xs text-[#5a7d92] mt-1 mb-6">
              This action will remove the record from the database. It will immediately cease to appear on the public website.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-[var(--cream)] text-[#5a7d92] border border-[rgba(22,55,76,0.12)] hover:bg-[var(--mint)] text-[#5a7d92] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-[var(--ink)] text-xs font-bold cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

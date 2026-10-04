import React, { useEffect, useState } from 'react';
import {
  Plus, Search, Edit3, Trash2, ExternalLink, Check, CheckCircle2,
  X, AlertCircle, Eye, Save, RefreshCw, FileText,
  Upload, Film, Image as ImageIcon, ChevronRight
} from 'lucide-react';
import { WysiwygEditor } from '../../components/WysiwygEditor';
import { MediaPickerModal } from '../../components/MediaPickerModal';
import { parseMediaList } from '../../components/DetailMediaCarousel';
import { api, getAuthToken } from '../../utils/api';

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
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [uploadingDirect, setUploadingDirect] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>(`/${type}`);
      const list = res[type] || res.items || res.doctors || res.specialties || res.facilities || res.treatments || res.insights || [];
      setItems(list);
    } catch (err: any) {
      console.error(`Failed to load ${type}:`, err);
      showNotice('Failed to load records from database.', 'error');
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

  const formatHowItWorksToHtml = (val: any): string => {
    if (!val) return '';
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed);
          return formatHowItWorksToHtml(parsed);
        } catch {
          // Plain text or html string
        }
      }
      if (!/<[a-z][\s\S]*>/i.test(trimmed)) {
        return trimmed
          .split('\n')
          .filter(Boolean)
          .map((line) => `<p>${line.trim()}</p>`)
          .join('');
      }
      return trimmed;
    }
    if (Array.isArray(val)) {
      if (val.length === 0) return '';
      return `<ol>${val
        .map((step, idx) => {
          if (typeof step === 'object' && step !== null) {
            const title = step.title || step.name || `Step ${step.step || idx + 1}`;
            const desc = step.desc || step.description || step.text || '';
            return `<li><strong>${title}</strong>${desc ? `: ${desc}` : ''}</li>`;
          }
          return `<li>${String(step)}</li>`;
        })
        .join('')}</ol>`;
    }
    return String(val);
  };

  const handleCreateNew = () => {
    const baseForm: Record<string, any> = {
      status: 'published'
    };

    let initialMedia: string[] = [];

    if (type === 'doctors') {
      baseForm.name = '';
      baseForm.title = '';
      baseForm.slug = '';
      baseForm.specialty = 'Fertility & Reproductive Medicine';
      baseForm.department = 'Fertility & Reproductive Medicine';
      baseForm.designation = 'Senior Consultant';
      baseForm.qualifications = 'MBBS, MD';
      baseForm.experience = '10+ Years Experience';
      baseForm.languages = 'English, Telugu, Hindi';
      initialMedia = ['https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'];
      baseForm.bio = '<p>Write doctor biography and clinical focus here...</p>';
      baseForm.full_bio = baseForm.bio;
    } else if (type === 'insights') {
      baseForm.title = '';
      baseForm.name = '';
      baseForm.slug = '';
      baseForm.category = 'Fertility';
      baseForm.excerpt = '';
      baseForm.summary = '';
      baseForm.author = 'Clinical Faculty';
      baseForm.read_time = '5 min read';
      initialMedia = ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'];
      baseForm.content = '<p>Write comprehensive medical article here...</p>';
      baseForm.featured = false;
    } else {
      // facilities, specialties, treatments
      baseForm.title = '';
      baseForm.name = '';
      baseForm.slug = '';
      baseForm.category = type === 'facilities' ? 'Advanced Infrastructure' : type === 'specialties' ? 'Reproductive Medicine' : 'Fertility Procedures';
      baseForm.short_description = '';
      initialMedia = ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80'];
      baseForm.content = '<p>Detailed clinical explanation, procedures, and patient guidelines...</p>';
      baseForm.overview = baseForm.content;
      baseForm.description = baseForm.content;
      if (type === 'treatments') {
        baseForm.typical_duration = '2 - 3 Weeks';
        baseForm.how_it_works = '<ol><li><strong>Step 1: Clinical Evaluation</strong>: Detailed diagnosis and patient assessment</li><li><strong>Step 2: Treatment Protocol</strong>: Initiation of tailored therapy</li><li><strong>Step 3: Procedure Execution</strong>: Advanced procedure in our cleanroom modular facility</li><li><strong>Step 4: Monitoring & Post-Care</strong>: Continuous observation and follow-up support</li></ol>';
      }
    }

    setForm(baseForm);
    setMediaList(initialMedia);
    setSelectedItem(null);
    setIsEditing(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    const formCopy: Record<string, any> = { ...item };

    // Standardize title and name
    formCopy.title = item.title || item.name || '';
    formCopy.name = item.name || item.title || '';

    // Standardize description, overview, content
    const richBody = item.content || item.overview || item.description || item.full_bio || item.bio || '';
    formCopy.content = richBody;
    formCopy.overview = item.overview || richBody;
    formCopy.description = item.description || richBody;
    formCopy.full_bio = item.full_bio || item.bio || richBody;
    formCopy.bio = item.bio || item.full_bio || richBody;

    // Standardize excerpt and summary
    formCopy.short_description = item.short_description || item.excerpt || item.summary || '';
    formCopy.excerpt = item.excerpt || item.summary || item.short_description || '';
    formCopy.summary = item.summary || item.excerpt || item.short_description || '';

    // Standardize department & specialty
    formCopy.department = item.department || item.specialty || '';
    formCopy.specialty = item.specialty || item.department || '';

    // Treatments: format how_it_works
    if (type === 'treatments') {
      formCopy.how_it_works = formatHowItWorksToHtml(item.how_it_works);
    }

    setForm(formCopy);
    const rawMedia = item.image_url || item.photo_url || item.hero_media || item.hero_image || item.profile_photo;
    setMediaList(parseMediaList(rawMedia));
    setIsEditing(true);
  };

  const handleDirectUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingDirect(true);

    const token = getAuthToken();
    const uploaded: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Upload failed');
        }

        const data = await res.json();
        const uploadedUrl = data.url || data.asset?.url;
        if (uploadedUrl) {
          uploaded.push(uploadedUrl);
        }
      } catch (err: any) {
        console.error('Direct upload failed:', err);
        showNotice(err.message || 'Failed to upload asset', 'error');
      }
    }

    if (uploaded.length > 0) {
      setMediaList((prev) => [...prev, ...uploaded]);
      showNotice(`${uploaded.length} asset${uploaded.length > 1 ? 's' : ''} uploaded and converted to WebP successfully.`, 'success');
    }
    setUploadingDirect(false);
  };

  const handleRemoveMedia = (idx: number) => {
    setMediaList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const currentNameOrTitle = form.title || form.name || '';
      if (!form.slug && currentNameOrTitle) {
        form.slug = currentNameOrTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      // Store multiple media assets as JSON array if multiple, or single string
      const mediaVal =
        mediaList.length === 0
          ? ''
          : mediaList.length === 1
          ? mediaList[0]
          : JSON.stringify(mediaList);

      const payload: Record<string, any> = {
        ...form,
        title: form.title || form.name || '',
        name: form.name || form.title || '',
        overview: form.overview || form.content || form.description || '',
        content: form.content || form.overview || form.description || '',
        description: form.description || form.content || form.overview || '',
        summary: form.summary || form.excerpt || form.short_description || '',
        excerpt: form.excerpt || form.summary || form.short_description || '',
        short_description: form.short_description || form.excerpt || form.summary || '',
        department: form.department || form.specialty || '',
        specialty: form.specialty || form.department || '',
        full_bio: form.full_bio || form.bio || form.content || '',
        bio: form.bio || form.full_bio || form.content || '',
        how_it_works: form.how_it_works,
        image_url: mediaVal,
        photo_url: mediaVal,
        hero_media: mediaVal,
        hero_image: mediaVal,
        profile_photo: mediaVal,
      };

      if (selectedItem?.id) {
        // Update existing
        await api.put(`/${type}/${selectedItem.id}`, payload);
        showNotice(`${title.slice(0, -1)} updated successfully in MySQL database.`, 'success');
      } else {
        // Create new
        await api.post(`/${type}`, payload);
        showNotice(`New ${title.slice(0, -1)} created in database.`, 'success');
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
      showNotice('Item permanently deleted from database.', 'success');
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(selected) => {
          setMediaList((prev) => [...new Set([...prev, ...selected])]);
        }}
        allowMultiple={true}
        initialSelected={mediaList}
        title={`Select Media for ${title}`}
      />

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-[var(--teal)] text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(22,55,76,0.1)]">
        <div>
          <span className="text-[10px] font-bold text-[var(--coral)] uppercase tracking-wider block mb-1">
            Database Content Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] font-display">
            {title}
          </h1>
          <p className="text-xs text-[#5a7d92] mt-1">{description}</p>
        </div>

        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#fa7830] hover:bg-[#e06622] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            <Plus className="w-4 h-4 text-white" /> Add New {title.slice(0, -1)}
          </button>
        )}
      </div>

      {isEditing ? (
        /* Create / Edit Form */
        <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(22,55,76,0.12)] mb-6">
            <h2 className="text-lg font-bold text-[var(--ink)] font-display">
              {selectedItem ? `Edit ${title.slice(0, -1)}: ${selectedItem.title || selectedItem.name}` : `Create New ${title.slice(0, -1)}`}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 rounded-xl bg-[var(--cream)] text-[#5a7d92] border border-[rgba(22,55,76,0.12)] hover:bg-[var(--mint)] text-[#5a7d92] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                  {type === 'doctors' ? 'Doctor Name' : 'Item Title'} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title || form.name || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (type === 'doctors') setForm({ ...form, name: val });
                    else setForm({ ...form, title: val });
                  }}
                  placeholder={type === 'doctors' ? 'e.g. Dr. S. Sreemantha Rao' : 'e.g. Level-III Advanced NICU'}
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                  URL Slug (Auto-generated if empty)
                </label>
                <input
                  type="text"
                  value={form.slug || ''}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. advanced-nicu-unit"
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                />
              </div>
            </div>

            {/* Doctors specific fields */}
            {type === 'doctors' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    Qualifications
                  </label>
                  <input
                    type="text"
                    value={form.qualifications || ''}
                    onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                    placeholder="e.g. MBBS, MS (OBG), DRM"
                    className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                    Experience / Department
                  </label>
                  <input
                    type="text"
                    value={form.department || form.specialty || ''}
                    onChange={(e) => setForm({ ...form, department: e.target.value, specialty: e.target.value })}
                    placeholder="e.g. Reproductive Medicine"
                    className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                  />
                </div>
              </div>
            )}

            {/* Category / Duration */}
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

            {/* Comprehensive Media Assets Showcase & Upload Controls */}
            <div className="p-5 rounded-2xl bg-[var(--cream)]/60 border border-[rgba(22,55,76,0.12)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                    {type === 'doctors' ? 'Doctor Profile Photo(s) / Showcase' : 'Hero Image(s) & Media Assets'}
                  </label>
                  <p className="text-[11px] text-[#5a7d92] mt-0.5">
                    Attach one or multiple images or videos. Multiple assets display as an auto-sliding 4:3 carousel with generous timer on detail pages.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className="btn btn-soft text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ImageIcon size={14} className="text-[var(--coral)]" />
                    <span>Pick from Media Assets</span>
                  </button>

                  <label className="btn btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <Upload size={14} />
                    <span>{uploadingDirect ? 'Converting...' : 'Upload WebP'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => handleDirectUpload(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Media Thumbnails Grid */}
              {mediaList.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                  {mediaList.map((url, idx) => {
                    const isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('/video-');

                    return (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-[rgba(22,55,76,0.15)] bg-slate-100 shadow-xs"
                      >
                        {isVideo ? (
                          <div className="w-full h-full bg-[#073d59] flex items-center justify-center text-white">
                            <Film size={24} />
                          </div>
                        ) : (
                          <img src={url} alt={`Asset ${idx + 1}`} className="w-full h-full object-cover" />
                        )}

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 shadow-sm cursor-pointer"
                          title="Remove asset"
                        >
                          <X size={12} />
                        </button>

                        <div className="absolute bottom-1 left-1.5 bg-black/60 text-white text-[9px] px-1 rounded font-bold">
                          #{idx + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-[#5a7d92] border border-dashed border-[rgba(22,55,76,0.15)] rounded-xl bg-slate-50/50">
                  <p className="font-semibold text-[var(--ink)] mb-1">No media assets attached yet.</p>
                  <p className="text-[11px] text-[#5a7d92]">Click "Upload Media" or "Pick from Media Assets" to add photos or videos. All files are automatically converted to optimized WebP.</p>
                </div>
              )}
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

            {/* Feature-Rich WYSIWYG Editor */}
            <div>
              <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{type === 'doctors' ? 'Professional Biography & Clinical Experience' : 'Detailed Content Document'}</span>
                <span className="text-[10px] text-amber-600 font-normal">Rich WYSIWYG Document Editor (MS Word features enabled)</span>
              </label>
              <div className="border border-[rgba(22,55,76,0.12)] rounded-2xl overflow-hidden shadow-inner">
                <WysiwygEditor
                  value={type === 'doctors' ? form.bio || form.full_bio || '' : form.content || form.overview || ''}
                  onChange={(newHtml) => {
                    if (type === 'doctors') setForm({ ...form, bio: newHtml, full_bio: newHtml });
                    else setForm({ ...form, content: newHtml, overview: newHtml });
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
                className="btn btn-soft text-xs py-2 px-5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary text-xs py-2 px-6 flex items-center gap-2 cursor-pointer disabled:opacity-60 shadow-md"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save to MySQL Database'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Items Table Listing */
        <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] overflow-hidden shadow-sm">
          {/* Search bar & Refresh */}
          <div className="p-4 sm:p-6 border-b border-[rgba(22,55,76,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#5a7d92] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-full pl-10 pr-4 py-2 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadItems}
                disabled={loading}
                className="p-2 rounded-xl bg-[var(--cream)] text-[#5a7d92] border border-[rgba(22,55,76,0.12)] hover:bg-[var(--mint)] transition-colors cursor-pointer"
                title="Refresh from Database"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-[#5a7d92] text-xs animate-pulse">
              Loading {title.toLowerCase()} from MySQL database...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center text-[#5a7d92]">
              <FileText className="w-12 h-12 text-[#9bb0bc] mx-auto mb-2" />
              <p className="text-sm font-bold text-[var(--ink)]">No {title.toLowerCase()} found</p>
              <p className="text-xs text-[#5a7d92] mt-0.5">Click "Add New" above to create your first record.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--cream)] text-[#5a7d92] uppercase tracking-wider text-xs font-bold border-b border-[rgba(22,55,76,0.1)]">
                  <tr>
                    <th className="px-6 py-4">Item &amp; Media</th>
                    <th className="px-6 py-4">Category / Department</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(22,55,76,0.08)]">
                  {filteredItems.map((item) => {
                    const rawMedia = item.image_url || item.photo_url || item.hero_media || item.hero_image || item.profile_photo;
                    const parsedList = parseMediaList(rawMedia);
                    const firstThumb = parsedList[0];

                    return (
                      <tr key={item.id} className="hover:bg-[var(--cream)]/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {firstThumb ? (
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-[rgba(22,55,76,0.1)] shrink-0 relative">
                                <img src={firstThumb} alt="" className="w-full h-full object-cover" />
                                {parsedList.length > 1 && (
                                  <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 rounded-tl font-bold">
                                    +{parsedList.length}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-[var(--mint)] border border-[rgba(22,55,76,0.1)] flex items-center justify-center text-[var(--teal)] shrink-0">
                                <ImageIcon size={20} />
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-[var(--ink)] text-sm">{item.title || item.name}</div>
                              <span className="text-xs text-[#8ba2b1]">slug: /{type}/{item.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[var(--ink)] text-sm font-medium">
                          {item.category || item.specialty || item.department || 'General'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[var(--mint)] text-[var(--teal)] border border-[var(--teal)]/20 capitalize">
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
                              className="p-2 rounded-xl bg-[var(--cream)] hover:bg-[var(--mint)] text-[var(--teal)] transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleEdit(item)}
                              title="Edit Record"
                              className="p-2 rounded-xl bg-[#006c93]/10 hover:bg-[#006c93]/20 text-[#006c93] transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              title="Delete Record"
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[var(--coral)] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.15)] p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-[var(--ink)] font-display">Confirm Permanent Deletion</h3>
            </div>
            <p className="text-xs text-[#5a7d92] leading-relaxed">
              Are you sure you want to permanently delete this {title.slice(0, -1).toLowerCase()}? This action is ACID-compliant and permanently removes the record from the MySQL database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-soft text-xs py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCollectionPage;

export interface Facility {
  id: number;
  slug: string;
  name?: string;
  title?: string;
  short_description?: string;
  description?: string;
  content?: string;
  equipment?: string[] | string;
  image_url?: string;
  hero_media?: string;
  location?: string;
  capacity?: string;
  status?: 'published' | 'draft';
  display_order?: number;
}

export interface Specialty {
  id: number;
  slug: string;
  title: string;
  category?: string;
  short_description?: string;
  overview?: string;
  content?: string;
  icon?: string;
  image_url?: string;
  hero_media?: string;
  conditions?: string[] | string;
  display_order?: number;
  status?: 'published' | 'draft';
}

export interface Treatment {
  id: number;
  slug: string;
  title: string;
  category?: string;
  specialty_slug?: string;
  short_description?: string;
  overview?: string;
  content?: string;
  how_it_works?: string[] | string;
  who_requires?: string[] | string;
  preparation?: string;
  aftercare?: string;
  faqs?: string;
  typical_duration?: string;
  success_rate?: string;
  image_url?: string;
  hero_media?: string;
  featured?: number | boolean;
  status?: 'published' | 'draft';
}

export interface Doctor {
  id: number;
  slug: string;
  name: string;
  designation?: string;
  department?: string;
  specialty?: string;
  qualifications?: string | string[];
  experience_years?: number;
  experience?: string;
  languages?: string[] | string;
  short_bio?: string;
  full_bio?: string;
  bio?: string;
  education?: Array<{ degree: string; institution: string; year: string } | string> | string;
  certifications?: string[] | string;
  opd_timings?: string;
  photo_url?: string;
  profile_photo?: string;
  featured?: number | boolean;
  display_order?: number;
  status?: 'published' | 'draft';
}

export interface GalleryItem {
  id: number;
  title: string;
  category?: string;
  media_type: 'image' | 'video' | 'youtube' | 'instagram' | 'facebook' | 'embed' | string;
  media_url: string;
  embed_code?: string;
  thumbnail_url?: string;
  caption?: string;
  display_order?: number;
  status?: 'published' | 'draft';
}

export interface Insight {
  id: number;
  slug: string;
  title: string;
  category?: string;
  author?: string;
  read_time?: string;
  summary?: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  hero_image?: string;
  published_at?: string;
  created_at?: string;
  featured?: number | boolean;
  status?: 'published' | 'draft';
}

export interface InsuranceProvider {
  id: number;
  name: string;
  type?: string;
  cashless_available?: number | boolean;
  claim_assistance_info?: string;
  logo_url?: string;
  display_order?: number;
  status?: string;
}

export interface Appointment {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  department?: string;
  doctor?: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
  consent?: boolean;
  status?: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at?: string;
}

export interface ContactEnquiry {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  status?: 'new' | 'read' | 'responded' | 'archived';
  created_at?: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  name?: string;
  role: 'superadmin' | 'admin' | 'staff' | string;
  created_at?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface HospitalSettings {
  hospital_name?: string;
  hospital_tagline?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  contact_email?: string;
  emergency_phone?: string;
  address?: string;
  working_hours?: string;
  emergency_hours?: string;
  [key: string]: any;
}

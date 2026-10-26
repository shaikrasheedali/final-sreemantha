import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Shared app-shell components (kept eager so the public shell paints instantly)
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingContactButtons } from './components/FloatingContactButtons';
import { InitialLoader } from './components/InitialLoader';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RouteFallback } from './components/RouteFallback';

// The landing page stays in the initial bundle: it is the most common entry
// point and should never wait on a second network round-trip.
import { HomePage } from './pages/HomePage';

// Admin chrome stays eager so navigating between CMS pages only loads the
// requested page chunk, not the whole admin section.
import { AdminLayout } from './pages/admin/AdminLayout';

type LazyPageModule<TKey extends string> = Record<TKey, React.ComponentType<any>>;

/**
 * Resolves a named page export through a dynamic import so each route below
 * becomes its own cacheable production chunk.
 */
function lazyPage<TKey extends string, TModule extends LazyPageModule<TKey>>(
  loadModule: () => Promise<TModule>,
  exportName: TKey
): React.LazyExoticComponent<TModule[TKey]> {
  return React.lazy(async () => {
    const pageModule = await loadModule();
    return { default: pageModule[exportName] };
  });
}

// Public pages
const AboutPage = lazyPage(() => import('./pages/AboutPage'), 'AboutPage');
const FacilitiesPage = lazyPage(() => import('./pages/FacilitiesPage'), 'FacilitiesPage');
const FacilityDetailPage = lazyPage(
  () => import('./pages/FacilityDetailPage'),
  'FacilityDetailPage'
);
const SpecialtiesPage = lazyPage(() => import('./pages/SpecialtiesPage'), 'SpecialtiesPage');
const SpecialtyDetailPage = lazyPage(
  () => import('./pages/SpecialtyDetailPage'),
  'SpecialtyDetailPage'
);
const TreatmentsPage = lazyPage(() => import('./pages/TreatmentsPage'), 'TreatmentsPage');
const TreatmentDetailPage = lazyPage(
  () => import('./pages/TreatmentDetailPage'),
  'TreatmentDetailPage'
);
const DoctorsPage = lazyPage(() => import('./pages/DoctorsPage'), 'DoctorsPage');
const DoctorDetailPage = lazyPage(() => import('./pages/DoctorDetailPage'), 'DoctorDetailPage');
const GalleryPage = lazyPage(() => import('./pages/GalleryPage'), 'GalleryPage');
const InsightsPage = lazyPage(() => import('./pages/InsightsPage'), 'InsightsPage');
const InsightDetailPage = lazyPage(
  () => import('./pages/InsightDetailPage'),
  'InsightDetailPage'
);
const BookAppointmentPage = lazyPage(
  () => import('./pages/BookAppointmentPage'),
  'BookAppointmentPage'
);
const ContactPage = lazyPage(() => import('./pages/ContactPage'), 'ContactPage');
const PrivacyPolicyPage = lazyPage(
  () => import('./pages/PrivacyPolicyPage'),
  'PrivacyPolicyPage'
);
const TermsOfServicePage = lazyPage(
  () => import('./pages/TermsOfServicePage'),
  'TermsOfServicePage'
);
const PatientRightsPage = lazyPage(
  () => import('./pages/PatientRightsPage'),
  'PatientRightsPage'
);
const StaffLoginPage = lazyPage(() => import('./pages/StaffLoginPage'), 'StaffLoginPage');

// Admin pages
const AdminDashboardPage = lazyPage(
  () => import('./pages/admin/AdminDashboardPage'),
  'AdminDashboardPage'
);
const AdminCollectionPage = lazyPage(
  () => import('./pages/admin/AdminCollectionPage'),
  'AdminCollectionPage'
);
const AdminGalleryPage = lazyPage(
  () => import('./pages/admin/AdminGalleryPage'),
  'AdminGalleryPage'
);
const AdminMediaAssetsPage = lazyPage(
  () => import('./pages/admin/AdminMediaAssetsPage'),
  'AdminMediaAssetsPage'
);
const AdminAppointmentsPage = lazyPage(
  () => import('./pages/admin/AdminAppointmentsPage'),
  'AdminAppointmentsPage'
);
const AdminEnquiriesPage = lazyPage(
  () => import('./pages/admin/AdminEnquiriesPage'),
  'AdminEnquiriesPage'
);
const AdminSettingsPage = lazyPage(
  () => import('./pages/admin/AdminSettingsPage'),
  'AdminSettingsPage'
);
const AdminUsersPage = lazyPage(
  () => import('./pages/admin/AdminUsersPage'),
  'AdminUsersPage'
);
const AdminAuditLogsPage = lazyPage(
  () => import('./pages/admin/AdminAuditLogsPage'),
  'AdminAuditLogsPage'
);

// Public Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--paper)] text-[var(--ink)] relative">
      <Navbar />
      <main className="flex-1 public-page">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <FloatingContactButtons />
      <div className="noise" aria-hidden="true" />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <InitialLoader />
        <BrowserRouter>
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/facilities" element={<FacilitiesPage />} />
              <Route path="/facilities/:slug" element={<FacilityDetailPage />} />
              <Route path="/specialties" element={<SpecialtiesPage />} />
              <Route path="/specialties/:slug" element={<SpecialtyDetailPage />} />
              <Route path="/treatments" element={<TreatmentsPage />} />
              <Route path="/treatments/:slug" element={<TreatmentDetailPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/doctors/:slug" element={<DoctorDetailPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/insights/:slug" element={<InsightDetailPage />} />
              <Route path="/blog" element={<InsightsPage />} />
              <Route path="/blog/:slug" element={<InsightDetailPage />} />
              <Route path="/book-appointment" element={<BookAppointmentPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/patient-rights" element={<PatientRightsPage />} />
            </Route>

            {/* Staff Login */}
            <Route
              path="/staff-login"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <StaffLoginPage />
                </Suspense>
              }
            />
            <Route path="/login" element={<Navigate to="/staff-login" replace />} />

            {/* Protected Admin CMS Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route
                path="facilities"
                element={
                  <AdminCollectionPage
                    key="facilities"
                    type="facilities"
                    title="Hospital Facilities"
                    description="Manage operation theatres, NICU units, IVF labs and inpatient rooms."
                  />
                }
              />
              <Route
                path="specialties"
                element={
                  <AdminCollectionPage
                    key="specialties"
                    type="specialties"
                    title="Medical Specialties"
                    description="Manage clinical focus areas, conditions addressed, and departments."
                  />
                }
              />
              <Route
                path="treatments"
                element={
                  <AdminCollectionPage
                    key="treatments"
                    type="treatments"
                    title="Treatments & Clinical Services"
                    description="Manage medical procedures, step-by-step protocols, and duration."
                  />
                }
              />
              <Route
                path="doctors"
                element={
                  <AdminCollectionPage
                    key="doctors"
                    type="doctors"
                    title="Doctors & Specialists"
                    description="Manage physician profiles, qualifications, and consultation hours."
                  />
                }
              />
              <Route
                path="insights"
                element={
                  <AdminCollectionPage
                    key="insights"
                    type="insights"
                    title="Insights & Articles"
                    description="Publish medical guidance, patient health advice, and news updates."
                  />
                }
              />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="media" element={<AdminMediaAssetsPage />} />
              <Route path="appointments" element={<AdminAppointmentsPage />} />
              <Route path="enquiries" element={<AdminEnquiriesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="audit-logs"
                element={
                  <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                    <AdminAuditLogsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingContactButtons } from './components/FloatingContactButtons';
import { InitialLoader } from './components/InitialLoader';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { FacilityDetailPage } from './pages/FacilityDetailPage';
import { SpecialtiesPage } from './pages/SpecialtiesPage';
import { SpecialtyDetailPage } from './pages/SpecialtyDetailPage';
import { TreatmentsPage } from './pages/TreatmentsPage';
import { TreatmentDetailPage } from './pages/TreatmentDetailPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DoctorDetailPage } from './pages/DoctorDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { InsightsPage } from './pages/InsightsPage';
import { InsightDetailPage } from './pages/InsightDetailPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { PatientRightsPage } from './pages/PatientRightsPage';
import { StaffLoginPage } from './pages/StaffLoginPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCollectionPage } from './pages/admin/AdminCollectionPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminMediaAssetsPage } from './pages/admin/AdminMediaAssetsPage';

// Public Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--paper)] text-[var(--ink)] relative">
      <Navbar />
      <main className="flex-1 public-page">
        <Outlet />
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
            <Route path="/staff-login" element={<StaffLoginPage />} />
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
              <Route path="audit-logs" element={<AdminAuditLogsPage />} />
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

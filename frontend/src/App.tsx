import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import { LandingPage } from "./pages/LandingPage";
import { PricingPage } from "./pages/public/PricingPage";
import { PaymentSuccessPage } from "./pages/public/PaymentSuccessPage";
import { CitiesPage } from "./pages/public/CitiesPage";

// Auth Pages
import { LoginPage, RegisterPage, ForgotPasswordPage, EmailVerificationPage } from "./pages/auth/AuthPages";

// Dashboard Layout
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCities } from "./pages/admin/AdminCities";

// Publisher Pages
import { PublisherDashboard } from "./pages/publisher/PublisherDashboard";
import { PublisherEditions } from "./pages/publisher/PublisherEditions";
import { PublisherPlans } from "./pages/publisher/PublisherPlans";

// Editor Pages
import { EditorDashboard } from "./pages/editor/EditorDashboard";

// Reader Pages
import { ReaderHome } from "./pages/reader/ReaderHome";
import { FlipbookReader } from "./pages/reader/FlipbookReader";

import NotFound from "./pages/NotFound";

import { OfflineBanner } from "@/components/ui/OfflineBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <OfflineBanner />
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/cities" element={<CitiesPage />} />
          <Route path="/read/:id" element={<FlipbookReader />} />

          {/* Auth Routes */}

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="cities" element={<AdminCities />} />
            <Route path="publishers" element={<AdminDashboard />} />
            <Route path="users" element={<AdminDashboard />} />
            <Route path="licenses" element={<AdminDashboard />} />
            <Route path="revenue" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminDashboard />} />
          </Route>

          {/* Publisher Dashboard */}
          <Route path="/publisher" element={<DashboardLayout role="publisher" />}>
            <Route index element={<PublisherDashboard />} />
            <Route path="editions" element={<PublisherEditions />} />
            <Route path="articles" element={<PublisherDashboard />} />
            <Route path="media" element={<PublisherDashboard />} />
            <Route path="contributors" element={<PublisherDashboard />} />
            <Route path="advertisers" element={<PublisherDashboard />} />
            <Route path="analytics" element={<PublisherDashboard />} />
            <Route path="branding" element={<PublisherDashboard />} />
          </Route>

          {/* Editor Dashboard */}
          <Route path="/editor" element={<DashboardLayout role="editor" />}>
            <Route index element={<EditorDashboard />} />
            <Route path="content" element={<EditorDashboard />} />
            <Route path="submissions" element={<EditorDashboard />} />
            <Route path="media" element={<EditorDashboard />} />
          </Route>

          {/* Reader Dashboard */}
          <Route path="/reader" element={<DashboardLayout role="reader" />}>
            <Route index element={<ReaderHome />} />
            <Route path="city" element={<ReaderHome />} />
            <Route path="editions" element={<ReaderHome />} />
            <Route path="editions/:id" element={<FlipbookReader />} />
            <Route path="events" element={<ReaderHome />} />
            <Route path="favorites" element={<ReaderHome />} />
            <Route path="profile" element={<ReaderHome />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

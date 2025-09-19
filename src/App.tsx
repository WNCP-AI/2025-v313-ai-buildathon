import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/SimpleAuthContext";
import { ModeProvider, useMode } from "@/contexts/ModeContext";
import SimpleProtectedRoute from "@/components/auth/SimpleProtectedRoute";
import ModeTransition from "@/components/shared/ModeTransition";
import GlobalErrorBoundary from "@/components/error-boundaries/GlobalErrorBoundary";
import PageErrorBoundary from "@/components/error-boundaries/PageErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Browse from "./pages/Browse";
import OperatorDashboard from "./pages/OperatorDashboard";
import OperatorListings from "./pages/OperatorListings";
import NewListing from "./pages/NewListing";
import EditListing from "./pages/EditListing";
import ListingDetail from "./pages/ListingDetail";
import OperatorBookings from "./pages/OperatorBookings";
import AdminPanel from "./pages/AdminPanel";
import SimpleProfile from "./pages/SimpleProfile";
import EditableProfile from "./pages/EditableProfile";
import ViewProfile from "./pages/ViewProfile";
import AdminEditUser from "./pages/AdminEditUser";
import AdminEditListing from "./pages/AdminEditListing";
import Orders from "./pages/Orders";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isTransitioning, targetMode } = useMode();

  return (
    <>
      {isTransitioning && targetMode && <ModeTransition targetMode={targetMode} />}
      <Routes>
        <Route path="/" element={
          <PageErrorBoundary pageName="Homepage">
            <Index />
          </PageErrorBoundary>
        } />
        <Route path="/signup" element={
          <PageErrorBoundary pageName="Sign Up">
            <SignUp />
          </PageErrorBoundary>
        } />
        <Route path="/login" element={
          <PageErrorBoundary pageName="Login">
            <Login />
          </PageErrorBoundary>
        } />
        <Route path="/browse" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="Browse Services">
              <Browse />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        <Route path="/listing/:id" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="Service Details">
              <ListingDetail />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        <Route path="/operator-dashboard" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="Operator Dashboard">
              <OperatorDashboard />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        <Route path="/operator-dashboard/listings" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="My Listings">
              <OperatorListings />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        <Route path="/operator-dashboard/new-listing" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="Create Listing">
              <NewListing />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        <Route path="/operator-dashboard/edit-listing/:id" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="Edit Listing">
              <EditListing />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        <Route path="/operator-dashboard/bookings" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="My Bookings">
              <OperatorBookings />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        <Route path="/profile" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="Profile">
              <EditableProfile />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        <Route path="/profile/:userId" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="User Profile">
              <ViewProfile />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        <Route path="/orders" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="My Orders">
              <Orders />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        <Route path="/admin" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="Admin Panel">
              <AdminPanel />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        <Route path="/admin/edit-user/:userId" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="Edit User">
              <AdminEditUser />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        <Route path="/admin/edit-listing/:listingId" element={
          <SimpleProtectedRoute>
            <PageErrorBoundary pageName="Edit Listing">
              <AdminEditListing />
            </PageErrorBoundary>
          </SimpleProtectedRoute>
        } />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ModeProvider>
              <AppRoutes />
            </ModeProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GlobalErrorBoundary>
);

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProjectsPage from './pages/AdminProjectsPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminUserInfoPage from './pages/AdminUserInfoPage';
import AdminUserDetailsPage from './pages/AdminUserDetailsPage';
import AdminLoginHistoryPage from './pages/AdminLoginHistoryPage';
import AdminVideosPage from './pages/AdminVideosPage';
import AdminArticlesPage from './pages/AdminArticlesPage';
import AdminBooksPage from './pages/AdminBooksPage';
import CRMLeadsPage from './pages/CRMLeadsPage';
import CRMOrdersPage from './pages/CRMOrdersPage';
import CRMTicketsPage from './pages/CRMTicketsPage';
import CRMHubPage from './pages/CRMHubPage';
import AboutPage from './pages/AboutPage';
import TestimonialsPage from './pages/TestimonialsPage';
import AIAuditPage from './pages/AIAuditPage';
import FinanceHubPage from './pages/FinanceHubPage';
import FinanceLedgerPage from './pages/FinanceLedgerPage';
import FinanceTaxPage from './pages/FinanceTaxPage';
import MarketingHubPage from './pages/MarketingHubPage';
import InventoryHubPage from './pages/InventoryHubPage';
import HRHubPage from './pages/HRHubPage';
import ContactPage from './pages/ContactPage';
import AdminMessagesPage from './pages/AdminMessagesPage';

import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectInvestmentPage from './pages/ProjectInvestmentPage';

import VideosPage from './pages/VideosPage';
import VideoDetailsPage from './pages/VideoDetailsPage';
import VideoEditPage from './pages/VideoEditPage';

import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailsPage from './pages/ArticleDetailsPage';
import ArticleEditPage from './pages/ArticleEditPage';

import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import BookEditPage from './pages/BookEditPage';
import ServiceEditPage from './pages/ServiceEditPage';
import ProjectEditPage from './pages/ProjectEditPage';
import ProductEditPage from './pages/ProductEditPage';

import MarketplacePage from './pages/MarketplacePage';
import ProductDetailsPage from './pages/ProductDetailsPage';

import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

import { Toaster } from 'react-hot-toast';
import CampaignWizardPage from './pages/CampaignWizardPage';
import BaidarChatWidget from './components/BaidarChatWidget';
import AegisChatWidget from './components/AegisChatWidget';
import SmartFarmDashboard from './pages/SmartFarmDashboard';
import SovereignAuditPage from './pages/SovereignAuditPage';
import { useSelector } from 'react-redux';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <Toaster position="top-right" />
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                {/* ... existing routes ... */}
                <Route path="/create-campaign" element={<CampaignWizardPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
                <Route path="/resetpassword/:resetToken" element={<ResetPasswordPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Projects */}
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                <Route path="/projects/:id/invest" element={<ProjectInvestmentPage />} />
                <Route path="/projects/:id/audit-report" element={<SovereignAuditPage />} />

                {/* Videos */}
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/videos/:id" element={<VideoDetailsPage />} />

                {/* Articles */}
                <Route path="/articles" element={<ArticlesPage />} />
                <Route path="/articles/:id" element={<ArticleDetailsPage />} />

                {/* Books */}
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:id" element={<BookDetailsPage />} />

                {/* Marketplace */}
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/marketplace/:id" element={<ProductDetailsPage />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />

                {/* Private Routes */}
                <Route path="" element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/smart-farm" element={<SmartFarmDashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="" element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/projects" element={<AdminProjectsPage />} />
                  <Route path="/admin/products" element={<AdminProductsPage />} />
                  <Route path="/admin/orders" element={<AdminOrdersPage />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/user-info" element={<AdminUserInfoPage />} />
                  <Route path="/admin/user/:id" element={<AdminUserDetailsPage />} />
                  <Route path="/admin/logins" element={<AdminLoginHistoryPage />} />
                  <Route path="/admin/videos" element={<AdminVideosPage />} />
                  <Route path="/admin/articles" element={<AdminArticlesPage />} />
                  <Route path="/admin/books" element={<AdminBooksPage />} />
                  <Route path="/admin/crm" element={<CRMHubPage />} />
                  <Route path="/admin/crm/leads" element={<CRMLeadsPage />} />
                  <Route path="/admin/crm/orders" element={<CRMOrdersPage />} />
                  <Route path="/admin/crm/tickets" element={<CRMTicketsPage />} />
                  <Route path="/admin/crm/messages" element={<AdminMessagesPage />} />
                  <Route path="/admin/automation" element={<AIAuditPage />} />
                  <Route path="/admin/finance" element={<FinanceHubPage />} />
                  <Route path="/admin/finance/ledger" element={<FinanceLedgerPage />} />
                  <Route path="/admin/finance/tax" element={<FinanceTaxPage />} />
                  <Route path="/admin/marketing" element={<MarketingHubPage />} />
                  <Route path="/admin/inventory" element={<InventoryHubPage />} />
                  <Route path="/admin/hr" element={<HRHubPage />} />

                  <Route path="/videos/edit/:id" element={<VideoEditPage />} />
                  <Route path="/articles/edit/:id" element={<ArticleEditPage />} />
                  <Route path="/books/edit/:id" element={<BookEditPage />} />
                  <Route path="/videos/new" element={<VideoEditPage />} />
                  <Route path="/articles/new" element={<ArticleEditPage />} />
                  <Route path="/books/new" element={<BookEditPage />} />
                  <Route path="/services/new" element={<ServiceEditPage />} />
                  <Route path="/services/edit/:id" element={<ServiceEditPage />} />
                  <Route path="/projects/new" element={<ProjectEditPage />} />
                  <Route path="/projects/edit/:id" element={<ProjectEditPage />} />
                  <Route path="/marketplace/new" element={<ProductEditPage />} />
                  <Route path="/marketplace/edit/:id" element={<ProductEditPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          {userInfo?.role === 'admin' ? <AegisChatWidget /> : <BaidarChatWidget />}
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;

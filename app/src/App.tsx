import { Routes, Route } from 'react-router';
import { CartProvider } from './hooks/useCart';
import { useIsMobile } from './hooks/useIsMobile';
import { useAuth } from './hooks/useAuth';
import TopBar from './components/TopBar';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import CreditsPage from './pages/CreditsPage';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function RequireAdmin() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-sand text-sm">Loading…</div>;
  }
  if (user?.role !== 'admin') return <Login />;
  return <AdminPage />;
}

/* Mobile Components */
import MobileHeader from './components/mobile/MobileHeader';
import MobileBottomNav from './components/mobile/MobileBottomNav';
import MobileFloatingCart from './components/mobile/MobileFloatingCart';

function DesktopLayout() {
  return (
    <>
      <TopBar />
      <Header />
      <main className="min-h-screen" style={{ background: '#0a0a0a' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<RequireAdmin />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function MobileLayout() {
  return (
    <>
      <MobileHeader />
      <main className="min-h-screen pt-[56px] pb-[60px]" style={{ background: '#0a0a0a' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<RequireAdmin />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <MobileBottomNav />
      <MobileFloatingCart />
    </>
  );
}

export default function App() {
  const isMobile = useIsMobile(1024);

  return (
    <CartProvider>
      <ScrollToTop />
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </CartProvider>
  );
}

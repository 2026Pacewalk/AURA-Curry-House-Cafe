import { Routes, Route } from 'react-router';
import { CartProvider } from './hooks/useCart';
import { useIsMobile } from './hooks/useIsMobile';
import TopBar from './components/TopBar';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';

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
          <Route path="/admin" element={<AdminPage />} />
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
          <Route path="/admin" element={<AdminPage />} />
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

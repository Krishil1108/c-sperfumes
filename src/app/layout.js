import './globals.css';
import { CartProvider } from '../lib/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

export const metadata = {
  title: 'Aura Bella | Luxury Organic Perfumes & Cologne Store',
  description: 'Shop Aura Bella, a premium organic perfume boutique selling long-lasting oud collections, fresh aquatic notes, floral extracts, and custom gift sets.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

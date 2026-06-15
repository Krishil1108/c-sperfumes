import './globals.css';
import { CartProvider } from '../lib/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import BottomNav from '../components/BottomNav';

export const metadata = {
  title: 'Ishaya Luxury Perfume | Luxury Organic Perfumes & Cologne Store',
  description: 'Shop Ishaya Luxury Perfume, a premium organic perfume boutique selling long-lasting oud collections, fresh aquatic notes, floral extracts, and custom gift sets.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#121212',
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
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}

import './globals.css';
import { CartProvider } from '../lib/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import BottomNav from '../components/BottomNav';
import WhatsAppWidget from '../components/WhatsAppWidget';
import CustomCursor from '../components/CustomCursor';

import { getSiteSettings } from '../lib/sanity';

export const metadata = {
  title: 'Ishaya Luxury Perfume | Luxury Organic Perfumes & Cologne Store',
  description: 'Shop Ishaya Luxury Perfume, a premium organic perfume boutique selling long-lasting oud collections, fresh aquatic notes, floral extracts, and custom gift sets.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#121212',
};

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body>
        <CartProvider>
          <CustomCursor />
          <Header settings={settings} />
          <main>{children}</main>
          <Footer settings={settings} />
          <CartDrawer />
          <BottomNav />
          <WhatsAppWidget settings={settings} />
        </CartProvider>
      </body>
    </html>
  );
}

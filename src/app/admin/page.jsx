import AdminClient from './AdminClient';

export const metadata = {
  title: 'Admin Console | C&S Perfumes',
  description: 'Manage website content, products, settings, and orders.',
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function AdminPage() {
  return <AdminClient />;
}

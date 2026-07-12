import { getOrders } from '@/lib/sanity';
import OrdersClient from './OrdersClient';

export const metadata = {
  title: 'Admin Orders | Ishaya Luxury',
  description: 'View and export customer orders',
};

// Force dynamic rendering so we always fetch the latest orders
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  
  return <OrdersClient initialOrders={orders} />;
}

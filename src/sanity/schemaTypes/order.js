export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
    },
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
    },
    {
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'address', title: 'Street Address', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'postalCode', title: 'Postal Code', type: 'string' },
      ],
    },
    {
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productId', title: 'Product ID', type: 'string' },
            { name: 'title', title: 'Product Title', type: 'string' },
            { name: 'quantity', title: 'Quantity', type: 'number' },
            { name: 'price', title: 'Price', type: 'number' },
          ],
        },
      ],
    },
    {
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Online (Razorpay)', value: 'online' },
          { title: 'UPI', value: 'upi' },
          { title: 'Cash On Delivery', value: 'cod' },
        ],
      },
    },
    {
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Paid', value: 'Paid' },
          { title: 'Pending', value: 'Pending' },
          { title: 'Failed', value: 'Failed' },
        ],
      },
    },
    {
      name: 'razorpayOrderId',
      title: 'Razorpay Order ID',
      type: 'string',
    },
    {
      name: 'razorpayPaymentId',
      title: 'Razorpay Payment ID',
      type: 'string',
    },
  ],
  preview: {
    select: {
      title: 'orderId',
      subtitle: 'customerName',
      media: 'paymentStatus',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'New Order',
        subtitle: subtitle || 'Unknown Customer',
        media: media === 'Paid' ? '✅' : media === 'Failed' ? '❌' : '⏳',
      };
    },
  },
};

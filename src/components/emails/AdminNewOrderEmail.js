import * as React from 'react';

export default function AdminNewOrderEmail({ orderId, total, customerEmail, address, items }) {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#000' }}>
      <h2 style={{ textTransform: 'uppercase', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
        New Order Received
      </h2>
      
      <p><strong>Order ID:</strong> #{orderId.slice(0, 8).toUpperCase()}</p>
      <p><strong>Total Value:</strong> ₦{total.toLocaleString()}</p>
      <p><strong>Customer Email:</strong> {customerEmail}</p>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
        <h3 style={{ marginTop: 0, textTransform: 'uppercase', fontSize: '14px' }}>Shipping Details</h3>
        <p style={{ margin: 0 }}>
          {address.firstName} {address.lastName}<br />
          {address.phone}<br />
          {address.street}<br />
          {address.city}, {address.state}<br />
          Method: {address.method}
        </p>
      </div>

      <h3 style={{ textTransform: 'uppercase', fontSize: '14px', marginTop: '30px' }}>Items to Fulfill</h3>
      <ul>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: '10px' }}>
            <strong>{item.quantity}x</strong> {item.title} (Size: {item.size})
          </li>
        ))}
      </ul>
    </div>
  );
}
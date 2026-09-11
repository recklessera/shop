import * as React from 'react';
import { Html, Head, Body, Container } from 'react-email';

export default function AdminNewOrderEmail({ orderId, total, customerEmail, address, items = [] }) {
  return (
    <Html>
      <Head>
        {/* Dark Mode Reset for Admin Emails */}
        <style>
          {`
            @media (prefers-color-scheme: dark) {
              body { background-color: #000000 !important; }
              .email-wrapper { background-color: #111111 !important; border-color: #333333 !important; }
              .text-main { color: #ffffff !important; }
              .text-muted { color: #a1a1aa !important; }
              .bg-muted { background-color: #222222 !important; border-color: #333333 !important; }
              .border-line { border-color: #333333 !important; }
            }
          `}
        </style>
      </Head>
      <Body style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', padding: '40px 20px', backgroundColor: '#f9fafb', margin: 0 }}>
        
        <Container className="email-wrapper" style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', border: '1px solid #000', padding: '30px' }}>
          
          <h2 className="text-main border-line" style={{ textTransform: 'uppercase', borderBottom: '2px solid #000', paddingBottom: '10px', marginTop: 0, color: '#000' }}>
            🚨 New Order Received
          </h2>
          
          <p className="text-main" style={{ color: '#000', fontSize: '14px' }}>
            <strong className="text-main" style={{ color: '#000' }}>Order ID:</strong> #{orderId.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-main" style={{ color: '#000', fontSize: '14px' }}>
            <strong className="text-main" style={{ color: '#000' }}>Total Value:</strong> ₦{total.toLocaleString()}
          </p>
          <p className="text-main" style={{ color: '#000', fontSize: '14px' }}>
            <strong className="text-main" style={{ color: '#000' }}>Customer Email:</strong> {customerEmail}
          </p>

          <div className="bg-muted" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
            <h3 className="text-main" style={{ marginTop: 0, textTransform: 'uppercase', fontSize: '14px', color: '#000' }}>Shipping Details</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.6' }}>
              {address.firstName} {address.lastName}<br />
              {address.phone}<br />
              {address.street}<br />
              {address.city}, {address.state}<br />
              Method: {address.method || 'Standard'}
            </p>
          </div>

          <h3 className="text-main" style={{ textTransform: 'uppercase', fontSize: '14px', marginTop: '30px', color: '#000' }}>Items to Fulfill</h3>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {items.map((item, i) => (
              <li className="text-main" key={i} style={{ marginBottom: '10px', fontSize: '14px', color: '#000' }}>
                <strong className="text-main" style={{ color: '#000' }}>{item.quantity}x</strong> {item.product?.title || 'Unknown Product'} 
                
                {/* FIXED: Safely pull the size and color from the variant object */}
                {(item.variant?.size || item.variant?.color) && (
                  <span className="text-muted" style={{ color: '#666' }}>
                    {' '}({[item.variant?.size, item.variant?.color].filter(Boolean).join(' / ')})
                  </span>
                )}
              </li>
            ))}
          </ul>

        </Container>
      </Body>
    </Html>
  );
}
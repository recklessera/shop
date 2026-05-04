import * as React from 'react';

export default function OrderReceiptEmail({ firstName, orderId, total, method, cost }) {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#000', padding: '40px 20px', backgroundColor: '#f9f9f9' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#000', padding: '30px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '24px' }}>
            Reckless Era
          </h1>
        </div>

        {/* Body */}
        <div style={{ padding: '40px 30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Payment Confirmed</h2>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.6' }}>
            Hey {firstName},<br /><br />
            Your payment for order <strong>#{orderId.slice(0, 8).toUpperCase()}</strong> has been successfully processed. We are now preparing your items for {method} shipping.
          </p>

          {/* Summary Box */}
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginTop: '30px' }}>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px', margin: '0 0 15px 0' }}>
              Order Summary
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
              <span style={{ color: '#555' }}>Shipping ({method})</span>
              <strong>{cost === 0 ? 'Free' : `₦${cost.toLocaleString()}`}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eaeaea', paddingTop: '15px', marginTop: '10px', fontSize: '18px' }}>
              <span>Total Paid</span>
              <strong>₦{total.toLocaleString()}</strong>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#888', marginTop: '40px', textAlign: 'center' }}>
            You will receive another email with tracking details once your order ships.
          </p>
        </div>

      </div>
    </div>
  );
}
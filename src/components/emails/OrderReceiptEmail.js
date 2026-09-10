import * as React from 'react';

export default function OrderReceiptEmail({ firstName, orderId, total, method, cost }) {
  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#000', padding: '40px 20px', backgroundColor: '#fff' }}>
      {/* Changed to sharp borders, no border radius, stark black and white */}
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', border: '1px solid #000' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#000', padding: '40px 30px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '24px', fontWeight: '900' }}>
            Reckless Era
          </h1>
          <p style={{ color: '#fff', margin: '10px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '10px', opacity: 0.8 }}>
            Off Course. On Purpose.
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '40px 30px' }}>
          <h2 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', fontWeight: 'bold' }}>
            Payment Confirmed
          </h2>
          <p style={{ fontSize: '14px', color: '#000', lineHeight: '1.6', margin: '0 0 30px 0' }}>
            {firstName},<br /><br />
            Your payment for order <strong>#{orderId.slice(0, 8).toUpperCase()}</strong> has been successfully processed. We are now preparing your items for {method} delivery.
          </p>

          {/* Summary Box */}
          <div style={{ border: '1px solid #eaeaea', padding: '20px', marginTop: '10px' }}>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #000', paddingBottom: '10px', margin: '0 0 15px 0' }}>
              Order Summary
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>Shipping ({method})</span>
              <strong>{cost === 0 ? 'Free' : `₦${cost.toLocaleString()}`}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eaeaea', paddingTop: '15px', marginTop: '10px' }}>
              <span style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', fontWeight: 'bold' }}>Total Paid</span>
              <strong style={{ fontSize: '16px' }}>₦{total.toLocaleString()}</strong>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#666', marginTop: '40px', textAlign: 'center', lineHeight: '1.6' }}>
            You will receive another email with tracking details once your order ships.<br/>
            For support, contact <a href="mailto:customercare@recklessera.com" style={{ color: '#000', fontWeight: 'bold' }}>customercare@recklessera.com</a>
          </p>
        </div>

      </div>
    </div>
  );
}
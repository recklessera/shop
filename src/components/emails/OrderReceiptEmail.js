import * as React from 'react';
import { Html, Head, Body, Container } from 'react-email';

export default function OrderReceiptEmail({ firstName, orderId, total, method, cost, items = [] }) {
  return (
    <Html>
      <Head>
        {/* This style block explicitly controls how the email looks in Dark Mode */}
        <style>
          {`
            @media (prefers-color-scheme: dark) {
              body { background-color: #000000 !important; }
              .email-wrapper { background-color: #111111 !important; border-color: #333333 !important; }
              .text-main { color: #ffffff !important; }
              .text-muted { color: #a1a1aa !important; }
              .border-line { border-color: #333333 !important; }
              .brand-header { background-color: #000000 !important; border-bottom: 1px solid #333333 !important; }
            }
          `}
        </style>
      </Head>
      <Body style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', padding: '40px 20px', backgroundColor: '#f9fafb', margin: 0 }}>
        
        {/* Changed to sharp borders, Stark black and white, with dark mode classes applied */}
        <Container className="email-wrapper" style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', border: '1px solid #000' }}>
          
          {/* Header */}
          <div className="brand-header" style={{ backgroundColor: '#000', padding: '40px 30px', textAlign: 'center' }}>
            <h1 style={{ color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '24px', fontWeight: '900' }}>
              Reckless Era
            </h1>
            <p style={{ color: '#fff', margin: '10px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '10px', opacity: 0.8 }}>
              Off Course. On Purpose.
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '40px 30px' }}>
            <h2 className="text-main" style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', fontWeight: 'bold', color: '#000' }}>
              Payment Confirmed
            </h2>
            <p className="text-muted" style={{ fontSize: '14px', color: '#000', lineHeight: '1.6', margin: '0 0 30px 0' }}>
              {firstName},<br /><br />
              Your payment for order <strong className="text-main">#{orderId.slice(0, 8).toUpperCase()}</strong> has been successfully processed. We are now preparing your items for {method} delivery.
            </p>

            {/* Summary Box */}
            <div className="border-line" style={{ border: '1px solid #eaeaea', padding: '20px', marginTop: '10px' }}>
              <h3 className="text-main border-line" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #000', paddingBottom: '10px', margin: '0 0 15px 0', color: '#000' }}>
                Order Summary
              </h3>
              
              {/* FIXED: We now map through the items array to show the actual clothes! */}
              {items && items.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  {items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                      <div style={{ flex: 1, paddingRight: '10px' }}>
                        <strong className="text-main" style={{ color: '#000', display: 'block', marginBottom: '2px' }}>
                          {item.product?.title || 'Reckless Item'}
                        </strong>
                        {(item.variant?.size || item.variant?.color) && (
                          <span className="text-muted" style={{ fontSize: '12px', color: '#666' }}>
                            {[item.variant.size, item.variant.color].filter(Boolean).join(' / ')} x {item.quantity}
                          </span>
                        )}
                      </div>
                      <strong className="text-main" style={{ color: '#000' }}>
                        ₦{(item.price_at_purchase * item.quantity).toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
                <span className="text-muted" style={{ color: '#666' }}>Shipping ({method})</span>
                <strong className="text-main" style={{ color: '#000' }}>{cost === 0 ? 'Free' : `₦${cost.toLocaleString()}`}</strong>
              </div>

              <div className="border-line" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eaeaea', paddingTop: '15px', marginTop: '10px' }}>
                <span className="text-main" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>Total Paid</span>
                <strong className="text-main" style={{ fontSize: '16px', color: '#000' }}>₦{total.toLocaleString()}</strong>
              </div>
            </div>

            <p className="text-muted" style={{ fontSize: '12px', color: '#666', marginTop: '40px', textAlign: 'center', lineHeight: '1.6' }}>
              You will receive another email with tracking details once your order ships.<br/>
              For support, contact <a href="mailto:customercare@recklessera.com" className="text-main" style={{ color: '#000', fontWeight: 'bold' }}>customercare@recklessera.com</a>
            </p>
          </div>

        </Container>
      </Body>
    </Html>
  );
}
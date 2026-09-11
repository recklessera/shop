import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
} from 'react-email';

export default function OrderShippedEmail({ 
  firstName, 
  orderId, 
  courierName, 
  trackingNumber, 
  shippingNotes 
}) {
  const storeUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://recklessera.com';

  return (
    <Html>
      <Head>
        {/* Dark Mode Reset to maintain the aesthetic on all devices */}
        <style>
          {`
            @media (prefers-color-scheme: dark) {
              body { background-color: #000000 !important; }
              .email-wrapper { background-color: #111111 !important; border-color: #333333 !important; }
              .brand-header { background-color: #000000 !important; border-bottom: 1px solid #333333 !important; }
              .text-main { color: #ffffff !important; }
              .text-muted { color: #a1a1aa !important; }
              .bg-muted { background-color: #222222 !important; border-color: #333333 !important; }
              .border-line { border-color: #333333 !important; }
              .button-dark { background-color: #ffffff !important; color: #000000 !important; border-color: #ffffff !important; }
            }
          `}
        </style>
      </Head>
      <Body style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', padding: '40px 20px', backgroundColor: '#f9fafb', margin: 0 }}>
        
        <Container className="email-wrapper" style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', border: '1px solid #000' }}>
          
          {/* Header */}
          <div className="brand-header" style={{ backgroundColor: '#000', padding: '40px 30px', textAlign: 'center' }}>
            <h1 style={{ color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '24px', fontWeight: '900' }}>
              Reckless Era
            </h1>
            <p style={{ color: '#fff', margin: '10px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '10px', opacity: 0.8 }}>
              Dispatch Notification
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '40px 30px' }}>
            <Text className="text-main" style={{ fontSize: '16px', color: '#000', margin: '0 0 16px' }}>
              Hello {firstName},
            </Text>
            <Text className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6', color: '#333', margin: '0 0 30px 0' }}>
              Your order <strong className="text-main" style={{ color: '#000' }}>#{orderId.slice(0, 8).toUpperCase()}</strong> has been dispatched and is officially on its way to you.
            </Text>

            {/* Tracking Details Box */}
            <div className="bg-muted border-line" style={{ border: '1px solid #eaeaea', padding: '24px', backgroundColor: '#f9f9f9', marginBottom: '30px' }}>
              <Text className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', color: '#666', margin: '0 0 4px' }}>
                Courier / Service
              </Text>
              <Text className="text-main" style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', margin: '0 0 16px' }}>
                {courierName || 'Standard Delivery'}
              </Text>

              {trackingNumber && (
                <>
                  <Text className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', color: '#666', margin: '0 0 4px' }}>
                    Tracking / Contact No.
                  </Text>
                  <Text className="text-main" style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', margin: '0 0 16px' }}>
                    {trackingNumber}
                  </Text>
                </>
              )}

              {shippingNotes && (
                <>
                  <Text className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', color: '#666', margin: '0 0 4px' }}>
                    Dispatch Notes
                  </Text>
                  <Text className="text-muted" style={{ fontSize: '14px', fontStyle: 'italic', color: '#444', margin: '0' }}>
                    {shippingNotes}
                  </Text>
                </>
              )}
            </div>

            {/* Action Button */}
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button 
                className="button-dark" 
                pX={24} 
                pY={16} 
                style={{ backgroundColor: '#000', color: '#fff', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', display: 'inline-block', border: '1px solid #000' }} 
                href={`${storeUrl}/account`}
              >
                Track Order Status
              </Button>
            </Section>

            {/* Footer */}
            <Section className="border-line" style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid #eaeaea', paddingTop: '20px' }}>
              <Text className="text-muted" style={{ fontSize: '12px', color: '#666', lineHeight: '1.5', margin: '0 0 8px' }}>
                If you have any issues with your delivery, reply directly to this email or reach out to us on our official channels.
              </Text>
              <Text className="text-muted" style={{ fontSize: '12px', color: '#666', lineHeight: '1.5', margin: '0 0 8px' }}>
                &copy; {new Date().getFullYear()} Reckless Era. All rights reserved.
              </Text>
            </Section>

          </div>
        </Container>
      </Body>
    </Html>
  );
}
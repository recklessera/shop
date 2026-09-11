import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';

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
      <Head />
      <Body style={main}>
        <Container style={container}>
          
          {/* Header */}
          <Section style={header}>
            <Text style={brandName}>RECKLESS ERA.</Text>
            <Text style={headerSubtitle}>Dispatch Notification</Text>
          </Section>

          {/* Hero Message */}
          <Section style={section}>
            <Text style={greeting}>Hello {firstName},</Text>
            <Text style={paragraph}>
              Your order <strong style={bold}>#{orderId.slice(0, 8).toUpperCase()}</strong> has been dispatched and is officially on its way to you.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Tracking Details */}
          <Section style={trackingBox}>
            <Text style={trackingLabel}>Courier / Service</Text>
            <Text style={trackingValue}>{courierName || 'Standard Delivery'}</Text>

            {trackingNumber && (
              <>
                <Text style={trackingLabel}>Tracking / Contact No.</Text>
                <Text style={trackingValue}>{trackingNumber}</Text>
              </>
            )}

            {shippingNotes && (
              <>
                <Text style={trackingLabel}>Dispatch Notes</Text>
                <Text style={trackingNotes}>{shippingNotes}</Text>
              </>
            )}
          </Section>

          {/* Action Button */}
          <Section style={buttonContainer}>
            <Button pX={24} pY={16} style={button} href={`${storeUrl}/account`}>
              Track Order Status
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you have any issues with your delivery, reply directly to this email or reach out to us on our official channels.
            </Text>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Reckless Era. All rights reserved.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// --- Styles ---
const main = { backgroundColor: '#f9fafb', fontFamily: 'HelveticaNeue, Helvetica, Arial, sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '600px', backgroundColor: '#ffffff', border: '1px solid #f3f4f6' };
const header = { textAlign: 'center', marginBottom: '32px' };
const brandName = { fontSize: '24px', fontWeight: '900', letterSpacing: '0.1em', margin: '0', color: '#111827' };
const headerSubtitle = { fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b7280', margin: '8px 0 0' };
const section = { marginBottom: '24px' };
const greeting = { fontSize: '16px', color: '#374151', margin: '0 0 16px' };
const paragraph = { fontSize: '14px', lineHeight: '1.6', color: '#4b5563', margin: '0' };
const bold = { color: '#111827', fontWeight: 'bold' };
const divider = { borderColor: '#e5e7eb', margin: '24px 0' };
const trackingBox = { backgroundColor: '#f9fafb', padding: '24px', border: '1px solid #e5e7eb', marginBottom: '24px' };
const trackingLabel = { fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', color: '#6b7280', margin: '0 0 4px' };
const trackingValue = { fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px' };
const trackingNotes = { fontSize: '14px', fontStyle: 'italic', color: '#4b5563', margin: '0' };
const buttonContainer = { textAlign: 'center', marginTop: '32px' };
const button = { backgroundColor: '#111827', color: '#ffffff', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', textAlign: 'center', display: 'inline-block' };
const footer = { textAlign: 'center', marginTop: '32px' };
const footerText = { fontSize: '12px', color: '#9ca3af', lineHeight: '1.5', margin: '0 0 8px' };
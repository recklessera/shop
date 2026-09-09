export const metadata = {
  title: 'Privacy Policy | Reckless Era',
  description: 'How we collect, use, and safeguard your data at Reckless Era.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-black mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
          Effective Date: September 2026
        </p>
      </div>

      <div className="space-y-12 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            1. Introduction
          </h2>
          <p>
            Welcome to Reckless Era. We respect your privacy and are committed to protecting your personal data in compliance with the Nigerian Data Protection Regulation (NDPR) and other applicable privacy laws. This policy explains how we collect, use, and safeguard your information when you visit recklessera.com or make a purchase.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            2. Information We Collect
          </h2>
          <p className="mb-2">When you interact with our brand, we collect the following:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-black">Personal Identity Data:</strong> Name, email address, shipping and billing addresses, and phone number.</li>
            <li><strong className="text-black">Transaction Data:</strong> Order details and purchase history. (Note: We do not store your raw credit card numbers. All payments are securely processed and encrypted by our payment partner, Squadco).</li>
            <li><strong className="text-black">Technical & Usage Data:</strong> IP address, browser type, device information, and how you navigate our website (via cookies).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            3. How We Use Your Data
          </h2>
          <p className="mb-2">We use your information exclusively to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Process and deliver your orders.</li>
            <li>Manage your "Inner Circle" account and authenticate your logins.</li>
            <li>Communicate with you regarding order updates, tracking, and customer support.</li>
            <li>Send you exclusive drops and marketing (only if you have explicitly opted in, such as joining our WhatsApp community).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            4. Data Sharing & Third Parties
          </h2>
          <p className="mb-2">We do not sell your personal data. We only share necessary information with trusted third-party services that make our store function:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-black">Squadco:</strong> To securely process your payments.</li>
            <li><strong className="text-black">Delivery Partners:</strong> To ship your physical items.</li>
            <li><strong className="text-black">Infrastructure Partners:</strong> To host our database securely and send automated system emails (e.g., Supabase, Resend).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            5. Your NDPR Rights
          </h2>
          <p>
            Under the NDPR, you have the right to request access to your personal data, ask us to correct inaccuracies, or request the complete deletion of your account and data from our servers.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            6. Contact Us
          </h2>
          <p>
            For any privacy-related concerns or data deletion requests, please contact our team at <a href="mailto:customercare@recklessera.com" className="text-black font-bold hover:underline">customercare@recklessera.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
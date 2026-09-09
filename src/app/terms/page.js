export const metadata = {
  title: 'Terms of Service | Reckless Era',
  description: 'Terms and conditions for shopping at Reckless Era.',
};

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-black mb-4">
          Terms of Service
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
          Effective Date: September 2026
        </p>
      </div>

      <div className="space-y-12 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            1. Overview
          </h2>
          <p>
            This website is operated by Reckless Era. By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions. These terms apply to all users of the site.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            2. Products and Pricing
          </h2>
          <ul className="list-disc pl-5 space-y-4">
            <li><strong className="text-black">Availability:</strong> All products are subject to availability. We reserve the right to limit the quantities of any products or services that we offer.</li>
            <li><strong className="text-black">Pricing:</strong> Prices for our products are subject to change without notice. We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of a product.</li>
            <li><strong className="text-black">Accuracy:</strong> We have made every effort to display the colors and images of our products as accurately as possible. However, we cannot guarantee that your computer monitor's display of any color will be accurate.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            3. Billing and Account Information
          </h2>
          <p>
            You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. We reserve the right to refuse any order you place with us. In the event that we make a change to or cancel an order, we will notify you by contacting the email and/or billing address provided at the time the order was made.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            4. Payments
          </h2>
          <p>
            All financial transactions are handled securely through our authorized payment gateway (Squadco). By submitting your payment information, you authorize us and our payment processor to charge the applicable fees to your selected payment method.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            5. Intellectual Property
          </h2>
          <p>
            All content on this website, including but not limited to the "Reckless Era" brand name, logos, graphics, clothing designs, and text, is the intellectual property of Reckless Era. You may not use, reproduce, or duplicate our intellectual property without express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            6. Governing Law
          </h2>
          <p>
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-200 pb-2">
            7. Contact Information
          </h2>
          <p>
            Questions about the Terms of Service should be sent to us at <a href="mailto:customercare@recklessera.com" className="text-black font-bold hover:underline">customercare@recklessera.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';

const TermsOfPurchase: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitting(true);
    // Simulate network request
    await new Promise((r) => setTimeout(r, 700));
    setIsSubmitting(false);
    setEmail('');
    // Non-blocking UX feedback — keep client-only alert
    // (In production you'd call an API and handle errors)
    alert('Thanks! You have been subscribed.');
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Jost, sans-serif' }}>
      {/* Hero Section */}
      <header className="relative w-full bg-black text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 border border-white/20">
              <Icon icon="mdi:cart" className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Purchase Terms</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
              Terms of <span className="text-white">Purchase</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
              These Terms of Purchase govern your purchases on our website. Please read them carefully before placing an order.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* General Terms Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Icon icon="mdi:file-document" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>General Terms</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                General <span className="text-black">Terms</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Understanding our agreement and your responsibilities
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-100">
              <ol className="space-y-4 sm:space-y-5">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">1</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      When you purchase any product (the "Product(s)") and/or handling, delivery, assembly and/or any other services (the "Service(s)") from Izaj (Philippines) Limited ("us", "we", "our") on <a href="http://www.izaj.com/ph/en/" target="_blank" rel="noopener noreferrer" className="text-black font-semibold hover:underline" style={{ fontFamily: 'Jost, sans-serif' }}>www.izaj.com/ph/en/</a> (the "Website"), you conclude a legally binding agreement with us based on these Terms of Purchase. Each order under which you purchase Product(s) and/or Service(s) shall be referred to as an "Order".
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">2</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      You should read these Terms of Purchase together with the Terms of Use, the Privacy Policy, and the Cookie Policy. The Terms of Use and the Privacy Policy shall be incorporated into these Terms of Purchase by reference.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">3</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      In the event of any inconsistency between these Terms of Purchase, Terms of Use, and the Privacy Policy, these Terms of Purchase shall prevail.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">4</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      You agree that we may modify these Terms of Purchase without liability and without prior notice to you. The modified Terms of Purchase will be posted on the Website, and will come into effect from the date of such posting. You are advised to check for updates to these Terms of Purchase regularly, prior to purchasing any Product(s) on the Website.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">5</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      You understand that you must, at your own cost, provide telecommunication services, computers, and other equipment or services necessary to access the Website. You must comply with all the rules and regulations that apply to the means that you have used to access the Website (e.g. Internet access).
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">6</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      We will do our best to check the Website for viruses but we do not warrant that the Website is free of viruses or other malicious content.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">7</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      All decisions and determinations made by us under these Terms of Purchase are final.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Products & Prices Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Icon icon="mdi:tag" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Products & Pricing</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Product(s) – Description and <span className="text-black">Prices</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Information about our products and pricing policies
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-100">
              <ol className="space-y-4 sm:space-y-5">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">8</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      We may temporarily or permanently remove any Product(s) and/or Service(s) from the Website at any time, with or without notice to you.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">9</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      All Products sold through the Website are intended for domestic use only; the Products are not suitable for commercial or industrial use unless expressly stated.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">10</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      We try our best to make sure that all information on the Website, including descriptions of the Product(s) and/or Service(s) and listed prices are accurate at all times.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">11</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      When browsing the Website, the colors of Products may vary depending on a number of factors, such as the display settings of your computer monitor.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">12</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Pictures and images on the Website are for illustration purposes only. For an accurate description of any Product and details of what is included with the Product, please read the Product description.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">13</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Unless otherwise stated, all Product prices shown on the Website are quoted in Philippine peso per unit and are inclusive of applicable taxes.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">14</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      However, the Product prices are not inclusive of Service fees, which will be added to your total Order price.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">15</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                      We do not guarantee that:
                    </p>
                    <ul className="list-[lower-alpha] pl-6 space-y-2 text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Jost, sans-serif' }}>
                      <li>the Product or Service prices on the Website will be the same as the in-store prices (and vice versa);</li>
                      <li>any promotion that is offered on the Website will be available in-store (and vice versa); and</li>
                      <li>any Product or Service that is offered for sale on the Website will also be offered for sale in-store (and vice versa).</li>
                    </ul>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">16</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      We reserve the right to adjust prices, Products, Product descriptions, Services, Service descriptions, and special offers at any time and at our discretion.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Placement of Orders Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Icon icon="mdi:cart-plus" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Ordering Process</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Placement of <span className="text-black">Orders</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                How to place an order and what to expect
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-100">
              <ol className="space-y-4 sm:space-y-5">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">17</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                      When you place an Order, you represent and warrant to us that:
                    </p>
                    <ul className="list-[lower-alpha] pl-6 space-y-2 text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Jost, sans-serif' }}>
                      <li>you are at least 18 years of age;</li>
                      <li>if you are not at least 18 years of age, you have obtained the consent of your parent or guardian to place the Order;</li>
                      <li>you are duly authorized to use the customer account under which you have placed the Order; and</li>
                      <li>you are a resident of the Philippines.</li>
                    </ul>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">18</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      You will also need to provide us with an active email address and a telephone number so that we can easily contact you.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">19</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Your Order counts as an offer to purchase the Product(s) and/or Service(s) from us, at the prices set out on the Delivery Notification email.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">20</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      After placing your Order, you will receive an order confirmation email. This contains an order number, details of the Product(s) & Service(s) you have ordered, and the total cost of the Order.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">21</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      The Order confirmation email does not constitute our acceptance of your Order.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">22</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      The sale of Products is subject to availability. We will contact you in the event any Product that you have ordered is not in stock.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">23</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Your Order is only deemed accepted by us when we send you the Delivery Notification email.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Delivery Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Icon icon="mdi:truck-delivery" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Delivery Information</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Delivery of <span className="text-black">Orders</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Everything you need to know about delivery and shipping
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-100">
              <ol className="space-y-4 sm:space-y-5">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">24</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      All delivery and assembly services are provided by our third-party service provider.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">25</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      The delivery fees are based on the delivery of one Order to a single address within the Philippines. Promotional delivery fees may apply at our discretion and may be withdrawn at any time before the Order is confirmed.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">26</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      We will try our best to meet your chosen delivery date and timeslot, however, there may be times where we are unable to do so, and when this happens, we will contact you to re-arrange the delivery date and timeslot.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">27</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      You shall inform us of any delivery restrictions or difficulty in accessing your property when you place an Order, and ensure that the relevant permits are obtained from the building/residential management prior to the scheduled delivery date. If you live in a gated community, compound, or condominium complex, you shall be wholly responsible for obtaining clearance or permits for the entry and exit of the delivery personnel from such gated community, compound or condominium complex. This includes prepaying or clearing any fees that are assessed against delivery vehicles or personnel.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Returns Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Icon icon="mdi:undo" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Returns Policy</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Returns
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Our return policy and conditions
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-100">
              <ol className="space-y-4 sm:space-y-5">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">48</div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                      You can return any Product within 365 days of the date of your Order, provided that the Product:
                    </p>
                    <ul className="list-[lower-alpha] pl-6 space-y-2 text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Jost, sans-serif' }}>
                      <li>is new;</li>
                      <li>is unused;</li>
                      <li>has its packaging intact (if applicable);</li>
                      <li>if already assembled, is in our absolute discretion, in re-saleable condition; and</li>
                      <li>fulfill any other returns criteria that may from time to time be imposed by us, and such returns criteria can be found here.</li>
                      <li className="mt-2">does not belong to the following categories: plants, cut fabric, custom countertops and as-is products. We are unable to refund or exchange your items if your merchandise is found to be modified from its original form when purchased, dirty, stained, or damaged.</li>
                    </ul>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Liability & Misc Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Icon icon="mdi:shield-alert" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Liability & Misc</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Liability & <span className="text-black">Misc</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Important information about liability and warranties
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-100">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                All Product(s) are provided "as-is". We, our affiliates, officers and employees give no guarantee, representation or warranty, whether express or implied, in respect of the quality or fitness for a particular purpose of any Product.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Notices Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Icon icon="mdi:email" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Contact Information</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Notices
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Get in touch with us for any questions or concerns
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-100">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                    <Icon icon="mdi:map-marker" className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>Address</h3>
                    <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Jost, sans-serif' }}>173 1, San Pablo City, 4000 Laguna</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                    <Icon icon="mdi:phone" className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>Contact number</h3>
                    <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Jost, sans-serif' }}>+63 2 8888 Izaj (4532)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                    <Icon icon="mdi:email" className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>Email</h3>
                    <a href="mailto:customerservice@izaj.com" className="text-sm sm:text-base text-gray-600 hover:text-black transition-colors" style={{ fontFamily: 'Jost, sans-serif' }}>customerservice@izaj.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TermsOfPurchase;



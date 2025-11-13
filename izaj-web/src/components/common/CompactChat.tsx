import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface CompactChatProps {
  onClose?: () => void;
  productName?: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'izaj';
  timestamp: Date;
  isContactInfo?: boolean;
  showLanguageSelection?: boolean;
}

const CompactChat: React.FC<CompactChatProps> = ({ onClose, productName }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: `Hi! I'm your IZAJ Assistant. Please choose your preferred language:`, 
      sender: 'izaj', 
      timestamp: new Date(),
      showLanguageSelection: true
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'tl' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Language selection component
  const LanguageSelection = () => {
    const handleLanguageSelect = (lang: 'en' | 'tl') => {
      setPreferredLanguage(lang);
      const greeting = lang === 'tl' 
        ? `Kumusta! Ako ang IZAJ Assistant. Paano ko kayo matutulungan tungkol sa ${productName || 'aming mga produkto'} ngayon?`
        : `Hi! I'm your IZAJ Assistant. How can I help you with ${productName || 'our products'} today?`;
      
      // Remove language selection from first message
      setMessages(prev => prev.map(msg => 
        msg.id === 1 ? { ...msg, showLanguageSelection: false, text: greeting } : msg
      ));
      
      // Add user's language choice as a message
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: lang === 'tl' ? 'Tagalog' : 'English',
        sender: 'user',
        timestamp: new Date()
      }]);
    };

    return (
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => handleLanguageSelect('en')}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          🇺🇸 English
        </button>
        <button
          onClick={() => handleLanguageSelect('tl')}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          🇵🇭 Tagalog
        </button>
      </div>
    );
  };

  // Contact information component
  const ContactInfoMessage = () => {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Icon icon="mdi:account-circle" className="text-blue-600 text-xl" />
          <h4 className="font-semibold text-blue-900 text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>Contact IZAJ Lighting</h4>
        </div>
        <div className="space-y-2 text-sm">
          <a 
            href="tel:+63491234567" 
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            <Icon icon="mdi:phone" className="text-lg" />
            <span>+63 (49) 123-4567</span>
          </a>
          <a 
            href="mailto:info@izajlighting.com" 
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            <Icon icon="mdi:email" className="text-lg" />
            <span>info@izajlighting.com</span>
          </a>
          <a 
            href="https://facebook.com/izajlighting" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            <Icon icon="mdi:facebook" className="text-lg" />
            <span>Facebook: IZAJ Lighting Centre</span>
          </a>
          <div className="flex items-start gap-2 text-gray-700 mt-3 pt-3 border-t border-blue-200" style={{ fontFamily: 'Jost, sans-serif' }}>
            <Icon icon="mdi:map-marker" className="text-lg mt-0.5" />
            <div>
              <p className="font-medium">Address:</p>
              <p>173 1, San Pablo City, 4000 Laguna, Philippines</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Detect if message is in Tagalog
  const isTagalog = (message: string): boolean => {
    const tagalogWords = [
      'magkano', 'presyo', 'mayroon', 'may', 'wala', 'paano', 'ano', 'saan', 'kailan', 'bakit',
      'salamat', 'kumusta', 'oo', 'opo', 'hindi', 'hindi po', 'padala', 'delivery', 'kabit',
      'installation', 'garantiya', 'warranty', 'stock', 'available', 'kulay', 'laki', 'sukat',
      'bayad', 'payment', 'pickup', 'marami', 'bulk', 'custom', 'oras', 'orasan', 'produkto',
      'led', 'hello', 'hi', 'kumusta', 'salamat', 'tulong', 'help', 'paalam', 'bye', 'order',
      'sundan', 'track', 'admin', 'manager', 'tao', 'makausap', 'kontak', 'telepono', 'email',
      'facebook', 'address', 'lugar', 'tindahan', 'store', 'opisina', 'office', 'diskwento',
      'sale', 'promo', 'install', 'setup', 'mount', 'return', 'refund', 'balik', 'quality',
      'kalidad', 'material', 'materyal', 'durable', 'matibay', 'catalog', 'katalogo', 'items',
      'gamit', 'collection', 'koleksyon', 'energy', 'enerhiya', 'efficient', 'mahusay', 'wattage'
    ];
    return tagalogWords.some(word => message.includes(word));
  };

  // Chatbot intelligence function
  const generateBotResponse = (userMessage: string): { text: string; showContactInfo?: boolean } => {
    const message = userMessage.toLowerCase();
    // Use preferred language if set, otherwise detect from message
    const isTagalogMessage = preferredLanguage === 'tl' || (preferredLanguage === null && isTagalog(message));
    
    // Check if user wants to speak with admin/manager
    if (
      message.includes('admin') || 
      message.includes('manager') || 
      message.includes('human') || 
      message.includes('person') ||
      message.includes('tao') ||
      message.includes('makausap') ||
      message.includes('talk to') ||
      message.includes('speak with') ||
      message.includes('contact') ||
      message.includes('kontak') ||
      message.includes('phone') ||
      message.includes('telepono') ||
      message.includes('email') ||
      message.includes('facebook') ||
      message.includes('address') ||
      message.includes('lugar') ||
      message.includes('location') ||
      message.includes('store') ||
      message.includes('tindahan') ||
      message.includes('office') ||
      message.includes('opisina')
    ) {
      return {
        text: isTagalogMessage 
          ? "Masaya akong makakonekta kayo sa aming team! Narito kung paano kayo makakontak sa IZAJ Lighting:"
          : "I'd be happy to connect you with our team! Here's how you can reach IZAJ Lighting:",
        showContactInfo: true
      };
    }
    
    // Check for shipping fee questions FIRST - show contact info automatically
    // This must be checked BEFORE general price questions to avoid conflicts
    if (
      message.includes('shipping fee') || 
      message.includes('delivery fee') || 
      message.includes('ship fee') || 
      message.includes('deliver fee') ||
      message.includes('magkano shipping') ||
      message.includes('magkano delivery') ||
      message.includes('magkano padala') ||
      message.includes('magkano ang shipping') ||
      message.includes('magkano ang delivery') ||
      message.includes('magkano ang padala') ||
      message.includes('how much shipping') ||
      message.includes('how much delivery') ||
      message.includes('how much is shipping') ||
      message.includes('how much is delivery') ||
      message.includes('shipping cost') ||
      message.includes('delivery cost') ||
      message.includes('padala fee') ||
      message.includes('bayad sa padala') ||
      message.includes('presyo ng shipping') ||
      message.includes('presyo ng delivery') ||
      message.includes('shipping price') ||
      message.includes('delivery price') ||
      message.includes('shipping charge') ||
      message.includes('delivery charge') ||
      (message.includes('shipping') && (message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('charge') || message.includes('magkano') || message.includes('how much'))) ||
      (message.includes('delivery') && (message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('charge') || message.includes('magkano') || message.includes('how much'))) ||
      (message.includes('padala') && (message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('charge') || message.includes('magkano') || message.includes('bayad')))
    ) {
      return {
        text: isTagalogMessage 
          ? "Para sa impormasyon tungkol sa shipping fee, pakikontak ang aming team. Narito ang aming contact information:"
          : "For shipping fee information, please contact our team. Here's our contact information:",
        showContactInfo: true
      };
    }
    
    // Product information responses
    // Note: Price check excludes shipping/delivery related terms to avoid conflicts
    if (
      (message.includes('price') || message.includes('cost') || message.includes('how much') || message.includes('magkano') || message.includes('presyo')) &&
      !message.includes('shipping') && 
      !message.includes('delivery') && 
      !message.includes('padala')
    ) {
      return { 
        text: isTagalogMessage 
          ? "Ang aming mga produkto ay may competitive na presyo! Makikita ninyo ang kasalukuyang presyo sa product page. Mayroon din kaming special discounts at monthly deals. Gusto ninyo bang malaman ang aming current promotions?"
          : "Our products are competitively priced! You can see the current price displayed on the product page. We also offer special discounts and monthly deals. Would you like to know about our current promotions?" 
      };
    }
    
    if (message.includes('discount') || message.includes('sale') || message.includes('promotion') || message.includes('deal') || message.includes('diskwento') || message.includes('promo')) {
      return { 
        text: isTagalogMessage 
          ? "Magandang balita! Mayroon kaming ongoing monthly deals at special promotions. Tingnan ang aming 'SALES' section para sa current discounts. Maaari din kayong makipag-ugnayan sa amin para sa bulk order discounts!"
          : "Great news! We have ongoing monthly deals and special promotions. Check out our 'SALES' section for current discounts. You can also contact us directly for bulk order discounts!" 
      };
    }
    
    if (message.includes('delivery') || message.includes('shipping') || message.includes('deliver') || message.includes('ship') || message.includes('padala')) {
      return { 
        text: isTagalogMessage 
          ? "Nag-ooffer kami ng delivery sa loob ng 10-14 working days para sa store pickup, 10-14 days para sa Metro Manila, at 14 days para sa Provincial areas. Available din ang professional installation upon request!"
          : "We offer delivery within 10-14 working days for store pickup, 10-14 days for Metro Manila, and 14 days for Provincial areas. Professional installation is also available upon request!" 
      };
    }
    
    if (message.includes('install') || message.includes('installation') || message.includes('setup') || message.includes('mount') || message.includes('kabit')) {
      return { 
        text: isTagalogMessage 
          ? "Oo! Nagbibigay kami ng professional installation services para sa lahat ng aming lighting products. Ang aming experienced technicians ay tiyak na proper setup at safety. Makipag-ugnayan sa amin para mag-schedule ng installation appointment."
          : "Yes! We provide professional installation services for all our lighting products. Our experienced technicians will ensure proper setup and safety. Contact us to schedule an installation appointment." 
      };
    }
    
    if (message.includes('warranty') || message.includes('guarantee') || message.includes('return') || message.includes('refund') || message.includes('garantiya') || message.includes('balik')) {
      return { 
        text: isTagalogMessage 
          ? "Sinusuportahan namin ang aming mga produkto ng comprehensive warranty coverage. Para sa specific warranty details at return policies, pakikontak ang aming customer service team. Kami ay committed sa inyong satisfaction!"
          : "We stand behind our products with comprehensive warranty coverage. For specific warranty details and return policies, please contact our customer service team. We're committed to your satisfaction!" 
      };
    }
    
    if (message.includes('stock') || message.includes('available') || message.includes('in stock') || message.includes('availability') || message.includes('mayroon') || message.includes('may')) {
      return { 
        text: isTagalogMessage 
          ? "Karamihan ng aming mga produkto ay available! Ang availability ay makikita sa bawat product page. Kung kailangan ninyo ng specific item urgently, makipag-ugnayan sa amin at iche-check namin ang aming inventory para sa inyo."
          : "Most of our products are in stock! The availability is shown on each product page. If you need a specific item urgently, feel free to contact us directly and we'll check our inventory for you." 
      };
    }
    
    if (message.includes('color') || message.includes('colors') || message.includes('finish') || message.includes('paint') || message.includes('kulay')) {
      return { 
        text: isTagalogMessage 
          ? "Ang aming mga produkto ay may iba't ibang kulay at finishes para tumugma sa inyong style! Makikita ninyo ang available options sa product page. Kung kailangan ninyo ng custom color, maaari nating pag-usapan ang special orders."
          : "Our products come in various colors and finishes to match your style! You can see the available options on the product page. If you need a custom color, we can discuss special orders." 
      };
    }
    
    if (message.includes('size') || message.includes('dimension') || message.includes('measurement') || message.includes('specification') || message.includes('laki') || message.includes('sukat')) {
      return { 
        text: isTagalogMessage 
          ? "Ang product dimensions at specifications ay nakalista sa bawat product page. Kung kailangan ninyo ng specific measurements o may space constraints, matutulungan ko kayong makahanap ng perfect fit para sa inyong space."
          : "Product dimensions and specifications are listed on each product page. If you need specific measurements or have space constraints, I can help you find the perfect fit for your space." 
      };
    }
    
    if (message.includes('quality') || message.includes('material') || message.includes('durable') || message.includes('long lasting') || message.includes('kalidad') || message.includes('materyal') || message.includes('matibay')) {
      return { 
        text: isTagalogMessage 
          ? "Kilala ang IZAJ Lighting sa high-quality materials at craftsmanship. Gumagamit kami ng premium materials at sumusunod sa strict quality standards. Ang aming mga produkto ay dinisenyo para tumagal at mapaganda ang inyong space."
          : "IZAJ Lighting is known for high-quality materials and craftsmanship. We use premium materials and follow strict quality standards. Our products are designed to last and enhance your space beautifully." 
      };
    }
    
    if (message.includes('payment') || message.includes('pay') || message.includes('gcash') || message.includes('credit card') || message.includes('maya') || message.includes('paypal') || message.includes('bayad')) {
      return { 
        text: isTagalogMessage 
          ? "Tumatanggap kami ng iba't ibang payment methods kabilang ang GCash, Maya, PayPal, at credit cards. Makikita ninyo ang lahat ng aming payment options sa checkout. Nag-ooffer din kami ng flexible payment terms para sa mas malalaking orders."
          : "We accept various payment methods including GCash, Maya, PayPal, and credit cards. You can see all our payment options at checkout. We also offer flexible payment terms for larger orders." 
      };
    }
    
    if (message.includes('pickup') || message.includes('pick up') || message.includes('store pickup')) {
      return { 
        text: isTagalogMessage 
          ? "Oo! Available ang store pickup sa aming location: 173 1, San Pablo City, 4000 Laguna, Philippines. Karaniwang handa ang items sa loob ng 2-4 days. Makikita ninyo ang pickup availability sa bawat product page."
          : "Yes! Store pickup is available at our location: 173 1, San Pablo City, 4000 Laguna, Philippines. Items are usually ready in 2-4 days. You can see pickup availability on each product page." 
      };
    }
    
    if (message.includes('bulk') || message.includes('wholesale') || message.includes('quantity') || message.includes('many') || message.includes('marami')) {
      return { 
        text: isTagalogMessage 
          ? "Nag-ooffer kami ng special pricing para sa bulk orders at wholesale purchases! Makipag-ugnayan sa amin para sa custom quotes sa large quantity orders. Masaya kaming makipagtrabaho sa contractors, designers, at businesses."
          : "We offer special pricing for bulk orders and wholesale purchases! Contact us directly for custom quotes on large quantity orders. We're happy to work with contractors, designers, and businesses." 
      };
    }
    
    if (message.includes('custom') || message.includes('special order') || message.includes('personalize')) {
      return { 
        text: isTagalogMessage 
          ? "Maaari naming i-accommodate ang custom orders at special requests! Kung kailangan ninyo ng specific colors, sizes, o modifications, maaaring makipagtrabaho ang aming team sa inyo. Makipag-ugnayan sa amin para pag-usapan ang inyong custom requirements."
          : "We can accommodate custom orders and special requests! Whether you need specific colors, sizes, or modifications, our team can work with you. Contact us to discuss your custom requirements." 
      };
    }
    
    if (message.includes('hours') || message.includes('open') || message.includes('business hours') || message.includes('time') || message.includes('oras') || message.includes('orasan')) {
      return { 
        text: isTagalogMessage 
          ? "Ang aming business hours ay: Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 5:00 PM, Sunday: 10:00 AM - 4:00 PM. Nandito kami para magserbisyo sa inyo!"
          : "Our business hours are: Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 5:00 PM, Sunday: 10:00 AM - 4:00 PM. We're here to serve you!" 
      };
    }
    
    if (message.includes('catalog') || message.includes('products') || message.includes('items') || message.includes('collection') || message.includes('produkto') || message.includes('gamit') || message.includes('koleksyon')) {
      return { 
        text: isTagalogMessage 
          ? "Mayroon kaming malawak na hanay ng lighting products kabilang ang chandeliers, pendant lights, wall sconces, table lamps, at marami pa! I-browse ang aming website para makita ang aming full collection. May specific type ba ng lighting na hinahanap ninyo?"
          : "We have a wide range of lighting products including chandeliers, pendant lights, wall sconces, table lamps, and more! Browse our website to see our full collection. Is there a specific type of lighting you're looking for?" 
      };
    }
    
    if (message.includes('led') || message.includes('energy') || message.includes('efficient') || message.includes('wattage') || message.includes('enerhiya') || message.includes('mahusay')) {
      return { 
        text: isTagalogMessage 
          ? "Marami sa aming mga produkto ay may energy-efficient LED technology! Ang LED lights ay long-lasting, energy-saving, at environmentally friendly. Tingnan ang product specifications para sa energy ratings at wattage information."
          : "Many of our products feature energy-efficient LED technology! LED lights are long-lasting, energy-saving, and environmentally friendly. Check product specifications for energy ratings and wattage information." 
      };
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon') || message.includes('good evening') || message.includes('kumusta')) {
      return { 
        text: isTagalogMessage 
          ? "Kumusta! Welcome sa IZAJ Lighting! Nandito ako para tumulong sa inyo na makahanap ng perfect lighting solutions para sa inyong space. Ano ang matutulungan ko sa inyo ngayon?"
          : "Hello! Welcome to IZAJ Lighting! I'm here to help you find the perfect lighting solutions for your space. What can I assist you with today?" 
      };
    }
    
    if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate') || message.includes('salamat')) {
      return { 
        text: isTagalogMessage 
          ? "Walang anuman! Masaya akong makatulong. May iba pa ba kayong gustong malaman tungkol sa aming mga produkto o serbisyo?"
          : "You're very welcome! I'm happy to help. Is there anything else you'd like to know about our products or services?" 
      };
    }
    
    if (message.includes('help') || message.includes('support') || message.includes('assist') || message.includes('tulong')) {
      return { 
        text: isTagalogMessage 
          ? "Nandito ako para tumulong! Maaari kong tulungan kayo sa product information, pricing, delivery, installation, payment methods, at marami pa. Ano ang specific information na kailangan ninyo?"
          : "I'm here to help! I can assist you with product information, pricing, delivery, installation, payment methods, and more. What specific information do you need?" 
      };
    }
    
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you') || message.includes('paalam')) {
      return { 
        text: isTagalogMessage 
          ? "Salamat sa pakikipag-chat sa IZAJ Lighting! Kung may iba pa kayong tanong, huwag mag-atubiling magtanong anumang oras. Magandang araw!"
          : "Thank you for chatting with IZAJ Lighting! If you have more questions, feel free to ask anytime. Have a great day!" 
      };
    }
    
    if (message.includes('order') || message.includes('purchase') || message.includes('buy') || message.includes('checkout')) {
      return { 
        text: isTagalogMessage 
          ? "Magaling! Maaari ninyong i-add ang items sa inyong cart at mag-proceed sa checkout. Kung kailangan ninyo ng assistance sa inyong order o may tanong tungkol sa checkout process, nandito ako para tumulong!"
          : "Great! You can add items to your cart and proceed to checkout. If you need assistance with your order or have questions about the checkout process, I'm here to help!" 
      };
    }
    
    if (message.includes('track') || message.includes('tracking') || message.includes('status') || message.includes('where is') || message.includes('sundan')) {
      return { 
        text: isTagalogMessage 
          ? "Para sa order tracking at status updates, pakikontak kami nang direkta gamit ang inyong order number. Bibigyan namin kayo ng latest information tungkol sa progress ng inyong order."
          : "For order tracking and status updates, please contact us directly with your order number. We'll provide you with the latest information about your order's progress." 
      };
    }
    
    // Default responses for general questions
    const defaultResponses = isTagalogMessage ? [
      "Magandang tanong yan! Masaya akong tumulong sa inyo. Maaari ba kayong magbigay ng kaunting detalye para mabigyan ko kayo ng pinaka-tumpak na impormasyon?",
      "Naiintindihan ko na naghahanap kayo ng impormasyon tungkol diyan. Hayaan ninyong tulungan ko kayong makahanap ng pinakamahusay na sagot. Ano ang specific aspect na gusto ninyong malaman pa?",
      "Salamat sa pagtatanong! Nandito ako para bigyan kayo ng lahat ng detalye na kailangan ninyo. Maaari ba ninyong linawin kung ano ang specific information na hinahanap ninyo?",
      "Gusto kong tumulong sa inyo! Ang aming team sa IZAJ Lighting ay committed sa pagbibigay ng excellent service. Ano pa ang gusto ninyong malaman?",
      "Mahalagang tanong yan! Maaari ko talagang tulungan kayo diyan. Para sa pinakadetailed na impormasyon, maaari ba ninyong sabihin sa akin kung ano ang specific details na kailangan ninyo?"
    ] : [
      "That's a great question! I'd be happy to help you with that. Could you provide a bit more detail so I can give you the most accurate information?",
      "I understand you're looking for information about that. Let me help you find the best answer. What specific aspect would you like to know more about?",
      "Thanks for asking! I'm here to provide you with all the details you need. Could you clarify what specific information you're looking for?",
      "I'd love to help you with that! Our team at IZAJ Lighting is committed to providing excellent service. What would you like to know more about?",
      "That's an important question! I can definitely help you with that. For the most detailed information, could you let me know what specific details you need?"
    ];
    
    return { text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)] };
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    // Don't allow sending messages if language is not selected yet
    if (preferredLanguage === null) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Generate intelligent response
    setTimeout(() => {
      const botResponse = generateBotResponse(userInput);
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse.text,
        sender: 'izaj',
        timestamp: new Date(),
        isContactInfo: botResponse.showContactInfo
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800); // Random delay between 1.2-2 seconds for more natural feel
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Icon icon="mdi:chat" className="text-white text-sm" />
            </div>
            <h3 className="font-semibold text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>IZAJ Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
          >
            <Icon icon="mdi:close" width={18} height={18} />
          </button>
        </div>
        <p className="text-xs text-white/80" style={{ fontFamily: 'Jost, sans-serif' }}>🤖 Ask me anything about our products and services!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-black to-gray-800 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
              }`}
            >
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>{msg.text}</p>
              {msg.showLanguageSelection && (
                <div className="mt-3">
                  <LanguageSelection />
                </div>
              )}
              {msg.isContactInfo && (
                <div className="mt-3">
                  <ContactInfoMessage />
                </div>
              )}
              <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`} style={{ fontFamily: 'Jost, sans-serif' }}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white text-gray-800 rounded-bl-md border border-gray-100 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-gray-400 ml-2" style={{ fontFamily: 'Jost, sans-serif' }}>IZAJ is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white shadow-lg">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={preferredLanguage === null ? "Please select a language first..." : "Type your message..."}
              disabled={preferredLanguage === null}
              className="w-full px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Jost, sans-serif' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping || preferredLanguage === null}
            className="px-4 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-full hover:from-gray-800 hover:to-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            <Icon icon="mdi:send" width={18} height={18} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CompactChat;

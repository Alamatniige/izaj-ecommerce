import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface CompactChatProps {
  onClose?: () => void;
  productName?: string;
}

const CompactChat: React.FC<CompactChatProps> = ({ onClose, productName }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: `Hi! I'm your IZAJ Assistant. How can I help you with ${productName || 'our products'} today?`, sender: 'izaj', timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Chatbot intelligence function
  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Product information responses
    if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      return "Our products are competitively priced! You can see the current price displayed on the product page. We also offer special discounts and monthly deals. Would you like to know about our current promotions?";
    }
    
    if (message.includes('discount') || message.includes('sale') || message.includes('promotion')) {
      return "Great news! We have ongoing monthly deals and special promotions. Check out our 'SALES' section for current discounts. You can also contact us directly for bulk order discounts!";
    }
    
    if (message.includes('delivery') || message.includes('shipping') || message.includes('deliver')) {
      return "We offer delivery within 10-14 working days for store pickup, 10-14 days for Metro Manila, and 14 days for Provincial areas. Professional installation is also available upon request!";
    }
    
    if (message.includes('install') || message.includes('installation') || message.includes('setup')) {
      return "Yes! We provide professional installation services for all our lighting products. Our experienced technicians will ensure proper setup and safety. Contact us to schedule an installation appointment.";
    }
    
    if (message.includes('warranty') || message.includes('guarantee') || message.includes('return')) {
      return "We stand behind our products with comprehensive warranty coverage. For specific warranty details and return policies, please contact our customer service team. We're committed to your satisfaction!";
    }
    
    if (message.includes('stock') || message.includes('available') || message.includes('in stock')) {
      return "Most of our products are in stock! The availability is shown on each product page. If you need a specific item urgently, feel free to contact us directly and we'll check our inventory for you.";
    }
    
    if (message.includes('color') || message.includes('colors') || message.includes('finish')) {
      return "Our products come in various colors and finishes to match your style! You can see the available options on the product page. If you need a custom color, we can discuss special orders.";
    }
    
    if (message.includes('size') || message.includes('dimension') || message.includes('measurement')) {
      return "Product dimensions and specifications are listed on each product page. If you need specific measurements or have space constraints, I can help you find the perfect fit for your space.";
    }
    
    if (message.includes('quality') || message.includes('material') || message.includes('durable')) {
      return "IZAJ Lighting is known for high-quality materials and craftsmanship. We use premium materials and follow strict quality standards. Our products are designed to last and enhance your space beautifully.";
    }
    
    if (message.includes('payment') || message.includes('pay') || message.includes('gcash') || message.includes('credit card')) {
      return "We accept various payment methods including GCash, Maya, PayPal, and credit cards. You can see all our payment options at checkout. We also offer flexible payment terms for larger orders.";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to IZAJ Lighting! I'm here to help you find the perfect lighting solutions for your space. What can I assist you with today?";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! I'm happy to help. Is there anything else you'd like to know about our products or services?";
    }
    
    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! I can assist you with product information, pricing, delivery, installation, and more. What specific information do you need?";
    }
    
    // Default responses for general questions
    const defaultResponses = [
      "That's a great question! I'd be happy to help you with that. Could you provide a bit more detail so I can give you the most accurate information?",
      "I understand you're looking for information about that. Let me help you find the best answer. What specific aspect would you like to know more about?",
      "Thanks for asking! I'm here to provide you with all the details you need. Could you clarify what specific information you're looking for?",
      "I'd love to help you with that! Our team at IZAJ Lighting is committed to providing excellent service. What would you like to know more about?",
      "That's an important question! I can definitely help you with that. For the most detailed information, could you let me know what specific details you need?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Generate intelligent response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: botResponse,
          sender: 'izaj' as const,
          timestamp: new Date()
        }
      ]);
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
            <h3 className="font-semibold text-sm">Chat with us</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
          >
            <Icon icon="mdi:close" width={18} height={18} />
          </button>
        </div>
        <p className="text-xs text-white/80">👋 Hi, message us with any questions. We're happy to help!</p>
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
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
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
                <span className="text-xs text-gray-400 ml-2">IZAJ is typing...</span>
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
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-gray-50 focus:bg-white"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
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

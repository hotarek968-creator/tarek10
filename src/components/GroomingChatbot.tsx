import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, PhoneCall, Check, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Theme } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface GroomingChatbotProps {
  language: Language;
  theme: Theme;
  onAddToCartDirectly: (productId: string) => void;
  phoneNumber: string;
}

export default function GroomingChatbot({ language, theme, onAddToCartDirectly, phoneNumber }: GroomingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: language === 'bn' 
        ? 'আসসালামু আলাইকুম! Men\'s Grooming BD-তে আপনাকে স্বাগতম। দাড়ি গজানো, চুল পড়া বন্ধ করা বা পণ্য সংক্রান্ত যেকোনো তথ্য জানতে আমি আপনাকে সাহায্য করতে পারি। আপনার কি জিজ্ঞাসা আছে?' 
        : 'Assalamu Alaikum! Welcome to Men\'s Grooming BD. I can assist you with beard regrowth, hair fall solutions, or query any of our products. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = language === 'bn' 
    ? [
        { text: 'ব্যবহারের সঠিক নিয়ম কী?', prompt: 'মিনোক্সিডিল এবং ডার্মারোলার ব্যবহারের সঠিক নিয়ম কী?' },
        { text: 'কম্বো পার্টটার দাম কত?', prompt: 'কম্বো কিটের দাম কত এবং কি কি থাকছে?' },
        { text: 'মিনোক্সিডিল কি সত্যিই কাজ করে?', prompt: 'কিরকল্যান্ড মিনোক্সিডিল কার্যকরী হবার বৈজ্ঞানিক কারণ কি?' },
        { text: 'ডেলিভারি দিতে কতদিন লাগবে?', prompt: 'ডেলিভারি ফি কত এবং ডেলিভারি হতে কত সময় লাগে?' }
      ]
    : [
        { text: 'How to use Minoxidil?', prompt: 'What is the correct way to use Minoxidil and Dermaroller?' },
        { text: 'Combo Pack Price?', prompt: 'What is the price of the combo pack and what does it include?' },
        { text: 'Does Minoxidil work?', prompt: 'Is Kirkland Minoxidil scientifically proven to regrow beard/hair?' },
        { text: 'Delivery cost and time?', prompt: 'What is the shipping cost and delivery duration across Bangladesh?' }
      ];

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6), // Keep context lightweight
        })
      });

      if (!response.ok) {
        throw new Error('API server error');
      }

      const data = await response.json();
      const botResponse: Message = {
        id: Math.random().toString(),
        sender: 'bot',
        text: data.text,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: Math.random().toString(),
        sender: 'bot',
        text: language === 'bn'
          ? 'দুঃখিত, এই মুহূর্তে সার্ভার সংযোগে সামান্য সমস্যা হচ্ছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন অথবা সরাসরি আমাদের ফোন করুন: ' + phoneNumber
          : 'Sorry, we are experiencing connection issues right now. Please try again soon or call us directly at: ' + phoneNumber,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="grooming-chatbot-container" className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="chatbot-trigger-btn"
            key="trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={`flex items-center gap-2 px-5 py-4 ${theme === 'dark' ? 'bg-geo-amber text-geo-black hover:bg-geo-amber-hover border border-geo-amber/20' : 'bg-slate-900 text-white'} rounded-lg shadow-2xl transition-all focus:outline-none cursor-pointer`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-bold tracking-wider uppercase text-xs">
              {language === 'bn' ? 'কনসালটেন্ট চ্যাট' : 'AI Grooming Assistant'}
            </span>
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            id="chatbot-window-box"
            key="chatbox"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`w-96 max-w-[calc(100vw-2rem)] h-[550px] rounded-xl shadow-2xl flex flex-col overflow-hidden border ${
              theme === 'dark' 
                ? 'bg-geo-dark border-geo-border text-white' 
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Header */}
            <div className={`p-4 ${theme === 'dark' ? 'bg-geo-black border-b border-geo-border text-slate-100' : 'bg-slate-900 text-white'} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-geo-amber/10 border-geo-amber/20' : 'bg-white/10'} rounded-lg flex items-center justify-center border`}>
                  <Sparkles className="w-5 h-5 text-geo-amber animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight font-display text-slate-100">
                    {language === 'bn' ? 'Grooming Expert AI' : 'Grooming Advisor AI'}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-geo-amber rounded-full animate-pulse" />
                    <span className="text-[10px] text-geo-amber font-mono tracking-wider uppercase font-bold">
                      {language === 'bn' ? 'অনলাইন' : 'ONLINE'}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                id="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className={`px-4 py-2 ${theme === 'dark' ? 'bg-geo-black/40 border-b border-geo-border' : 'bg-slate-50 border-b border-slate-100'} flex gap-2 overflow-x-auto scrollbar-none text-xs`}>
              <a href={`tel:${phoneNumber}`} className={`flex items-center gap-1 shrink-0 ${theme === 'dark' ? 'bg-geo-amber/10 text-geo-amber border-geo-amber/20' : 'bg-slate-100 text-slate-800'} px-2.5 py-1 rounded font-medium border`}>
                <PhoneCall className="w-3.5 h-3.5" />
                {phoneNumber}
              </a>
              <button 
                id="chatbot-quick-combo-btn"
                onClick={() => onAddToCartDirectly('combo-1')}
                className={`flex items-center gap-1 shrink-0 ${theme === 'dark' ? 'bg-geo-amber text-geo-black' : 'bg-yellow-400 text-slate-900'} px-2.5 py-1 rounded font-bold cursor-pointer`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {language === 'bn' ? 'কম্বো কিনুন' : 'Buy Combo'}
              </button>
            </div>

            {/* Message Area */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${theme === 'dark' ? 'bg-geo-black/30' : 'bg-slate-50/50'}`}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? (theme === 'dark' ? 'bg-geo-amber text-geo-black font-bold rounded-tr-none' : 'bg-slate-900 text-white rounded-tr-none')
                        : theme === 'dark'
                          ? 'bg-geo-card text-slate-100 rounded-tl-none border border-geo-border/50'
                          : 'bg-white text-slate-800 rounded-tl-none border border-slate-205 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1.5 ${
                        msg.sender === 'user' ? (theme === 'dark' ? 'text-geo-black/70' : 'text-slate-300') : 'text-slate-400 dark:text-slate-500'
                      } text-right font-mono`}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className={`rounded-lg px-4 py-3 rounded-tl-none flex items-center gap-1.5 ${
                    theme === 'dark' ? 'bg-geo-card text-slate-400 border border-geo-border/50' : 'bg-white text-slate-500 border border-slate-200'
                  }`}>
                    <span className="w-2 h-2 bg-geo-amber rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-geo-amber rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-geo-amber rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions overlay */}
            <div className={`p-3 border-t ${theme === 'dark' ? 'bg-geo-black border-geo-border' : 'bg-slate-50 border-slate-200'}`}>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display font-bold mb-2 px-1">
                {language === 'bn' ? 'সচরাচর জিজ্ঞাসা' : 'SUGGESTED TOPICS'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickSuggestions.map((item, idx) => (
                  <button
                    id={`chatbot-suggestion-${idx}`}
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    className={`text-left text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'border-geo-border hover:border-geo-amber bg-geo-card text-slate-300 hover:text-white'
                        : 'border-slate-200 hover:border-amber-500 bg-white text-slate-600 hover:text-amber-700 hover:bg-amber-50/20'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Form */}
            <form
              id="chatbot-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className={`p-3 border-t ${theme === 'dark' ? 'bg-geo-dark border-geo-border' : 'bg-white border-slate-200'} flex gap-2 items-center`}
            >
              <input
                id="chatbot-msg-input"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  language === 'bn' 
                    ? 'আপনার প্রশ্নটি এখানে লিখুন...' 
                    : 'Type your message...'
                }
                disabled={isLoading}
                className={`flex-1 text-sm rounded-lg px-4 py-2.5 outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-geo-black border border-geo-border text-white focus:border-geo-amber'
                    : 'bg-slate-100 border border-slate-200 text-slate-800 focus:border-amber-500 focus:bg-white'
                }`}
              />
              <button
                id="chatbot-send-btn"
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className={`p-2.5 ${theme === 'dark' ? 'bg-geo-amber hover:bg-geo-amber-hover text-geo-black' : 'bg-slate-900 hover:bg-slate-850 text-white'} rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none cursor-pointer`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

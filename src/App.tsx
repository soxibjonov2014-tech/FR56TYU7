/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, Trash2, Cpu, Zap } from 'lucide-react';
import { sendMessage } from './services/geminiService';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Assalomu alaykum! Men Jang-Kong AI yordamchingizman. Sizga qanday yordam bera olaman? Agar rasm kerak bo'lsa, bemalol so'rashingiz mumkin!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMessage].map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));
      
      const response = await sendMessage(history);
      
      if (response) {
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Kechirasiz, xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Assalomu alaykum! Men Jang-Kong AI yordamchingizman. Sizga qanday yordam bera olaman?"
      }
    ]);
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto px-4 sm:px-8">
      {/* Header */}
      <header className="py-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight uppercase">JANG-KONG AI</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={clearChat}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"
          title="Tozalash"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto py-8 scrollbar-hide">
        <div className="space-y-8 max-w-4xl mx-auto w-full">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                  message.role === 'assistant' 
                    ? 'bg-zinc-800' 
                    : 'bg-brand-orange/10 border border-brand-orange/20 text-brand-orange'
                }`}>
                  {message.role === 'assistant' ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                
                <div className={`flex flex-col max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-4 rounded-2xl text-[15.5px] leading-relaxed shadow-sm ${
                    message.role === 'assistant' 
                      ? 'bg-zinc-900 border border-white/5 text-zinc-200' 
                      : 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                  }`}>
                    <div className="markdown-content">
                      <Markdown
                        components={{
                          img: ({ node, ...props }) => (
                            <img 
                              {...props} 
                              className="rounded-lg my-3 max-w-full h-auto border border-white/10" 
                              referrerPolicy="no-referrer"
                            />
                          ),
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                        }}
                      >
                        {message.content}
                      </Markdown>
                    </div>
                  </div>
                  <span className="mt-1.5 text-[10px] text-zinc-600 font-mono">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-zinc-900 border border-white/5 px-5 py-4 rounded-2xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Footer / Input */}
      <footer className="py-8 border-t border-white/5">
        <div className="relative group max-w-4xl mx-auto w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange to-orange-500 rounded-2xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-md"></div>
          <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2x overflow-hidden focus-within:border-brand-orange/50 transition-all shadow-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Jang-Kong AI dan xohlagan narsangizni so'rang..."
              className="flex-1 bg-transparent px-6 py-5 outline-none text-[16px] placeholder:text-zinc-600"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`mr-3 p-3 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !isLoading
                  ? 'bg-brand-orange text-white hover:scale-105 active:scale-95 shadow-lg shadow-brand-orange/30'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="mt-5 text-center text-[11px] text-zinc-600 font-mono tracking-tight flex items-center justify-center gap-6">
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> ULTRA FAST</span>
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> GEMINI 3 FLASH</span>
          <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> JANG-KONG CORE</span>
        </p>
      </footer>
    </div>
  );
}

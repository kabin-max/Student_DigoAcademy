'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am the Digo Academy AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let botReply = 'Thank you for your message. An advisor will get back to you shortly.';
      
      const lowerInput = userMessage.toLowerCase();
      if (lowerInput.includes('course') || lowerInput.includes('learn')) {
        botReply = 'We offer a variety of courses including AWS Cloud, AI, and DevOps. Check out our Courses page!';
      } else if (lowerInput.includes('price') || lowerInput.includes('fee') || lowerInput.includes('cost')) {
        botReply = 'Our course fees vary depending on the track. Please submit an enrollment request to get detailed pricing.';
      } else if (lowerInput.includes('contact') || lowerInput.includes('support')) {
        botReply = 'You can reach us at support@digoacademy.com or via WhatsApp at +977 980-182-0900.';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-brand-blue text-white shadow-lg transition-transform hover:scale-110",
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        )}
        aria-label="Open AI Chatbot"
      >
        <MessageCircle className="size-6" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-[450px] w-[350px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl transition-all duration-300 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-brand-blue px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Bot className="size-5" />
            <span className="font-semibold text-sm">Digo AI Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 transition-colors hover:bg-white/20"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex w-max max-w-[80%] flex-col rounded-xl px-4 py-2 text-sm shadow-sm",
                msg.sender === 'user' 
                  ? "ml-auto bg-brand-blue text-white rounded-br-none" 
                  : "bg-card text-foreground border border-border/50 rounded-bl-none"
              )}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border/60 bg-card p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-border/70 bg-background px-4 py-2 text-sm text-foreground focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white transition-colors hover:bg-brand-blue/90 disabled:opacity-50"
          >
            <Send className="size-4 ml-0.5" />
          </button>
        </form>
      </div>
    </>
  );
}

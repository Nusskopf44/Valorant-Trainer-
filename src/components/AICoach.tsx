import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2, Sparkles, MessageSquare, Trash2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Greetings, Agent. I am your Tactical AI Coach. How can I assist your training today? I can analyze agent strategies, map callouts, or weapon recoil patterns." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are a professional Valorant coach. Provide tactical advice, agent tips, and map strategies. Keep responses concise and professional. User asks: ${userMessage}` }]
          }
        ],
        config: {
          systemInstruction: "You are a professional Valorant coach. Use game terminology like 'default', 'retake', 'eco', 'entry fragging'. Be encouraging but direct."
        }
      });

      const aiText = response.text || "I apologize, I'm having trouble connecting to the tactical network.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Tactical communication error. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto mica-effect rounded-2xl overflow-hidden shadow-2xl border border-white/5">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-valorant-red/10 rounded-xl">
            <Bot className="w-6 h-6 text-valorant-red" />
          </div>
          <div>
            <h2 className="text-xl font-display">Tactical AI Coach</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">Neural Link Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'assistant', content: "Tactical log cleared. How can I help?" }])}
          className="win-button p-2 text-white/40 hover:text-valorant-red"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-valorant-blue/20" : "bg-valorant-red/20"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-valorant-blue" /> : <Bot className="w-4 h-4 text-valorant-red" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-valorant-blue/10 text-white rounded-tr-none border border-valorant-blue/20" 
                : "bg-white/5 text-white/90 rounded-tl-none border border-white/10"
            )}>
              <div className="markdown-body prose prose-invert prose-sm max-w-none">
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-4 mr-auto animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-valorant-red/20 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-valorant-red animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs opacity-40">
              Analyzing tactical data...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-black/20 border-t border-white/5">
        <div className="relative flex items-center gap-3">
          <div className="flex-1 relative group">
            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:opacity-100 transition-opacity" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about strategies, maps, or agents..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-valorant-red/50 transition-all"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="win-button-primary p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['Ascent B Retake', 'Vandal Recoil', 'Jett Entry Tips', 'Economy Guide'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="win-button text-[10px] uppercase font-bold whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 text-valorant-red" />
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

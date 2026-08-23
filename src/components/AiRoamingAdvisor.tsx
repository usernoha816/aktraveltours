import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Smartphone, 
  Globe, 
  CheckCircle2, 
  HelpCircle, 
  Radio, 
  RefreshCw,
  User,
  X
} from 'lucide-react';
import { safeFetchJson } from '../utils/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AiRoamingAdvisorProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const AiRoamingAdvisor: React.FC<AiRoamingAdvisorProps> = ({ onClose, isModal = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `👋 **Welcome to AK TRAVELTOURS AI Concierge!**
I'm your 24/7 global connectivity specialist. Ask me anything about:
- Which eSIM is best for multi-country trips (e.g. Europe 35, Asia 18)
- Device compatibility & how to check your EID with \`*#06#\`
- How dual-SIM lets you keep your WhatsApp & banking 2FA active
- APN configuration and carrier troubleshooting abroad`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'Visiting Japan & South Korea for 14 days. What plan do you recommend?',
    'Will my WhatsApp number and banking SMS keep working?',
    'How do I setup APN on my iPhone?',
    'What is the difference between Europe 35 and a local France plan?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await safeFetchJson('/api/ai/roam-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok || !res.data) {
        throw new Error(res.error || `Advisor API returned status: ${res.status}`);
      }

      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: res.data.reply || 'Here is what I recommend for your journey.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'assistant',
          text: `For your travel route, we recommend grabbing a regional eSIM with high-speed 5G data. You can install the QR code immediately and it will activate automatically as soon as you connect to the local partner network.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full text-white ${isModal ? 'h-full flex flex-col' : 'max-w-4xl mx-auto px-4 sm:px-6 py-8'}`}>
      
      {/* Modal / Standalone Header */}
      {isModal ? (
        <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">AI Roaming Assistant</h3>
                <span className="text-[9px] bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-black px-1.5 py-0.2 rounded">
                  24/7 Live
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Multi-country plans &amp; eSIM installation help</p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.7 Flash Roaming Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            AI Travel eSIM &amp; Roaming Advisor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Instant itinerary analysis, plan recommendations, and roaming setup troubleshooting.
          </p>
        </div>
      )}

      {/* Chat Container */}
      <div className={`bg-slate-900 border border-slate-800 flex flex-col overflow-hidden ${
        isModal ? 'flex-1 rounded-none border-0' : 'rounded-2xl shadow-2xl h-[580px]'
      }`}>
        
        {/* Chat Messages */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0 mt-1 shadow-md shadow-emerald-500/20">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none prose prose-invert max-w-none'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-slate-900/70 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center font-bold shrink-0 mt-1 border border-slate-700">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Analyzing roaming networks &amp; travel routes...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-500 text-[11px] font-medium whitespace-nowrap">Suggested:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1 rounded-full border border-slate-700/80 whitespace-nowrap text-[11px] transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about destinations, multi-country roaming, dual-SIM..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition shadow-md shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

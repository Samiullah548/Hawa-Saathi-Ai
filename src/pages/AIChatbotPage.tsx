import React, { useState, useEffect, useRef } from 'react';
import { AirQualityCombinedData } from '../types/airQuality';
import { UserPreferences } from '../types/user';
import { ChatMessage } from '../types/ai';
import { sendAIChatMessage } from '../services/geminiClient';
import {
  getSavedChatHistory,
  saveChatHistory,
} from '../services/storage';
import {
  Sparkles,
  Send,
  Trash2,
  Bot,
  User,
  Copy,
  Check,
} from 'lucide-react';

interface AIChatbotPageProps {
  data: AirQualityCombinedData;
  preferences: UserPreferences;
}

const SUGGESTED_PROMPTS = [
  'Is it safe to exercise outside in Delhi right now?',
  'What is the difference between PM2.5 and PM10?',
  'How do I properly choose an H13 HEPA air purifier?',
  'Why do children face higher smog health risks?',
  'How does a temperature inversion trap winter smog?',
  'Do indoor houseplants really clean PM2.5?',
];

export const AIChatbotPage: React.FC<AIChatbotPageProps> = ({ data, preferences }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = getSavedChatHistory();
    if (saved.length > 0) return saved;
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        content: `### Namaste! I am HawaSaathi AI 🌿\n\nI am connected to live environmental sensors in **${data.location.name}** (Current US AQI: **${data.current.aqi}**, **${data.current.aqiCategory}**).\n\nYou can ask me about safe workout timings, N95 mask fitting, pediatric precautions, indoor HEPA filtration, or low-emission commute options.\n\n*How can I help protect you and your family today?*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cityContext: {
          cityName: data.location.name,
          aqi: data.current.aqi,
          category: data.current.aqiCategory,
        },
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (messageText: string) => {
    const text = messageText.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendAIChatMessage(
        text,
        {
          cityName: data.location.name,
          aqi: data.current.aqi,
        },
        preferences.customGeminiApiKey
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cityContext: {
          cityName: data.location.name,
          aqi: data.current.aqi,
          category: data.current.aqiCategory,
        },
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (err: unknown) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const reset: ChatMessage[] = [
      {
        id: Date.now().toString(),
        sender: 'assistant',
        content: `Conversation cleared. I am ready with fresh insights for **${data.location.name}** (AQI: ${data.current.aqi}). Ask me any air quality question!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(reset);
    saveChatHistory(reset);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 flex flex-col h-[calc(100vh-130px)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              HawaSaathi AI Chatbot
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase font-bold">
                Context-Aware
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Active Context: <strong className="text-slate-800">{data.location.name}</strong> • Live AQI: <strong className="text-slate-800">{data.current.aqi}</strong> ({data.current.aqiCategory})
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          title="Clear Conversation History"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-rose-600 transition text-xs font-semibold flex items-center space-x-1"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear History</span>
        </button>
      </div>

      {/* Chat Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                isAssistant ? 'justify-start' : 'justify-end flex-row-reverse space-x-reverse'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                  isAssistant ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                  isAssistant
                    ? 'bg-white border border-slate-200/90 shadow-xs text-slate-800'
                    : 'bg-emerald-700 text-white font-medium'
                }`}
              >
                {/* Content formatting with markdown-like rendering */}
                <div className="space-y-2 whitespace-pre-line">
                  {msg.content}
                </div>

                <div
                  className={`mt-2.5 pt-2 flex items-center justify-between text-[10px] border-t ${
                    isAssistant ? 'border-slate-100 text-slate-400' : 'border-emerald-600 text-emerald-200'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isAssistant && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="hover:text-slate-700 flex items-center space-x-1 transition"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs text-xs text-slate-500 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Analyzing air quality data & drafting response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex-shrink-0 pt-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1">
            Suggested:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-transparent text-slate-600 font-medium whitespace-nowrap transition text-xs flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="mt-2.5 flex items-center space-x-2 bg-white rounded-2xl border border-slate-200/90 p-1.5 shadow-xs focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask HawaSaathi AI about ${data.location.name}'s air quality, masks, or routines...`}
            className="flex-1 px-3 py-2 text-xs md:text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-400 text-center mt-2">
          HawaSaathi AI provides environmental protection advice based on CPCB and WHO guidelines, not formal medical diagnoses.
        </p>
      </div>
    </div>
  );
};


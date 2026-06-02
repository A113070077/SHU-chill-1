import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, MoreVertical, MapPin, Clock, Plus, Mic } from 'lucide-react';
import { FlashGroup, ChatMessage } from '../types';

interface ChatScreenProps {
  group: FlashGroup;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

export default function ChatScreen({
  group,
  messages,
  onSendMessage,
  onBack,
}: ChatScreenProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none">
      
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-5 max-w-md mx-auto shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95 text-slate-800"
          >
            <ArrowLeft className="w-5 h-5 text-[#006b5c]" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-[#006b5c] max-w-[200px] truncate">
              {group.title}
            </h1>
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#00bfa5] rounded-full"></span>
              {group.members.length + 1} 位成員在線
            </span>
          </div>
        </div>
        
        <button className="p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95 text-slate-700">
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Floating Info ribbon of location & time */}
      <div className="fixed top-16 left-0 right-0 z-40 px-5 py-2 select-none max-w-md mx-auto pointer-events-none">
        <div className="bg-emerald-50/85 backdrop-blur-md border border-emerald-100/50 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-[#006b5c]" />
            <span className="text-[10px] font-bold truncate max-w-[150px]">{group.location}</span>
          </div>
          <div className="h-4 w-[1px] bg-emerald-200/50"></div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-[#006b5c]" />
            <span className="text-[10px] font-bold">14:00 - 15:00</span>
          </div>
        </div>
      </div>

      {/* Chat scrollable container */}
      <main className="flex-grow pt-28 pb-24 overflow-y-auto px-5 space-y-4 max-w-md mx-auto w-full">
        {/* System Time label */}
        <div className="flex justify-center my-3 select-none">
          <span className="text-[10px] font-semibold text-slate-400 px-3 py-1 bg-white border border-slate-150 rounded-full shadow-sm">
            下午 1:45
          </span>
        </div>

        {/* Message bubble loop */}
        <div className="space-y-4">
          {messages.map((msg) => {
            if (msg.isMe) {
              return (
                <div key={msg.id} className="flex flex-col items-end gap-1.5 ml-auto max-w-[75%] animate-fade-in">
                  <div className="bg-[#00bfa5]/15 border border-[#00bfa5]/25 text-slate-800 px-4 py-3 rounded-2xl rounded-br-none shadow-sm">
                    <p className="text-xs leading-relaxed font-semibold">{msg.text}</p>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mr-1.5 flex items-center gap-1 select-none">
                    <span>{msg.timestamp}</span>
                    <span className="text-emerald-500 font-bold">· 已讀</span>
                  </span>
                </div>
              );
            } else {
              return (
                <div key={msg.id} className="flex items-start gap-2.5 max-w-[75%] animate-fade-in">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 border-2 border-white shadow-sm">
                    <img className="w-full h-full object-cover" src={msg.senderAvatar} alt={msg.sender} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 ml-1.5">{msg.sender}</span>
                    <div className="bg-white border border-slate-200/80 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                      <p className="text-xs leading-relaxed font-semibold text-slate-800">{msg.text}</p>
                    </div>
                    <span className="text-[8px] text-slate-400 ml-1.5 select-none">{msg.timestamp}</span>
                  </div>
                </div>
              );
            }
          })}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Persistent typing Input Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-slate-100 px-5 pt-3 pb-8 select-none max-w-md mx-auto">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <button 
            type="button" 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-[#006b5c] active:scale-90 transition-transform shadow-sm border border-slate-100"
          >
            <Plus className="w-4.5 h-4.5" />
          </button>
          
          <div className="flex-1 relative flex items-center">
            <input 
              type="text" 
              className="w-full bg-slate-50 border-none rounded-full py-3.5 pl-5 pr-11 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all placeholder:text-slate-400 font-semibold"
              placeholder="傳送訊息到本團..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            <button 
              type="submit"
              className="absolute right-1.5 w-8 h-8 flex items-center justify-center rounded-full bg-[#006b5c] text-white active:scale-90 transition-transform hover:bg-[#004d42]"
            >
              <Send className="w-3.5 h-3.5 fill-white text-[#006b5c]" />
            </button>
          </div>

          <button 
            type="button" 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-[#006b5c] active:scale-90 transition-transform shadow-sm border border-slate-100"
          >
            <Mic className="w-4.5 h-4.5" />
          </button>
        </form>
      </footer>
    </div>
  );
}

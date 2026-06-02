import { CheckCircle2, MessageSquare, MapPin, ArrowLeft } from 'lucide-react';
import { FlashGroup } from '../types';

interface GroupSuccessScreenProps {
  group: FlashGroup;
  onEnterChat: () => void;
  onViewMyGroups: () => void;
  onGoHome: () => void;
}

export default function GroupSuccessScreen({
  group,
  onEnterChat,
  onViewMyGroups,
  onGoHome,
}: GroupSuccessScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between pb-10 pt-16 font-sans select-none">
      <main className="px-5 max-w-md mx-auto w-full flex-grow flex flex-col justify-center">
        {/* Confetti-like success Banner */}
        <div className="flex flex-col items-center justify-center mb-8 animate-float">
          <div className="w-24 h-24 bg-[#00bfa5] text-white rounded-full flex items-center justify-center shadow-lg mb-4">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-[#006b5c] text-center">成功加入/發起 揪團！</h1>
          <p className="text-xs text-slate-500 font-medium text-center mt-2 leading-relaxed">
            準備好與新夥伴們一起 Chill、解決空堂流浪的問題了嗎？
          </p>
        </div>

        {/* Group Summary Card */}
        <div className="glass-card rounded-3xl p-6 mb-6 shadow-sm border-t border-l border-white/60">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-0.5">
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                {group.title}
              </h2>
              <div className="flex items-center text-slate-500 gap-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{group.location}</span>
              </div>
            </div>
            
            <span className="bg-[#e6f2f0] text-[#006b5c] px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100 uppercase">
              已備起
            </span>
          </div>

          {/* Members List inside card */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">目前團隊成員</span>
              <span className="text-[10px] text-slate-400 font-semibold">滿額成行</span>
            </div>
            
            <div className="flex -space-x-3 items-center">
              {group.members.map((member, i) => (
                <img 
                  key={i}
                  alt={member.name} 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                  src={member.avatarUrl} 
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#006b5c] bg-teal-50 flex items-center justify-center text-teal-700 font-black text-xs shadow-sm z-10">
                你
              </div>
            </div>
          </div>
        </div>

        {/* Map Location Tip layout */}
        <div className="glass-card rounded-2xl overflow-hidden mb-8 border border-white/50">
          <div className="bg-[#e6f2f0]/50 p-4 text-center">
            <p className="text-xs font-bold text-[#006b5c] flex items-center justify-center gap-1.5">
              💡 地理提示：3樓電梯出來左轉即達 (落地窗沙發旁邊)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            type="button"
            onClick={onEnterChat}
            className="w-full bg-[#006b5c] hover:bg-[#004d42] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/10 transition-all active:scale-95"
            id="enter-social-chat-cta"
          >
            <MessageSquare className="w-5 h-5 fill-white text-[#006b5c]" />
            進入本團即時聊天室
          </button>

          <button 
            type="button"
            onClick={onViewMyGroups}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs transition-all active:scale-95 border border-slate-200"
          >
            查看我的揪團
          </button>

          <button 
            type="button"
            onClick={onGoHome}
            className="w-full text-slate-500 hover:text-[#006b5c] py-2 text-xs font-semibold flex items-center justify-center gap-1 hover:underline active:scale-95 transition-all text-center"
          >
            <ArrowLeft className="w-4 h-4" />
            返回地圖首頁
          </button>
        </div>
      </main>
    </div>
  );
}

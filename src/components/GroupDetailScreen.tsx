import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, BookOpen, Users, Power, VolumeX, Wifi, Zap, User, Star } from 'lucide-react';
import { FlashGroup } from '../types';

interface GroupDetailScreenProps {
  group: FlashGroup;
  currentUserNickname: string;
  onBack: () => void;
  onJoin: (groupId: string) => void;
  onNavigateToChat: (groupId: string) => void;
}

export default function GroupDetailScreen({
  group,
  currentUserNickname,
  onBack,
  onJoin,
  onNavigateToChat,
}: GroupDetailScreenProps) {
  const [joined, setJoined] = useState<boolean>(false);
  const [joining, setJoining] = useState<boolean>(false);

  const handleJoinClick = () => {
    setJoining(true);
    setTimeout(() => {
      setJoining(false);
      setJoined(true);
      onJoin(group.id); // Triggers parent state updates
    }, 1200);
  };

  const isFull = group.currentParticipants >= group.maxParticipants;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32 font-sans">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-5 max-w-md mx-auto shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors active:scale-95 text-slate-800"
            id="back-from-group-detail"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-[#006b5c]">揪團詳情</h1>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 px-5 max-w-md mx-auto space-y-6">
        {/* Category Details Banner */}
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-[#006b5c] font-black text-[10px] uppercase border border-emerald-100 mb-3">
            <span className="mr-1.5">{group.categoryEmoji}</span>
            {group.category}
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            {group.title}
          </h2>
        </div>

        {/* Time & Location Glass Card card */}
        <div className="glass-card rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-[#006b5c]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">活動時間</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{group.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#006b5c]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">活動地點</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{group.location}</p>
              <p className="text-slate-400 text-xs mt-0.5">{group.buildingAddress}</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="glass-card rounded-xl p-5 shadow-sm border border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">活動介紹</h3>
          <p className="text-slate-600 text-xs leading-relaxed font-medium">
            {group.description}
          </p>
        </div>

        {/* Members Layout list */}
        <div className="glass-card rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase">
              成員組成 ({(joined ? group.currentParticipants + 1 : group.currentParticipants)}/{group.maxParticipants})
            </h3>
            
            <span className="text-xs font-bold text-[#00bfa5]">
              {isFull && !joined ? '已滿額' : `尚缺 ${group.maxParticipants - (joined ? group.currentParticipants + 1 : group.currentParticipants)} 人`}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Creator and Joined */}
            {group.members.map((member, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full border-2 border-[#00bfa5] overflow-hidden bg-slate-100 shadow-sm relative">
                  <img className="w-full h-full object-cover" src={member.avatarUrl} alt={member.name} />
                  {member.isCreator && (
                    <span className="absolute bottom-0 right-0 bg-[#006b5c] text-white p-0.5 rounded-full border border-white">
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-500">
                  {member.isCreator ? '發起人' : '已加入'}
                </span>
              </div>
            ))}

            {/* Current user avatar if joined */}
            {joined && (
              <div className="flex flex-col items-center gap-1 animate-ping-once">
                <div className="w-12 h-12 rounded-full border-2 border-[#00bfa5] overflow-hidden bg-teal-50 flex items-center justify-center font-bold text-teal-700 text-xs shadow-sm">
                  我
                </div>
                <span className="text-[10px] font-bold text-slate-500">已加入</span>
              </div>
            )}

            {/* Empty Spot placeholders */}
            {Array.from({ length: Math.max(0, group.maxParticipants - (group.members.length + (joined ? 1 : 0))) }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 opacity-50">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400">
                  <User className="w-5 h-5 stroke-1" />
                </div>
                <span className="text-[10px] font-medium text-slate-400">尚缺</span>
              </div>
            ))}
          </div>
        </div>

        {/* Space Facilities Tag */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 pl-1">場地設備</h3>
          <div className="flex flex-wrap gap-2">
            {group.facilityTags.map((tag) => (
              <div key={tag} className="flex items-center px-4 py-2 rounded-xl bg-white border border-slate-100 text-slate-700 font-bold text-xs shadow-sm">
                {tag.includes('插座') && <Power className="w-4 h-4 text-[#006b5c] mr-2" />}
                {tag.includes('安靜') && <VolumeX className="w-4 h-4 text-[#006b5c] mr-2" />}
                {tag.includes('WiFi') && <Wifi className="w-4 h-4 text-[#006b5c] mr-2" />}
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Direction Map Card layout */}
        {group.mapUrl && (
          <div className="glass-card rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <div className="p-4 pb-2">
              <h3 className="text-xs font-bold text-slate-500">地點指引</h3>
            </div>
            <div className="h-44 w-full relative group">
              <img className="w-full h-full object-cover opacity-90" src={group.mapUrl} alt="3D Map" />
              <div className="absolute inset-0 bg-[#006b5c]/5 pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 glass-card px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-emerald-100/50">
                <Clock className="w-3.5 h-3.5 text-[#006b5c]" />
                <span className="text-[11px] font-bold text-[#006b5c]">3 樓電梯出來左轉即達</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Actions footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gradient-to-t from-white via-white/95 to-transparent pt-3 pb-8 px-5 z-40 flex flex-col gap-3">
        {joined ? (
          <button 
            type="button"
            onClick={() => onNavigateToChat(group.id)}
            className="w-full h-14 bg-[#006b5c] hover:bg-[#004d42] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all active:scale-95"
            id="to-group-chat"
          >
            <Zap className="w-4 h-4 fill-white text-white" />
            進入本團即時聊天室
          </button>
        ) : (
          <button 
            type="button"
            disabled={isFull || joining}
            onClick={handleJoinClick}
            className={`w-full h-14 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isFull 
                ? 'bg-slate-200 border border-slate-300 text-slate-400 cursor-not-allowed'
                : 'bg-[#006b5c] hover:bg-[#004d42] text-white shadow-lg shadow-emerald-900/15'
            }`}
            id="join-group-submit"
          >
            {joining ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                正在處理加入...
              </>
            ) : (
              <>
                <Users className="w-4.5 h-4.5" />
                確認加入此空間快閃團
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

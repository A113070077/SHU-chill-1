import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Heart, MapPin, Power, Tv, MessageSquare, Wifi, VolumeX, Calendar, Clock, Sparkles, Users } from 'lucide-react';
import { Room } from '../types';

interface RoomDetailScreenProps {
  room: Room;
  allRooms: Room[];
  onBack: () => void;
  onBook: (room: Room, duration: number, timeSlot: string) => void;
  onCreateGroupForRoom: (room: Room) => void;
  onSwitchRoom: (room: Room) => void;
}

export default function RoomDetailScreen({
  room,
  allRooms,
  onBack,
  onBook,
  onCreateGroupForRoom,
  onSwitchRoom,
}: RoomDetailScreenProps) {
  const [duration, setDuration] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>('立即 14:00');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Find related spaces in the same building
  const buildingRooms = allRooms.filter(r => r.buildingKey === room.buildingKey);
  const availableFloors = Array.from(new Set(buildingRooms.map(r => r.floor))).sort();
  const roomsInFloor = buildingRooms.filter(r => r.floor === room.floor);

  // Handle floor switch: pre-select the first room on that floor
  const handleFloorSwitch = (floor: string) => {
    const spaceOnFloor = buildingRooms.find(r => r.floor === floor);
    if (spaceOnFloor) {
      onSwitchRoom(spaceOnFloor);
    }
  };

  const timeslots = [
    { label: '立即', time: '14:00', available: true },
    { label: '稍後', time: '15:00', available: true },
    { label: '稍後', time: '16:00', available: true },
    { label: '稍後', time: '17:00', available: true },
    { label: '額滿', time: '18:00', available: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-36 font-sans">
      {/* Custom Detail Header Overlay */}
      <header className="fixed top-0 left-0 right-0 z-40 px-5 py-4 flex items-center justify-between pointer-events-none max-w-md mx-auto">
        <button 
          onClick={onBack}
          className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md border border-white/20 shadow-sm text-slate-800 hover:bg-white transition-colors active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="pointer-events-auto flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md border border-white/20 shadow-sm px-4 py-2">
          <span className="text-xs font-bold text-[#006b5c]">{room.name}</span>
        </div>
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md border border-white/20 shadow-sm text-slate-800 hover:bg-white transition-colors active:scale-90"
        >
          <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-700'}`} />
        </button>
      </header>

      {/* Hero Image Section */}
      <section className="relative w-full h-[280px]">
        <img 
          alt={room.name} 
          className="w-full h-full object-cover"
          src={room.imageUrl} 
        />
        {/* Gradient overlay to ensure text/card readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-slate-50/50"></div>
      </section>

      {/* Bottom Sheet Content Area */}
      <main className="relative z-10 -mt-10 bg-white/80 backdrop-blur-xl rounded-t-3xl border-t border-white/40 shadow-[0_-10px_40px_rgba(0,107,92,0.08)] px-5 pt-6 pb-20">
        
        {/* Drag Handle Indicator */}
        <div className="mx-auto w-12 h-1 bg-slate-300 rounded-full mb-6"></div>

        {/* Title & Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{room.name}</h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {room.buildingAddress}
            </p>
          </div>
          
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            room.status === 'green' 
              ? 'bg-emerald-50 border border-emerald-100 text-emerald-600' 
              : 'bg-amber-50 border border-amber-100 text-amber-600'
          }`}>
            <span className={`w-2 h-2 rounded-full ${room.status === 'green' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            {room.status === 'green' ? '目前可用' : '尚有餘位'}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed bg-[#e6f2f0]/35 border border-emerald-100/30 p-3.5 rounded-2xl mb-6">
          {room.description}
        </p>

        {/* Location Selection Section */}
        <div className="space-y-4 mb-6">
          <h2 className="text-[13px] font-bold text-slate-800">選擇位置</h2>
          
          <div className="space-y-3">
            {/* Floor Selector */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-bold text-slate-400 w-10 shrink-0">樓層</span>
              <div className="flex gap-2">
                {availableFloors.map((fl) => (
                  <button 
                    key={fl}
                    onClick={() => handleFloorSwitch(fl)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                      room.floor === fl 
                        ? 'bg-[#006b5c] text-white border-transparent shadow-sm shadow-emerald-950/20' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {fl}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Selector */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-bold text-slate-400 w-10 shrink-0">空間</span>
              <div className="flex gap-2">
                {roomsInFloor.map((rm) => (
                  <button 
                    key={rm.id}
                    onClick={() => onSwitchRoom(rm)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                      room.id === rm.id 
                        ? 'bg-[#006b5c] text-white border-transparent shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {rm.name.split(' ').pop()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Amenity Chips */}
        <div className="space-y-3 mb-6">
          <h2 className="text-[13px] font-bold text-slate-800">空間設備</h2>
          <div className="flex flex-wrap gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${
              room.amenities.includes('插座') 
                ? 'bg-[#e6f2f0] border-emerald-100 text-[#006b5c]' 
                : 'bg-slate-100/50 border-slate-100 text-slate-400 line-through opacity-70'
            }`}>
              <Power className="w-3.5 h-3.5" />
              <span>插座</span>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${
              room.amenities.includes('大螢幕') 
                ? 'bg-[#e6f2f0] border-emerald-100 text-[#006b5c]' 
                : 'bg-slate-100/50 border-slate-100 text-slate-400 line-through opacity-70'
            }`}>
              <Tv className="w-3.5 h-3.5" />
              <span>大螢幕</span>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${
              room.amenities.includes('可交談') || room.amenities.includes('WiFi')
                ? 'bg-[#e6f2f0] border-emerald-100 text-[#006b5c]' 
                : 'bg-slate-100/50 border-slate-100 text-slate-400 line-through opacity-70'
            }`}>
              <MessageSquare className="w-3.5 h-3.5" />
              <span>可交談</span>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${
              room.amenities.includes('WiFi') 
                ? 'bg-[#e6f2f0] border-emerald-100 text-[#006b5c]' 
                : 'bg-slate-100/50 border-slate-100 text-slate-400 line-through opacity-70'
            }`}>
              <Wifi className="w-3.5 h-3.5" />
              <span>Wi-Fi</span>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${
              room.type === '靜音區'
                ? 'bg-[#e6f2f0] border-emerald-100 text-[#006b5c]' 
                : 'bg-slate-100/50 border-slate-100 text-slate-400 line-through opacity-70'
            }`}>
              <VolumeX className="w-3.5 h-3.5" />
              <span>極致安靜</span>
            </div>
          </div>
        </div>

        {/* Booking Duration & Timeslot selectors */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-[13px] font-bold text-slate-800">預約時長</h2>
            <span className="text-xs font-bold text-[#006b5c] px-3.5 py-1 bg-[#e6f2f0] rounded-full">
              今日 (10/24)
            </span>
          </div>

          {/* Duration Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((hr) => (
              <button 
                key={hr}
                onClick={() => setDuration(hr)}
                className={`py-3 rounded-xl border font-semibold text-xs text-center transition-all ${
                  duration === hr 
                    ? 'bg-[#006b5c] border-transparent text-white shadow-md shadow-emerald-950/10' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {hr} 小時
              </button>
            ))}
          </div>

          {/* Start Time Horizonal list */}
          <div className="space-y-2">
            <h2 className="text-[13px] font-bold text-slate-800">開始時間</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {timeslots.map((slot) => (
                <button 
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => slot.available && setStartTime(`${slot.label} ${slot.time}`)}
                  className={`flex-shrink-0 w-20 py-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    !slot.available 
                      ? 'bg-slate-100 border-slate-100 text-slate-400 opacity-60 cursor-not-allowed' 
                      : startTime.includes(slot.time)
                        ? 'bg-[#006b5c] border-transparent text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[10px] font-bold opacity-80">{slot.label}</span>
                  <span className="text-base font-bold">{slot.time}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky CTA Area */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pt-3 pb-8 bg-gradient-to-t from-white via-white/95 to-transparent z-40 max-w-md mx-auto flex flex-col gap-3">
        <button 
          onClick={() => onBook(room, duration, startTime.replace('立即 ', '').replace('稍後 ', ''))}
          className="w-full py-4 rounded-2xl bg-[#006b5c] hover:bg-[#004d42] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,107,92,0.3)] transition-all active:scale-[0.98]"
          id="confirm-booking-cta"
        >
          <Calendar className="w-5 h-5" />
          立即預約 空間 ({duration}小時)
        </button>

        <button 
          onClick={() => onCreateGroupForRoom(room)}
          className="w-full py-3 rounded-2xl border-2 border-[#006b5c] bg-white text-[#006b5c] font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-50/50 transition-all active:scale-[0.98]"
          id="create-group-from-room"
        >
          <Users className="w-4 h-4" />
          對此空間建立快閃揪團
        </button>
      </div>
    </div>
  );
}

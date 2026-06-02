import { Calendar, Clock, MapPin, Power, Tv, Wifi } from 'lucide-react';
import { Room } from '../types';

interface BookingSuccessScreenProps {
  room: Room;
  duration: number;
  timeSlot: string;
  seats: string;
  onViewMyBookings: () => void;
  onGoHome: () => void;
}

export default function BookingSuccessScreen({
  room,
  duration,
  timeSlot,
  seats,
  onViewMyBookings,
  onGoHome,
}: BookingSuccessScreenProps) {
  // Parse slot
  const startHour = parseInt(timeSlot.split(':')[0]);
  const endHour = startHour + duration;
  const computedSlot = `${timeSlot} - ${endHour.toString().padStart(2, '0')}:00`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between pb-10 pt-16 font-sans">
      <main className="px-5 max-w-md mx-auto w-full flex-grow flex flex-col justify-center">
        {/* Animated Checkmark header */}
        <section className="flex flex-col items-center text-center mb-8">
          <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500/10 rounded-full scale-150 animate-pulse"></div>
            
            {/* SVG Checkmark circle */}
            <svg className="w-24 h-24 relative z-10" viewBox="0 0 100 100">
              <circle 
                className="opacity-20" 
                cx="50" 
                cy="50" 
                fill="none" 
                r="44" 
                stroke="#00bfa5" 
                strokeWidth="8"
              />
              <path 
                className="stroke-[#006b5c]"
                d="M30 52 L45 67 L70 35" 
                fill="none" 
                strokeWidth="8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeDasharray="100"
                strokeDashoffset="0"
                style={{
                  transition: 'stroke-dashoffset 0.8s ease-in-out',
                }}
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-black text-[#006b5c] tracking-tight">預約成功！</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">我們已為您分配並保留了這個理想的空間。</p>
        </section>

        {/* Booking Details Card */}
        <div className="glass-card rounded-3xl p-6 mb-6 shadow-[0_10px_30px_rgba(0,107,92,0.05)] border-t border-l border-white/60">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">{room.name}</h3>
              <div className="flex items-center gap-1 mt-1 text-slate-500 text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{room.buildingAddress}</span>
              </div>
            </div>
            
            <span className="bg-[#e6f2f0] text-[#006b5c] text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100">
              已確認
            </span>
          </div>

          <hr className="border-slate-100 mb-4" />

          {/* Time & Seats Info */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">使用日期</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#006b5c]" />
                <p className="font-bold text-slate-700">今天 (10/24)</p>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">預約時段</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#006b5c]" />
                <p className="font-bold text-slate-700">{computedSlot}</p>
              </div>
            </div>
          </div>

          {/* Seat Tag */}
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl mb-4 flex justify-between items-center text-xs text-slate-600">
            <span className="font-medium">系統自動指派座位</span>
            <span className="font-bold text-[#006b5c] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              {seats}
            </span>
          </div>

          {/* Amenities details */}
          <div className="mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">空間隨附設備</p>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                  {amenity === '插座' && <Power className="w-3 h-3 text-[#006b5c]" />}
                  {amenity === '大螢幕' && <Tv className="w-3 h-3 text-[#006b5c]" />}
                  {amenity === 'WiFi' && <Wifi className="w-3 h-3 text-[#006b5c]" />}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code Segment */}
          <div className="flex flex-col items-center pt-4 border-t border-dashed border-slate-200">
            <div className="bg-white p-3.5 rounded-2xl shadow-sm mb-2 border border-slate-100">
              {/* Modern high-contrast digital QR Code placeholder */}
              <div className="w-28 h-28 bg-slate-900 rounded-xl p-2 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-white border-2"></div>
                  <div className="w-6 h-6 border-white border-2"></div>
                </div>
                {/* Tech scan lines */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400 animate-bounce"></div>
                <div className="flex-grow flex flex-wrap gap-1 p-1 items-center justify-center opacity-70">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 ${i % 3 === 0 || i % 5 === 0 ? 'bg-white' : 'bg-transparent'}`} 
                    />
                  ))}
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-white border-2"></div>
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping ml-auto"></div>
                </div>
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
              自動電子憑證 · 入場時請出示此 QR Code
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            type="button"
            onClick={onViewMyBookings}
            className="w-full bg-[#006b5c] hover:bg-[#004d42] text-white py-4 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            id="to-my-bookings-success"
          >
            查看我的預約管理
          </button>
          
          <button 
            type="button"
            onClick={onGoHome}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold text-xs transition-all active:scale-[0.98] border border-slate-200"
            id="back-to-home-success"
          >
            返回首頁
          </button>
        </div>
      </main>
    </div>
  );
}

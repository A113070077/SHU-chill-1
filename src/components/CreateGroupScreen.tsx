import React, { useState } from 'react';
import { ArrowLeft, Rocket, Plus, Minus, Info, HelpCircle } from 'lucide-react';
import { FlashGroup, Room, UserProfile } from '../types';

interface CreateGroupScreenProps {
  rooms: Room[];
  preselectedRoom?: Room;
  currentUser: UserProfile;
  onCreateGroup: (group: FlashGroup) => void;
  onBack: () => void;
}

export default function CreateGroupScreen({
  rooms,
  preselectedRoom,
  currentUser,
  onCreateGroup,
  onBack,
}: CreateGroupScreenProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'遊戲娛樂' | '讀書研究' | '桌遊聚會'>('遊戲娛樂');
  const [location, setLocation] = useState(preselectedRoom ? preselectedRoom.name : '學生活動中心');
  const [startTime, setStartTime] = useState('14:00');
  const [maxParticipants, setMaxParticipants] = useState(4);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleStepper = (val: number) => {
    const nextVal = maxParticipants + val;
    if (nextVal >= 2 && nextVal <= 10) {
      setMaxParticipants(nextVal);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('請輸入活動名稱');
      return;
    }
    if (!location.trim()) {
      setError('請輸入或選擇地點');
      return;
    }
    if (!description.trim()) {
      setError('請填寫揪團簡介');
      return;
    }

    const emojiMap: Record<string, string> = {
      '遊戲娛樂': '🎮',
      '讀書研究': '📚',
      '桌遊聚會': '🎲',
    };

    const newGroup: FlashGroup = {
      id: `f_user_${Date.now()}`,
      title,
      category,
      categoryEmoji: emojiMap[category],
      time: `今天 ${startTime} - ${(parseInt(startTime.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
      location,
      buildingAddress: '世新大學 校園空間',
      description,
      maxParticipants,
      currentParticipants: 1, // Currently just the creator
      members: [
        {
          name: currentUser.nickname,
          avatarUrl: currentUser.avatarUrl,
          isCreator: true,
        }
      ],
      facilityTags: category === '遊戲娛樂' 
        ? ['WiFi', '可交談', '舒適沙發'] 
        : category === '讀書研究' 
          ? ['WiFi', '極致安靜', '供插座'] 
          : ['WiFi', '可交談', '桌遊附設'],
      mapUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALhEkvuqGMcem0Dh6Wl5IT2f7xToBTt-tN51_cl4fAMLURwTJor9VJ_SAgTg_yUy78Ng5EXu-c3VJI4oKc0TVZDOLEe9-2qOlxGT-M9IOJpl9tiFrfUx-M6_7AACvE7Hn_HtLnf88Bt5LVmsYIUrGydUnVT22AZIBp2bMPn-V8nSBQxRSd4empK6oMR2nioWtsQEbKepYSjU-FRNw8ObzHdI8Ncf14Y6sHpRBoTlPlvrqRSA-UtsixbW5yMkWBllF670Mo3o-5Kh8L',
    };

    onCreateGroup(newGroup);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-36 font-sans">
      {/* Top Banner */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-5 max-w-md mx-auto shadow-sm">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors active:scale-95 text-[#006b5c]"
          id="back-from-create-group"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-slate-800 text-base">建立新揪團</h1>
        <div className="w-10"></div>
      </header>

      <main className="pt-20 px-5 max-w-md mx-auto space-y-6">
        {/* Banner header image */}
        <div className="relative w-full h-32 rounded-2xl overflow-hidden shadow-sm">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuASCTL6AdYG86YG7rKgS_EN-8CBH6aMk0479GHbU-7BCsUnkAvxxEezbA7nIIiq2z0M9JoB2ZHb49AW39b_kVGObrHuqB8sj-WI2HFEXhcHszXPwyWINX-HmaKPwL01C3jqVqA35-1yu4DlPCLSsNXGzKZRUUUrCobctaFnbD7I4dxFKIrihKjjG_cS75MLUN6TfKFch3wamkA_wrv_sAgCpGuCCkZecH8QNWIilkUObcW2WybyV7Ru92ApcSoBfAZJVLQMYTYbLwub" 
            alt="Students lounge" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
            <p className="text-white font-bold text-xs">與空堂的世新同好，共度有趣美好的休閒時光 🌟</p>
          </div>
        </div>

        {/* Inputs */}
        <form onSubmit={handleCreate} className="space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs px-3.5 py-3 rounded-xl font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Activity name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 pl-1">快閃活動名稱</label>
            <input 
              type="text" 
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-[#006b5c] focus:border-transparent text-sm text-slate-800 placeholder:text-slate-400 font-semibold"
              placeholder="例如：Switch 馬利歐賽車大賽 / 讀微積分"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 pl-1">活動類別</label>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {(['遊戲娛樂', '讀書研究', '桌遊聚會'] as const).map((cat) => {
                const isSelected = category === cat;
                const emoji = cat === '遊戲娛樂' ? '🎮' : cat === '讀書研究' ? '📚' : '🎲';
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`whitespace-nowrap px-4.5 py-2.5 rounded-full border text-xs font-bold transition-all active:scale-95 ${
                      isSelected 
                        ? 'bg-[#e6f2f0] border-emerald-300 text-[#006b5c] shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="mr-1.5">{emoji}</span>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 pl-1">預訂校內地點</label>
              <select 
                className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#006b5c]"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="學生活動中心">學生活動中心 1F</option>
                <option value="宿舍交誼廳">宿舍交誼廳 S4</option>
                <option value="校門口星巴克">校外 景美 Starbucks</option>
                {rooms.map(rm => (
                  <option key={rm.id} value={rm.name}>{rm.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 pl-1">開始時間 (今日)</label>
              <input 
                type="time" 
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#006b5c]"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>

          {/* Stepper counting */}
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-xs font-bold text-slate-800">成團成員人數限制</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">最少 2 人，最多 10 人</p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 px-2 py-1 rounded-full border border-slate-100/50">
              <button 
                type="button"
                onClick={() => handleStepper(-1)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm active:scale-90 transition-transform hover:bg-slate-50"
              >
                <Minus className="w-4 h-4 text-[#006b5c]" />
              </button>
              
              <span className="font-extrabold text-[#006b5c] text-lg w-6 text-center">{maxParticipants}</span>
              
              <button 
                type="button"
                onClick={() => handleStepper(1)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm active:scale-90 transition-transform hover:bg-slate-50"
              >
                <Plus className="w-4 h-4 text-[#006b5c]" />
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 pl-1">快閃揪團簡介</label>
            <textarea 
              className="w-full p-4 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-[#006b5c] focus:border-transparent text-xs text-slate-700 placeholder:text-slate-400 font-semibold leading-relaxed" 
              placeholder="簡單描述一下你的快閃揪團內容，例如：自備主機/帶課本/輕鬆聚會哈拉無負擔，期待你的加入～" 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="pt-4 pb-20">
            <button 
              type="submit"
              className="w-full h-14 bg-[#006b5c] hover:bg-[#004d42] text-white rounded-full font-bold text-sm shadow-[0_10px_30px_rgba(0,107,92,0.2)] active:scale-95 transition-transform duration-150 flex items-center justify-center gap-2"
              id="submit-created-group-cta"
            >
              <Rocket className="w-5 h-5 fill-white text-[#006b5c]" />
              發起此快閃揪團
            </button>
            <p className="text-center text-[10px] text-slate-400 font-semibold mt-3 italic">
              * 發布此活動後，它將即時同步到 Social 學生快閃廣場，讓所有空堂的小夥伴看到並加入！
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

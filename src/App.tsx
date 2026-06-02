/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  defaultUser, 
  presetRooms, 
  defaultBookings, 
  defaultFlashGroups, 
  defaultNotifications, 
  defaultChatHistory 
} from './data';
import { Room, Booking, FlashGroup, Notification, ChatMessage, UserProfile } from './types';

// Subcomponents
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import RoomDetailScreen from './components/RoomDetailScreen';
import BookingSuccessScreen from './components/BookingSuccessScreen';
import GroupDetailScreen from './components/GroupDetailScreen';
import GroupSuccessScreen from './components/GroupSuccessScreen';
import ChatScreen from './components/ChatScreen';
import CreateGroupScreen from './components/CreateGroupScreen';
import NotificationCenter from './components/NotificationCenter';

// Lucide Icons
import { 
  MapPin, Calendar, Clock, Volume2, Power, Tv, Wifi, Users, User, Bell, Compass, 
  ChevronRight, ArrowLeft, CheckCircle2, History, RotateCcw, MessageSquare, Plus, Check, Star
} from 'lucide-react';

export default function App() {
  // Authentication & Profile states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('shuchill_logged') === 'true';
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('shuchill_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  // Screen State Machine
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'main'>('login');
  const [activeTab, setActiveTab] = useState<'map' | 'bookings' | 'social' | 'profile'>('map');

  // Subsystem states
  const [rooms, setRooms] = useState<Room[]>(presetRooms);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('shuchill_bookings');
    return saved ? JSON.parse(saved) : defaultBookings;
  });
  const [flashGroups, setFlashGroups] = useState<FlashGroup[]>(() => {
    const saved = localStorage.getItem('shuchill_groups');
    return saved ? JSON.parse(saved) : defaultFlashGroups;
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('shuchill_notifications');
    return saved ? JSON.parse(saved) : defaultNotifications;
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('shuchill_chat');
    return saved ? JSON.parse(saved) : defaultChatHistory;
  });

  // Current selections
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<FlashGroup | null>(null);
  const [recentBooking, setRecentBooking] = useState<{ room: Room; duration: number; timeSlot: string } | null>(null);
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);
  const [activeBookingFilter, setActiveBookingFilter] = useState<'active' | 'history'>('active');
  const [activeSocialFilter, setActiveSocialFilter] = useState<string>('全部活動');
  
  // Create group screen flags
  const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false);

  // Sub-navigation helpers
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [qrModalBooking, setQrModalBooking] = useState<Booking | null>(null);
  const [currentBuildingKey, setCurrentBuildingKey] = useState<'she-wo' | 'guan-yuan' | 'library' | 'all'>('she-wo');

  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [scheduleUpdateTimer, setScheduleUpdateTimer] = useState<string>('剛剛');

  // Sync localStorage
  useEffect(() => {
    localStorage.setItem('shuchill_logged', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('shuchill_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('shuchill_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('shuchill_groups', JSON.stringify(flashGroups));
  }, [flashGroups]);

  useEffect(() => {
    localStorage.setItem('shuchill_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('shuchill_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Set the start screen based on auth
  useEffect(() => {
    if (isLoggedIn) {
      setCurrentScreen('main');
    } else {
      setCurrentScreen('login');
    }
  }, [isLoggedIn]);

  // Simulated classroom schedule refresher: P0 "現況即時更新 (連動行政課表，5分鐘更新一次)"
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate changing random room vacancy statuses randomly or triggering real table updates
      setRooms(prev => 
        prev.map(r => {
          if (r.id === 'r402') return r; // keep key room accessible
          const statuses: Array<'red' | 'yellow' | 'green'> = ['red', 'yellow', 'green'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return { ...r, status: randomStatus };
        })
      );
      
      // Update timer message
      const now = new Date();
      setScheduleUpdateTimer(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);

      // Push a subtle simulated notification
      const newNotif: Notification = {
        id: `n_auto_${Date.now()}`,
        type: 'space',
        icon: 'notifications_active',
        title: '課表與空間即時更新完成！',
        timeLabel: '剛剛',
        text: 'SHU-Chill 已完成與行政課表課堂空閒比對，即時燈號已全面重整。',
        isUnread: true
      };
      setNotifications(prev => [newNotif, ...prev]);
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const triggerManualUpdate = () => {
    // Let user trigger manual sync with campus schedule
    setRooms(prev => 
      prev.map(r => {
        if (r.id === 'r402') return r;
        const statuses: Array<'red' | 'yellow' | 'green'> = ['red', 'yellow', 'green'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        return { ...r, status: randomStatus };
      })
    );
    const now = new Date();
    setScheduleUpdateTimer(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
  };

  // Actions
  const handleLogin = (studentId: string, nickname: string) => {
    setUser(prev => ({
      ...prev,
      studentId: studentId.trim(),
      nickname: nickname.trim(),
    }));
    setIsLoggedIn(true);
    setCurrentScreen('main');
  };

  const handleRegister = (studentId: string, realName: string, nickname: string, email: string) => {
    setUser({
      studentId,
      realName,
      nickname,
      avatarUrl: defaultUser.avatarUrl,
      notifyEnabled: true,
      privateEnabled: false,
    });
    setIsLoggedIn(true);
    setCurrentScreen('main');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
    setSelectedRoom(null);
    setSelectedGroup(null);
    setShowCreateGroup(false);
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleConfirmBooking = (room: Room, duration: number, timeSlot: string) => {
    const seatId = `座位 ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}-${Math.floor(Math.random() * 20 + 1)}`;
    const newBooking: Booking = {
      id: `b_${Date.now()}`,
      roomId: room.id,
      roomName: room.name,
      roomLocation: `${room.buildingAddress.replace('世新大學 ', '')} • ${seatId}`,
      date: '今天',
      timeSlot: `${timeSlot} - ${(parseInt(timeSlot.split(':')[0]) + duration).toString().padStart(2, '0')}:00`,
      duration,
      seats: seatId,
      details: room.amenities[0] ? `附${room.amenities[0]}` : '專屬空位',
      qrCodeUrl: '#',
      status: 'active',
      facilityTags: room.amenities,
    };

    setBookings(prev => [newBooking, ...prev]);
    setRecentBooking({ room, duration, timeSlot });

    // Add booking success notification
    const newNotif: Notification = {
      id: `n_booking_${Date.now()}`,
      type: 'booking',
      icon: 'calendar_today',
      title: '空間預約成功！',
      timeLabel: '剛剛',
      text: `已為您成功鎖定 ${room.name}的舒適時段（${newBooking.timeSlot}）！點擊查看入場憑證。`,
      isUnread: true,
    };
    setNotifications(prev => [newNotif, ...prev]);

    setSelectedRoom(null);
    setActiveTab('bookings');
  };

  const handleCreateGroupForRoom = (room: Room) => {
    setSelectedRoom(null);
    setSelectedGroup(null);
    setShowCreateGroup(true);
  };

  const handleCreateGroup = (group: FlashGroup) => {
    setFlashGroups(prev => [group, ...prev]);
    setShowCreateGroup(false);
    setSelectedGroup(group);

    // Add group creation system notification
    const newNotif: Notification = {
      id: `n_create_g_${Date.now()}`,
      type: 'group',
      icon: 'groups',
      title: '快閃團建立成功 🚀',
      timeLabel: '剛剛',
      text: `您建立的「${group.title}」已在 Social 揪團廣場隆重登場！小夥伴們正摩拳擦掌準備入團。`,
      isUnread: true,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleJoinGroup = (groupId: string) => {
    // Add current user to group
    setFlashGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            currentParticipants: Math.min(g.maxParticipants, g.currentParticipants + 1),
          };
        }
        return g;
      })
    );

    // Notify other members
    const newNotif: Notification = {
      id: `n_join_g_${Date.now()}`,
      type: 'group',
      icon: 'groups',
      title: '成功加入該快閃團！',
      timeLabel: '剛剛',
      text: `您已順利入主快閃揪團！點擊前往聊天室與組員交流集合細節吧。`,
      isUnread: true,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleSendMessage = (text: string) => {
    if (!selectedGroup) return;
    const now = new Date();
    const timestampStr = `${now.getHours() <= 12 ? '上午' : '下午'} ${now.getHours() === 12 ? 12 : now.getHours() % 12}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      groupId: selectedGroup.id,
      sender: user.nickname,
      senderAvatar: user.avatarUrl,
      isMe: true,
      text,
      timestamp: timestampStr,
    };
    setChatMessages(prev => [...prev, newMsg]);

    // Simulated reply 5 seconds later
    setTimeout(() => {
      const answers = [
        '收到！我們已經在這裡了！',
        '耶！等你來喔～🏎️💨',
        '好，路上小心，慢慢來沒關係。',
        '聽起來太讚了吧！',
      ];
      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
      const replyMsg: ChatMessage = {
        id: `msg_reply_${Date.now()}`,
        groupId: selectedGroup.id,
        sender: '阿強',
        senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZooWErYW0mIoxU3cpTPohcmT1Cr8ClR3CRRVu2xh5R1g0G9utrrHEusrBJ5JzkD8cIaXqn4o89DoPmpr92sLjzUXx3-g9TQgXaiWh_yDiNW7LzoErV8Zuuhjlaz8xVpVhcBqbwtpAly49YQh0nhqhCoxzFNrux2o5pIc723Kdq5A7UuZJME6kVxs1nL26001cyv8GI-HIlMiHcfxhga7TSeOAwHgjLNksSnZFAK2Dwn8koYBxi-Kq-RsnJomDFQ4l74YdCAsTqNSn',
        isMe: false,
        text: randomAnswer,
        timestamp: timestampStr,
      };
      setChatMessages(prev => [...prev, replyMsg]);
    }, 2500);
  };

  const handleSaveProfile = () => {
    setSavingSettings(true);
    setTimeout(() => {
      setSavingSettings(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }, 1000);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const openQrModalForBooking = (b: Booking) => {
    setQrModalBooking(b);
    setIsQrModalOpen(true);
  };

  // Filters rooms depending on active building campus
  const filteredRooms = rooms.filter(rm => {
    if (currentBuildingKey === 'all') return true;
    return rm.buildingKey === currentBuildingKey;
  });

  // Filter groups depending on chosen categories
  const filteredSocialGroups = flashGroups.filter(g => {
    if (activeSocialFilter === '全部活動') return true;
    return g.category === activeSocialFilter.replace('🎮 ', '').replace('📚 ', '').replace('🎲 ', '');
  });

  // Render Login and Register screens outside of Main layout
  if (currentScreen === 'login') {
    return (
      <div className="bg-slate-900 w-full min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl">
          <LoginScreen 
            onLogin={handleLogin}
            onNavigateToRegister={() => setCurrentScreen('register')}
          />
        </div>
      </div>
    );
  }

  if (currentScreen === 'register') {
    return (
      <div className="bg-slate-900 w-full min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl">
          <RegisterScreen 
            onRegister={handleRegister}
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        </div>
      </div>
    );
  }

  // Room detail overlays
  if (selectedRoom) {
    return (
      <div className="bg-slate-900 w-full min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl">
          <RoomDetailScreen 
            room={selectedRoom}
            allRooms={rooms}
            onBack={() => setSelectedRoom(null)}
            onBook={handleConfirmBooking}
            onCreateGroupForRoom={handleCreateGroupForRoom}
            onSwitchRoom={setSelectedRoom}
          />
        </div>
      </div>
    );
  }

  // Flash group detail overlays
  if (selectedGroup) {
    return (
      <div className="bg-slate-900 w-full min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl">
          <GroupDetailScreen 
            group={selectedGroup}
            currentUserNickname={user.nickname}
            onBack={() => setSelectedGroup(null)}
            onJoin={(gid) => handleJoinGroup(gid)}
            onNavigateToChat={(gid) => setSelectedGroup(selectedGroup)} // Stay on screen or transition
          />
        </div>
      </div>
    );
  }

  // Create flash group screen overlay
  if (showCreateGroup) {
    return (
      <div className="bg-slate-900 w-full min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl">
          <CreateGroupScreen 
            rooms={rooms}
            onCreateGroup={handleCreateGroup}
            onBack={() => setShowCreateGroup(false)}
          />
        </div>
      </div>
    );
  }

  // Notification center overlay
  if (showNotificationCenter) {
    return (
      <div className="bg-slate-900 w-full min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl">
          <NotificationCenter 
            notifications={notifications}
            onBack={() => setShowNotificationCenter(false)}
            onMarkAllRead={markAllNotificationsAsRead}
            onClearNotification={clearNotification}
          />
        </div>
      </div>
    );
  }

  // Group active chat messaging overlay
  const activeChatGroup = selectedGroup; // For simplicity we render direct chat overlay if user explicitly enters chat via succees triggers. Let's make a beautiful sub-chat view.
  
  const unreadNotifCount = notifications.filter(n => n.isUnread).length;

  return (
    <div className="bg-slate-900 w-full min-h-screen flex items-center justify-center font-sans relative select-none">
      
      {/* Target Container device wrapper */}
      <div className="w-full max-w-md bg-[#f9f9fc] min-h-screen relative shadow-2xl pb-24">
        
        {/* Floating background decorative light blobbies */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#006b5c]/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-violet-600/5 rounded-full blur-[90px] pointer-events-none"></div>

        {/* Global Banner: TopAppBar */}
        <header className="sticky top-0 left-0 right-0 z-50 flex justify-between items-center px-5 h-16 bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-[0_4px_20px_rgba(0,107,92,0.02)]">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('map')}>
            <div className="w-8 h-8 rounded-xl bg-[#e6f2f0] flex items-center justify-center text-[#006b5c]">
              <Compass className="w-4.5 h-4.5 animate-spin-slow" />
            </div>
            <span className="text-lg font-black text-[#006b5c] tracking-tight">SHU-Chill</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time课表更新 indicator: P0 */}
            <button 
              onClick={triggerManualUpdate}
              className="text-[10px] font-bold text-[#006b5c] bg-[#e6f2f0] border border-emerald-100 px-2.5 py-1 rounded-full hover:bg-emerald-100 cursor-pointer active:scale-95 transition-all flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              課表同步: {scheduleUpdateTimer}
            </button>

            {/* Notification Bell */}
            <button 
              onClick={() => setShowNotificationCenter(true)}
              className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors active:scale-95 text-slate-700 relative border border-slate-100"
              id="notification-bell-btn"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotifCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Dynamic content depending on currently Active Bottom Tab */}
        <main className="px-5 pt-5 space-y-6">

          {/* TAB 1: 視覺化燈號地圖 (HOME) */}
          {activeTab === 'map' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Brand Introduction */}
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  空堂去哪裡？<br />
                  <span className="text-[#006b5c]">世新空堂空間預約</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  精準整合全校行政課表，尋找即時課堂娛樂與社交自習室。
                </p>
              </div>

              {/* Building Filters: P0 視覺化燈號地圖 */}
              <section className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                  點選校園大樓
                </h3>
                
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { key: 'she-wo', label: '舍我樓 R、S', roomsCount: 2, free: 2 },
                    { key: 'guan-yuan', label: '管院大樓 M', roomsCount: 2, free: 1 },
                    { key: 'library', label: '世新圖書館', roomsCount: 2, free: 2 },
                  ].map((building) => {
                    const isSelected = currentBuildingKey === building.key;
                    return (
                      <button 
                        key={building.key}
                        onClick={() => setCurrentBuildingKey(building.key as any)}
                        className={`text-left p-3.5 rounded-2xl border transition-all active:scale-[0.98] flex flex-col justify-between h-28 relative overflow-hidden group ${
                          isSelected 
                            ? 'bg-[#006b5c] text-white border-transparent shadow-lg shadow-emerald-900/10' 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full self-start ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {building.free} 空閒
                        </span>
                        
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold leading-tight">{building.label}</p>
                          <p className={`text-[9px] font-bold ${isSelected ? 'text-white/75' : 'text-slate-400'}`}>
                            {building.roomsCount} 款娛樂空間
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Stylized 3D Layout map card */}
              <section>
                <div 
                  onClick={triggerManualUpdate}
                  className="relative w-full aspect-[16/10] bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col items-center justify-center cursor-pointer group"
                >
                  <img 
                    className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuALhEkvuqGMcem0Dh6Wl5IT2f7xToBTt-tN51_cl4fAMLURwTJor9VJ_SAgTg_yUy78Ng5EXu-c3VJI4oKc0TVZDOLEe9-2qOlxGT-M9IOJpl9tiFrfUx-M6_7AACvE7Hn_HtLnf88Bt5LVmsYIUrGydUnVT22AZIBp2bMPn-V8nSBQxRSd4empK6oMR2nioWtsQEbKepYSjU-FRNw8ObzHdI8Ncf14Y6sHpRBoTlPlvrqRSA-UtsixbW5yMkWBllF670Mo3o-5Kh8L" 
                    alt="Map mockup" 
                  />
                  
                  <div className="z-10 flex flex-col items-center text-center p-6 space-y-2 select-none">
                    <div className="w-12 h-12 rounded-full bg-[#e6f2f0] flex items-center justify-center text-[#006b5c] shadow-sm">
                      <Compass className="w-6 h-6 animate-spin-slow" />
                    </div>
                    
                    <h3 className="font-extrabold text-sm text-slate-900">
                      點擊載入最新即時地圖燈號
                    </h3>
                    
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed max-w-[280px]">
                      🔴 紅色: 全滿 · 🟡 黃色: 共享空間/自習 · 🟢 綠色: 完全空閒
                    </p>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                    課表即時對接中
                  </div>
                </div>
              </section>

              {/* Recommended Bento Cards list: P1 設備標籤, status definitions */}
              <section className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 font-sans">
                    校園熱門空間預約列表 ({filteredRooms.length})
                  </h3>
                  
                  {currentBuildingKey !== 'all' && (
                    <button 
                      onClick={() => setCurrentBuildingKey('all')}
                      className="text-xs font-bold text-[#006b5c] hover:underline"
                    >
                      查看全部
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {filteredRooms.map((room) => {
                    const isGreen = room.status === 'green';
                    const isYellow = room.status === 'yellow';
                    return (
                      <div 
                        key={room.id}
                        className="bg-white rounded-2xl border border-slate-200 p-4.5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="text-base font-extrabold text-slate-800 tracking-tight">{room.name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
                              <MapPin className="w-3 h-3" />
                              {room.buildingAddress.replace('世新大學 ', '')} • {room.capacity}
                            </p>
                          </div>

                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                            isGreen 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : isYellow 
                                ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                : 'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isGreen ? 'bg-emerald-500 animate-pulse' : isYellow ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                            {isGreen ? '🟢 空閒 (完全可訂)' : isYellow ? '🟡 尚有餘位 (共享自習)' : '🔴 全滿'}
                          </span>
                        </div>

                        {/* Amenities lists */}
                        <div className="flex flex-wrap gap-1.5">
                          {room.amenities.map((f) => (
                            <span key={f} className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-lg">
                              {f}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                          <div className="text-xs">
                            <span className="text-[10px] font-bold text-slate-400 block mb-0.5">預選時段狀態</span>
                            <span className="text-xs font-bold text-[#006b5c]">{room.nextAvailableTime || '隨到隨坐'}</span>
                          </div>

                          <button 
                            disabled={room.status === 'red'}
                            onClick={() => handleRoomSelect(room)}
                            className={`px-4.5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 ${
                              room.status === 'red' 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                                : 'bg-[#006b5c] hover:bg-[#004d42] text-white'
                            }`}
                          >
                            立即預約空間
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: 我的預約管理 (BOOKINGS) */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">我的預約</h2>
                
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                  <button 
                    onClick={() => setActiveBookingFilter('active')}
                    className={`px-4 py-1.5 rounded-lg transition-all ${
                      activeBookingFilter === 'active' 
                        ? 'bg-white text-slate-800 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    進行中
                  </button>
                  
                  <button 
                    onClick={() => setActiveBookingFilter('history')}
                    className={`px-4 py-1.5 rounded-lg transition-all ${
                      activeBookingFilter === 'history' 
                        ? 'bg-white text-slate-800 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    歷史紀錄
                  </button>
                </div>
              </div>

              {/* Active Bookings view */}
              {activeBookingFilter === 'active' && (
                <div className="space-y-4">
                  {bookings.filter(b => b.status === 'active').length === 0 ? (
                    <div className="glass-card rounded-2xl p-10 flex flex-col items-center text-center text-slate-400 border border-slate-200">
                      <Calendar className="w-12 h-12 stroke-[1.2] mb-3 text-slate-300 animate-bounce" />
                      <p className="text-sm font-semibold mb-4">目前沒有正在進行的預約</p>
                      <button 
                        onClick={() => setActiveTab('map')}
                        className="bg-[#006b5c] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#004d42]"
                      >
                        去預約空間
                      </button>
                    </div>
                  ) : (
                    bookings.filter(b => b.status === 'active').map((b) => (
                      <div key={b.id} className="glass-card rounded-2xl p-5 border border-slate-100 flex flex-col gap-4 relative overflow-hidden bg-white">
                        {/* Background shape accent */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#001f1a]/5 rounded-bl-full z-0"></div>
                        
                        <div className="flex justify-between items-start z-10 relative">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black p-1 py-0.5 rounded uppercase">
                                已確認
                              </span>
                              <span className="text-[10px] font-extrabold text-[#006b5c]">
                                {b.date}
                              </span>
                            </div>
                            
                            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                              {b.roomName}
                            </h3>
                            <p className="text-xs text-slate-500 font-bold">
                              {b.roomLocation}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xl font-bold text-[#006b5c] block">
                              {b.timeSlot.split(' ')[0]}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                              {b.timeSlot.split(' ').pop()}
                            </span>
                          </div>
                        </div>

                        {/* QR Code trigger & map visualizer buttons */}
                        <div className="flex gap-2.5 mt-2 z-10 relative">
                          <button 
                            onClick={() => openQrModalForBooking(b)}
                            className="flex-1 bg-[#006b5c] hover:bg-[#004d42] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                            id="show-qr-trigger"
                          >
                            <Plus className="w-4.5 h-4.5" />
                            顯示入場條碼
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Booking History tab */}
              {activeBookingFilter === 'history' && (
                <div className="space-y-4">
                  {bookings.filter(b => b.status !== 'active').map((b) => (
                    <div key={b.id} className="bg-white/70 backdrop-blur-md rounded-2xl p-4.5 border border-slate-200 shadow-sm flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-slate-800">{b.roomName}</h4>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
                          <Calendar className="w-3 h-3" />
                          <span>{b.date} {b.timeSlot}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-rose-50 text-rose-500'
                        }`}>
                          {b.status === 'completed' ? '已結束' : '已取消'}
                        </span>
                        
                        <button 
                          onClick={() => {
                            // Quick book replica
                            const targetRoom = rooms.find(r => r.name === b.roomName) || rooms[0];
                            setSelectedRoom(targetRoom);
                          }}
                          aria-label="再次預約"
                          className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 空堂揪團功能 (SOCIAL) */}
          {activeTab === 'social' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  空堂不孤單<br />
                  <span className="text-[#006b5c]">快閃揪團廣場</span>
                </h2>
                
                <p className="text-xs text-slate-500 font-medium">
                  目前空堂區有個活動在線！尋找同班世新隊友一起吃喝玩桌遊討論。
                </p>
              </div>

              {/* All group filter tags horizontal list */}
              <div className="flex overflow-x-auto gap-2.5 pb-2 -mx-5 px-5 no-scrollbar">
                {['全部活動', '🎮 電玩休閒', '📚 讀書討論', '🎲 桌遊派對'].map((filterTag) => {
                  const isSelected = activeSocialFilter === filterTag;
                  return (
                    <button 
                      key={filterTag}
                      onClick={() => setActiveSocialFilter(filterTag)}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                        isSelected 
                          ? 'bg-[#006b5c] text-white border border-transparent shadow shadow-emerald-900/10' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {filterTag}
                    </button>
                  );
                })}
              </div>

              {/* Group Lobby Cards */}
              <div className="space-y-4">
                {filteredSocialGroups.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 border border-slate-200/80 text-center text-slate-400">
                    <p className="text-xs font-bold">目前暫無此分類快閃活動，點擊下方發起一個吧！</p>
                  </div>
                ) : (
                  filteredSocialGroups.map((g) => {
                    const isJoined = g.members.some(m => m.name === user.nickname) || (recentBooking && g.id === 'f_user'); // simplified check
                    return (
                      <article 
                        key={g.id}
                        className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                      >
                        {/* Status bar */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#006b5c]"></div>
                        
                        <div className="flex justify-between items-start mb-3 pl-2">
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-[#006b5c] rounded text-[9px] font-black">
                              {g.categoryEmoji} {g.category}
                            </span>
                            <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                              {g.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1 bg-slate-50 border border-slate-150 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{g.currentParticipants}/{g.maxParticipants} 人</span>
                          </div>
                        </div>

                        <div className="flex items-center text-slate-500 text-xs pl-2 mb-4">
                          <MapPin className="w-4 h-4 text-[#006b5c] mr-1" />
                          <span>{g.location}</span>
                        </div>

                        {/* Avatars & join CTAs */}
                        <div className="flex items-center justify-between pl-2 border-t border-slate-50 pt-4">
                          <div className="flex -space-x-2.5 items-center">
                            {g.members.map((m, idx) => (
                              <img 
                                key={idx}
                                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm bg-slate-100"
                                src={m.avatarUrl} 
                                alt={m.name} 
                              />
                            ))}
                            {g.currentParticipants > g.members.length && (
                              <div className="w-8 h-8 rounded-full border-2 border-slate-400 bg-white flex items-center justify-center text-[10px] font-black text-slate-500 z-10 shadow-sm">
                                你
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {g.currentParticipants >= g.maxParticipants ? (
                              <button 
                                onClick={() => {
                                  setSelectedGroup(g);
                                }}
                                className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold rounded-xl active:scale-95"
                              >
                                查看詳細 / 進入聊天
                              </button>
                            ) : (
                              <button 
                                onClick={() => setSelectedGroup(g)}
                                className="px-4 py-2 bg-[#006b5c] hover:bg-[#004d42] text-white text-xs font-bold rounded-xl flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                              >
                                立即加入
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              {/* Floating Create Flash Action triggers: P2 */}
              <div className="pt-4 flex justify-center">
                <button 
                  onClick={() => setShowCreateGroup(true)}
                  className="px-6 py-3 bg-[#006b5c] hover:bg-[#004d42] text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/20 active:scale-95 float-btn select-none animate-bounce"
                  id="float-create-group-plaza"
                >
                  <Plus className="w-4.5 h-4.5" />
                  發起我自己的空堂快閃團
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: 帳號設定 (PROFILE) */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in select-none">
              
              {/* Profile Avatar Segment */}
              <section className="flex flex-col items-center pt-2">
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-[0_10px_30px_rgba(0,107,92,0.1)] relative">
                    <img 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                      src={user.avatarUrl} 
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Plus className="w-6 h-6 text-white stroke-[2.5]" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-1 right-1 bg-[#006b5c] text-white rounded-full p-2 border-2 border-white shadow-md">
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                
                <p className="mt-3 text-xs text-slate-400 font-bold uppercase">王小明 • 點擊更換大頭貼</p>
              </section>

              {/* Profile setup form card */}
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                
                {savedSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-1">
                    <Check className="w-4 h-4 stroke-[3]" />
                    設定儲存成功！
                  </div>
                )}

                {/* Read-only segment: Student ID */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase pl-1">學號 (系統永久碼)</label>
                  <div className="w-full bg-slate-50 text-slate-500 text-xs font-bold px-4 py-3 rounded-xl border border-slate-100 flex items-center justify-between cursor-not-allowed">
                    <span>{user.studentId}</span>
                    <span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-400 uppercase">
                      不可更改
                    </span>
                  </div>
                </div>

                {/* Read-only segment: Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase pl-1">姓名</label>
                  <div className="w-full bg-slate-50 text-slate-500 text-xs font-bold px-4 py-3 rounded-xl border border-slate-100 flex items-center justify-between cursor-not-allowed">
                    <span>{user.realName || '王小明'}</span>
                    <span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-400 uppercase">
                      不可更改
                    </span>
                  </div>
                </div>

                {/* Editable segment: Nickname */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#006b5c] uppercase pl-1">暱稱 (會在揪團廣場中顯示)</label>
                  <input 
                    type="text" 
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-[#006b5c] focus:bg-white bg-slate-50/50 transition-all shadow-sm"
                    value={user.nickname}
                    onChange={(e) => setUser(prev => ({ ...prev, nickname: e.target.value }))}
                  />
                </div>
              </form>

              {/* Status checkboxes notifications: P1 */}
              <section className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">通知設定</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">即時接收預約核可及空堂快閃通知</p>
                  </div>
                  
                  <input 
                    type="checkbox"
                    checked={user.notifyEnabled}
                    onChange={(e) => setUser(prev => ({ ...prev, notifyEnabled: e.target.checked }))}
                    className="w-5 h-5 rounded text-[#006b5c] border-slate-300 focus:ring-[#006b5c]" 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">隱私設定</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">向其他小夥伴或非發起人隱藏我的預約足跡</p>
                  </div>
                  
                  <input 
                    type="checkbox"
                    checked={user.privateEnabled}
                    onChange={(e) => setUser(prev => ({ ...prev, privateEnabled: e.target.checked }))}
                    className="w-5 h-5 rounded text-[#006b5c] border-slate-300 focus:ring-[#006b5c]" 
                  />
                </div>
              </section>

              {/* Save Trigger */}
              <button 
                type="button"
                onClick={handleSaveProfile}
                disabled={savingSettings}
                className="w-full py-4 rounded-xl bg-[#006b5c] hover:bg-[#004d42] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(0,107,92,0.2)] active:scale-95 transition-all"
                id="save-profile-settings"
              >
                {savingSettings ? '正在存儲變更...' : '儲存使用者資訊 & 設定'}
              </button>

              {/* LogOut action */}
              <button 
                type="button"
                onClick={handleLogout}
                className="w-full py-3.5 rounded-xl border border-rose-200 text-rose-500 font-bold text-xs bg-rose-50/20 hover:bg-rose-50 flex items-center justify-center gap-1.5 transition-colors active:scale-95 duration-200"
                id="btn-logout"
              >
                登出本機學號帳號
              </button>

            </div>
          )}

        </main>

        {/* Floating Modal QR Code 電子憑證 popup: P1 */}
        {isQrModalOpen && qrModalBooking && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center select-none max-w-md mx-auto">
            
            {/* Dark blur backdrop overlay */}
            <div 
              onClick={() => setIsQrModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></div>
            
            {/* Sliding paper container */}
            <div className="bg-white w-full rounded-t-[32px] p-6 pb-10 relative z-10 shadow-2xl border-t border-slate-100 flex flex-col items-center animate-slide-up">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-6"></div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-black text-slate-900">{qrModalBooking.roomName}</h3>
                <p className="text-xs text-[#006b5c] font-bold mt-1">
                  {qrModalBooking.roomLocation}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">
                  時段：今天 {qrModalBooking.timeSlot}
                </p>
              </div>

              {/* QR placeholder card */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-md mb-6 relative overflow-hidden">
                <div className="w-44 h-44 bg-slate-950 rounded-2xl p-2.5 flex flex-col justify-between items-center relative gap-1.5">
                  <div className="flex w-full justify-between">
                    <div className="w-8 h-8 border-white border-2"></div>
                    <div className="w-8 h-8 border-white border-2"></div>
                  </div>
                  
                  {/* Glowing QR grid scanner line */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#00bfa5] animate-bounce"></div>
                  <div className="flex-grow flex flex-wrap gap-1 p-2 items-center justify-center opacity-80 scale-105">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 ${i % 3 === 0 || i % 7 === 1 ? 'bg-white' : 'bg-transparent'}`} 
                      />
                    ))}
                  </div>

                  <div className="flex w-full justify-between">
                    <div className="w-8 h-8 border-white border-2"></div>
                    <div className="w-3 h-3 bg-[#00bfa5] rounded-full animate-ping mr-2 self-end mb-2"></div>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-1.5 max-w-[280px] mb-6">
                <p className="text-[11px] text-rose-500 font-bold">
                  請於預約開始前 / 後 15 分鐘內掃描入場
                </p>
                <p className="text-[9px] text-slate-400 font-medium">
                  世新大學行政處溫馨提醒：若蓄意逾期未報到次數達 3 次以上，系統將凍結其帳號租借權益。
                </p>
              </div>

              <button 
                onClick={() => setIsQrModalOpen(false)}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs rounded-xl border border-slate-200"
              >
                關閉電子憑證
              </button>
            </div>
          </div>
        )}

        {/* Global Bottom Tab Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 pb-6 pt-2 h-20 bg-white/70 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,107,92,0.05)] rounded-t-2xl max-w-md mx-auto">
          
          {/* TAB 1: 地圖 */}
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all duration-200 ${
              activeTab === 'map' 
                ? 'bg-[#e6f2f0] text-[#006b5c] scale-[1.03] font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5 h-5 ${activeTab === 'map' ? 'fill-[#006b5c]/10 text-[#006b5c]' : ''}`} />
            <span className="text-[10px] tracking-wide mt-1">視覺地圖</span>
          </button>

          {/* TAB 2: 預約 */}
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all duration-200 ${
              activeTab === 'bookings' 
                ? 'bg-[#e6f2f0] text-[#006b5c] scale-[1.03] font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Calendar className={`w-5 h-5 ${activeTab === 'bookings' ? 'fill-[#006b5c]/10 text-[#006b5c]' : ''}`} />
            <span className="text-[10px] tracking-wide mt-1">我的預約</span>
          </button>

          {/* TAB 3: 揪團 */}
          <button 
            onClick={() => setActiveTab('social')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all duration-200 ${
              activeTab === 'social' 
                ? 'bg-[#e6f2f0] text-[#006b5c] scale-[1.03] font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users className={`w-5 h-5 ${activeTab === 'social' ? 'fill-[#006b5c]/10 text-[#006b5c]' : ''}`} />
            <span className="text-[10px] tracking-wide mt-1">快閃揪團</span>
          </button>

          {/* TAB 4: 個人 */}
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all duration-200 ${
              activeTab === 'profile' 
                ? 'bg-[#e6f2f0] text-[#006b5c] scale-[1.03] font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'fill-[#006b5c]/10 text-[#006b5c]' : ''}`} />
            <span className="text-[10px] tracking-wide mt-1">個人設定</span>
          </button>
        </nav>

        {/* Hidden sub-chat simulation overlay */}
        {selectedGroup && (
          <div className="absolute inset-0 z-50 bg-white">
            <ChatScreen 
              group={selectedGroup}
              messages={chatMessages.filter(m => m.groupId === selectedGroup.id)}
              onSendMessage={handleSendMessage}
              onBack={() => {
                // Keep group joined but return back to social list trigger!
                setSelectedGroup(null);
                setActiveTab('social');
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
}

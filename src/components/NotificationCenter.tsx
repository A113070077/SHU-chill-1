import { Notification } from '../types';
import { ArrowLeft, Bell, Users, CheckCircle2, Bookmark, Flame, Zap } from 'lucide-react';

interface NotificationCenterProps {
  notifications: Notification[];
  onBack: () => void;
  onMarkAllRead: () => void;
  onClearNotification: (id: string) => void;
}

export default function NotificationCenter({
  notifications,
  onBack,
  onMarkAllRead,
  onClearNotification,
}: NotificationCenterProps) {
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'group':
        return <Users className="w-5 h-5 text-indigo-600" />;
      case 'space':
        return <Flame className="w-5 h-5 text-amber-500" />;
      default:
        return <Zap className="w-5 h-5 text-teal-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-emerald-50 border border-emerald-100';
      case 'group':
        return 'bg-indigo-50 border border-indigo-100';
      case 'space':
        return 'bg-amber-50 border border-amber-100';
      default:
        return 'bg-teal-50 border border-teal-100';
    }
  };

  const unreadCount = notifications.filter(n => n.isUnread).length;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-5 max-w-md mx-auto shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors active:scale-95"
            id="back-from-notifications"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#006b5c]">通知中心</h1>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={onMarkAllRead}
            className="text-xs font-semibold text-[#006b5c] px-3 py-1.5 rounded-full hover:bg-emerald-50 active:scale-95 transition-colors"
            id="mark-all-notifications-read"
          >
            全部標記為已讀
          </button>
        )}
      </header>

      {/* Main Notification feed */}
      <main className="pt-20 px-5 space-y-6 max-w-md mx-auto">
        {/* Today */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            最新通知
          </h2>
          
          {notifications.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center text-slate-400">
              <Bell className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
              <p className="text-sm">暫無任何系統通知</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => onClearNotification(notif.id)}
                  className={`glass-card p-4 rounded-xl flex gap-3.5 items-start transition-all duration-200 cursor-pointer active:scale-[0.99] relative overflow-hidden group ${
                    notif.isUnread ? 'bg-white border-l-4 border-l-[#00bfa5] shadow-md shadow-emerald-900/5' : 'bg-white/60 opacity-80'
                  }`}
                >
                  <div className={`p-2.5 rounded-full flex-shrink-0 ${getIconBg(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-grow space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-semibold transition-colors ${notif.isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {notif.timeLabel}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {notif.text}
                    </p>

                    {notif.isUnread && (
                      <div className="pt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#00bfa5] rounded-full"></span>
                        <span className="text-[10px] font-semibold text-[#006b5c]">新消息</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Informative tips */}
        <section className="bg-[#e6f2f0]/60 border border-emerald-100/50 rounded-2xl p-4 text-center">
          <p className="text-xs text-[#006b5c] font-medium leading-relaxed">
            💡 系統提示：可點擊任意通知卡片手動移除，空堂不流浪，隨時鎖定最新揪團動態！
          </p>
        </section>
      </main>
    </div>
  );
}

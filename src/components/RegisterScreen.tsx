import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface RegisterScreenProps {
  onRegister: (studentId: string, realName: string, nickname: string, email: string, passwordVal: string) => { success: boolean; error?: string };
  onNavigateToLogin: () => void;
}

export default function RegisterScreen({ onRegister, onNavigateToLogin }: RegisterScreenProps) {
  const [studentId, setStudentId] = useState('');
  const [realName, setRealName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !realName.trim() || !nickname.trim() || !email.trim() || !password.trim()) {
      setError('請填寫所有必要欄位');
      return;
    }
    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致');
      return;
    }
    if (!agree) {
      setError('請勾選並同意服務條款');
      return;
    }
    setError('');
    
    // Successful register
    const result = onRegister(studentId, realName, nickname, email, password);
    if (!result.success) {
      setError(result.error || '註冊失敗');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden flex flex-col justify-center p-5 font-sans">
      {/* Decorative Blob backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] bg-[#7836ff]/10 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Back button */}
      <header className="w-full px-5 py-4 flex items-center absolute top-0 left-0 right-0 z-10 max-w-md mx-auto">
        <button 
          onClick={onNavigateToLogin}
          aria-label="返回登入"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/60 hover:bg-slate-100 transition-colors glass-panel shadow-sm text-slate-700 active:scale-95"
          id="back-to-login"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </header>

      {/* Register body */}
      <main className="flex-1 flex flex-col justify-center py-10 mt-6 select-none max-w-md mx-auto w-full">
        <div className="mb-6 text-center pl-2">
          <h1 className="text-2xl font-bold text-slate-900 mb-1 text-left">建立帳號</h1>
          <p className="text-sm text-slate-500 text-left">加入 SHU-Chill，輕鬆尋找你的專屬空間。</p>
        </div>

        {/* Glass Card registration Form */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,107,92,0.08)] flex flex-col gap-4">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs px-3 py-2 rounded-xl font-medium">
              ⚠️ {error}
            </div>
          )}

          {/*學號 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 pl-1" htmlFor="student_id">
              學號
            </label>
            <input 
              className="w-full h-11 bg-white/50 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400/75 focus:outline-none focus:border-[#006b5c] focus:ring-1 focus:ring-[#006b5c] transition-all shadow-sm"
              id="student_id" 
              placeholder="例如: 110123456" 
              type="text" 
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>

          {/* 2-Column Names Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 pl-1" htmlFor="real_name">
                真實姓名
              </label>
              <input 
                className="w-full h-11 bg-white/50 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400/75 focus:outline-none focus:border-[#006b5c] focus:ring-1 focus:ring-[#006b5c] transition-all shadow-sm"
                id="real_name" 
                placeholder="請輸入姓名" 
                type="text" 
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 pl-1" htmlFor="nickname">
                暱稱
              </label>
              <input 
                className="w-full h-11 bg-white/50 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400/75 focus:outline-none focus:border-[#006b5c] focus:ring-1 focus:ring-[#006b5c] transition-all shadow-sm"
                id="nickname" 
                placeholder="在系統顯示的暱稱" 
                type="text" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </div>

          {/* 電子郵件 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 pl-1" htmlFor="email">
              電子郵件
            </label>
            <input 
              className="w-full h-11 bg-white/50 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400/75 focus:outline-none focus:border-[#006b5c] focus:ring-1 focus:ring-[#006b5c] transition-all shadow-sm"
              id="email" 
              placeholder="example@shu.edu.tw" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* 密碼 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 pl-1" htmlFor="password">
              設定密碼
            </label>
            <div className="relative">
              <input 
                className="w-full h-11 bg-white/50 border border-slate-200 rounded-xl pl-4 pr-10 text-sm text-slate-800 placeholder:text-slate-400/75 focus:outline-none focus:border-[#006b5c] focus:ring-1 focus:ring-[#006b5c] transition-all shadow-sm"
                id="password" 
                placeholder="至少8位字元" 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#006b5c]"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* 確認密碼 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 pl-1" htmlFor="confirm_password">
              確認密碼
            </label>
            <input 
              className="w-full h-11 bg-white/50 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400/75 focus:outline-none focus:border-[#006b5c] focus:ring-1 focus:ring-[#006b5c] transition-all shadow-sm"
              id="confirm_password" 
              placeholder="請再次輸入密碼" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Check Box */}
          <div className="flex items-start gap-2 mt-1 pl-1">
            <input 
              type="checkbox" 
              id="terms"
              className="w-4 h-4 text-[#006b5c] border-slate-300 rounded focus:ring-[#006b5c] mt-0.5 cursor-pointer"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <label className="text-xs text-slate-500 cursor-pointer select-none leading-relaxed" htmlFor="terms">
              我已閱讀並同意 <span className="text-[#006b5c] font-semibold hover:underline">服務條款</span> 與 <span className="text-[#006b5c] font-semibold hover:underline">隱私權政策</span>
            </label>
          </div>

          {/* CTA */}
          <button 
            type="submit"
            className="w-full h-12 mt-2 bg-[#006b5c] hover:bg-[#004d42] text-white font-bold text-sm rounded-full shadow-[0_8px_16px_rgba(0,107,92,0.2)] hover:shadow-[0_12px_24px_rgba(0,107,92,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            id="register-submit"
          >
            註冊帳號
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center mt-1 text-xs text-slate-500">
            已有帳號？ <button type="button" onClick={onNavigateToLogin} className="text-[#006b5c] font-bold hover:underline" id="back-to-login-link">返回登入</button>
          </div>
        </form>
      </main>
    </div>
  );
}

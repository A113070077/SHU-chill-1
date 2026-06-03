import React, { useState } from 'react';
import { Badge, Lock, ArrowRight, Sparkles, Smartphone, Sofa, Mail, X, CheckCircle2, HelpCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (studentId: string, passwordValue: string) => { success: boolean; error?: string };
  onNavigateToRegister: () => void;
}

export default function LoginScreen({ onLogin, onNavigateToRegister }: LoginScreenProps) {
  const [studentId, setStudentId] = useState('110123456');
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStudentId, setForgotStudentId] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError('請輸入學號');
      return;
    }
    if (!password.trim()) {
      setError('請輸入密碼');
      return;
    }
    setError('');
    
    const result = onLogin(studentId, password);
    if (!result.success) {
      setError(result.error || '登入失敗');
    }
  };

  const handleRetrievePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccessMessage('');

    if (!forgotStudentId.trim()) {
      setForgotError('請輸入註冊學號');
      return;
    }
    if (!forgotEmail.trim()) {
      setForgotError('請輸入註冊信箱');
      return;
    }

    try {
      const saved = localStorage.getItem('shuchill_registered_users');
      let usersList = [
        {
          studentId: '110123456',
          realName: '王小明',
          nickname: '小明',
          email: '110123456@shu.edu.tw',
          passwordValue: '12345678',
        }
      ];
      if (saved) {
        usersList = JSON.parse(saved);
      }

      const found = usersList.find(
        u => u.studentId.trim() === forgotStudentId.trim() && 
             u.email.trim().toLowerCase() === forgotEmail.trim().toLowerCase()
      );

      if (found) {
        setForgotSuccessMessage(`驗證成功！同學 ${found.realName} 您的登入密碼為：【${found.passwordValue}】。請妥善保管！`);
      } else {
        setForgotError('查無此學號及信箱的註冊紀錄，請重試或點擊註冊新帳號。');
      }
    } catch (e) {
      setForgotError('讀取數據出錯，請重新註冊帳號');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-5 font-sans">
      {/* Decorative Blur Biobs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#00bfa5]/10 rounded-full mix-blend-multiply filter blur-[70px] opacity-80 pointer-events-none"></div>
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-violet-600/10 rounded-full mix-blend-multiply filter blur-[70px] opacity-70 pointer-events-none"></div>
      <div className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] bg-emerald-700/10 rounded-full mix-blend-multiply filter blur-[90px] opacity-65 pointer-events-none"></div>

      {/* Main Form Holder */}
      <main className="relative z-10 w-full max-w-[400px]">
        <div className="glass-panel rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,107,92,0.08)] border-t border-l border-white/60 p-8 flex flex-col gap-6 bg-white/90">
          {/* Header */}
          <div className="text-center flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-2xl bg-[#e6f2f0] flex items-center justify-center mb-2 shadow-sm border border-white/50 text-[#006b5c]">
              <Sofa className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-[#006b5c] tracking-tight">SHU-Chill</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Welcome back. Ready to find your spot?</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs px-3.5 py-2.5 rounded-xl font-medium animate-fade-in">
                ⚠️ {error}
              </div>
            )}

            {/* Input: ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 pl-1" htmlFor="student_id">
                Student ID / 學號
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Badge className="w-5 h-5 stroke-[1.5]" />
                </span>
                <input 
                  type="text" 
                  id="student_id"
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#006b5c] focus:ring-1 focus:ring-[#006b5c] transition-all shadow-sm"
                  placeholder="Enter your ID (e.g. 110123456)"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
            </div>

            {/* Input: Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 pl-1" htmlFor="password">
                Password / 密碼
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5 stroke-[1.5]" />
                </span>
                <input 
                  type="password" 
                  id="password"
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#006b5c] focus:ring-1 focus:ring-[#006b5c] transition-all shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full h-12 mt-2 rounded-xl bg-[#006b5c] hover:bg-[#004d42] text-white font-semibold text-sm shadow-[0_8px_20px_-6px_rgba(0,107,92,0.4)] hover:shadow-[0_12px_24px_-8px_rgba(0,107,92,0.5)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              id="login-submit"
            >
              Sign In / 登入
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Helper links */}
            <div className="flex justify-between items-center mt-2 px-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setForgotError('');
                  setForgotSuccessMessage('');
                  setForgotStudentId(studentId);
                  setShowForgotModal(true);
                }}
                className="text-[#006b5c] font-semibold hover:underline cursor-pointer bg-transparent border-none outline-none"
              >
                Forgot Password? / 忘記密碼
              </button>
              <button 
                type="button" 
                onClick={onNavigateToRegister}
                className="text-slate-500 hover:text-[#006b5c] font-medium transition-colors"
                id="to-register-screen"
              >
                Register / 建立帳號
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-400/80 font-medium">© 2026 SHU Space Finder</p>
        </div>
      </main>

      {/* Forgot Password Modal Panel */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowForgotModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          ></div>
          
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-scale-up">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#006b5c]" />
                忘記密碼安全找回
              </h3>
              <button 
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              請輸入您註冊此系統時所登記的學號以及預留信箱，通過雙重安全驗證後即可直接找回密碼。
            </p>

            <form onSubmit={handleRetrievePassword} className="flex flex-col gap-4">
              {forgotError && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-xl font-semibold leading-relaxed">
                  ⚠️ {forgotError}
                </div>
              )}

              {forgotSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3.5 rounded-xl font-bold leading-relaxed flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>找回成功！</span>
                  </div>
                  <div>{forgotSuccessMessage}</div>
                </div>
              )}

              {/* Student ID */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider pl-1">
                  註冊學號
                </label>
                <div className="relative">
                  <Badge className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#006b5c]"
                    placeholder="例如 110123456"
                    value={forgotStudentId}
                    onChange={(e) => setForgotStudentId(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider pl-1">
                  預留電子信箱
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#006b5c]"
                    placeholder="例如 110123456@shu.edu.tw"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#006b5c] hover:bg-[#004d42] text-white font-extrabold shadow-sm transition-all"
                >
                  驗證並查回密碼
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

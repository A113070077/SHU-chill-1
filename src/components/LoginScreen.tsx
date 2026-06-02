import React, { useState } from 'react';
import { Badge, Lock, ArrowRight, Sparkles, Smartphone, Sofa } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (studentId: string, nickname: string) => void;
  onNavigateToRegister: () => void;
}

export default function LoginScreen({ onLogin, onNavigateToRegister }: LoginScreenProps) {
  const [studentId, setStudentId] = useState('110123456');
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState('');

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
    // Mock successful sign in
    onLogin(studentId, '小明');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-5 font-sans">
      {/* Decorative Blur Biobs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#00bfa5]/10 rounded-full mix-blend-multiply filter blur-[70px] opacity-80 pointer-events-none"></div>
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-violet-600/10 rounded-full mix-blend-multiply filter blur-[70px] opacity-70 pointer-events-none"></div>
      <div className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] bg-emerald-700/10 rounded-full mix-blend-multiply filter blur-[90px] opacity-65 pointer-events-none"></div>

      {/* Main Form Holder */}
      <main className="relative z-10 w-full max-w-[400px]">
        <div className="glass-panel rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,107,92,0.08)] border-t border-l border-white/60 p-8 flex flex-col gap-6">
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
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs px-3.5 py-2.5 rounded-xl font-medium">
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
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/60 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#006b5c] focus:ring-1 focus:ring-[#006b5c] focus:bg-white transition-all shadow-sm"
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
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/60 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#006b5c] focus:ring-1 focus:ring-[#006b5c] focus:bg-white transition-all shadow-sm"
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
              <span className="text-[#006b5c] hover:underline cursor-pointer">
                Forgot Password?
              </span>
              <button 
                type="button" 
                onClick={onNavigateToRegister}
                className="text-slate-500 hover:text-[#006b5c] font-medium transition-colors"
                id="to-register-screen"
              >
                Register New Account / 建立帳號
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-400/80 font-medium">© 2026 SHU Space Finder</p>
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import { ShieldCheck, LogIn, LogOut, Sun, Moon } from 'lucide-react';

export function Header({ currentUser, onSignInOutClick, isDarkMode, onToggleTheme }) {
  return (
    <header className="bg-[#1C1914] dark:bg-ink-900 text-white shadow-xl border-b border-[#2A261F] dark:border-ink-800 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0066CC] to-[#004C99] flex items-center justify-center shadow-lg shadow-blue-900/40 border border-blue-400/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#FDFCFA] font-display">
                Expiry Tracker & Compliance
              </h1>
            </div>
          </div>

          {/* Right Area: Theme Toggle + Signed-in User Pill + Actions */}
          <div className="flex items-center space-x-3">

            {/* Dark / Light Mode Selector */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#3E382E] dark:border-ink-700 bg-[#2A261F] dark:bg-ink-800 text-[#EAE7DC] hover:bg-[#38332A] dark:hover:bg-ink-700 transition-all shadow-sm active:scale-95"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#2A261F] dark:bg-ink-800 border border-[#3E382E] dark:border-ink-700">
                <div className="w-7 h-7 rounded-full bg-[#0066CC] text-white font-bold text-xs flex items-center justify-center border border-blue-400/40 uppercase">
                  {currentUser.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase font-semibold tracking-wider text-[#96908A]">Signed In</span>
                  <span className="text-xs font-semibold text-[#FDFCFA] max-w-[180px] truncate" title={currentUser}>
                    {currentUser}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#96908A] px-2">
                Not signed in
              </div>
            )}

            {/* Sign In / Sign Out Toggle */}
            <button
              onClick={onSignInOutClick}
              className={`inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all shadow-sm active:scale-95 ${
                currentUser
                  ? 'text-[#EAE7DC] bg-[#2A261F] hover:bg-[#38332A] border-[#3E382E] dark:bg-ink-800 dark:hover:bg-ink-700 dark:border-ink-700'
                  : 'text-white bg-[#0066CC] hover:bg-[#0055AA] border-blue-400/30'
              }`}
            >
              {currentUser ? (
                <>
                  <LogOut className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                  Sign Out
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  Sign In
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}





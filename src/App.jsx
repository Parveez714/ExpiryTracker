import React, { useState, useMemo, useEffect } from 'react';
import { ConstellationBackground } from './components/ConstellationBackground';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { DataTable } from './components/DataTable';
import { fetchComplianceDocuments } from './services/api';
import { RefreshCw, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  // Purely API-driven data state (no mock/fake data fallback)
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Active signed-in email state (defaults to intern.01@embassyindia.com)
  const [currentUser, setCurrentUser] = useState('intern.01@embassyindia.com');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Dark / Light theme mode (defaults to light; persisted across sessions)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme_mode') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme_mode', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Fetch from API whenever currentUser changes
  const loadApiData = async () => {
    if (!currentUser) {
      setData([]);
      return;
    }
    setIsLoading(true);
    setApiError(null);
    try {
      const records = await fetchComplianceDocuments(currentUser);
      setData(records || []);
    } catch (err) {
      setApiError(err.message || 'Failed to fetch compliance documents from API');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApiData();
  }, [currentUser]);

  // Client-side Instant Memoized Filter (0ms latency as required by UI instructions)
  const filteredRecords = useMemo(() => {
    return data.filter(item => {
      // 1. Email filter based on signed-in user: match Owner OR Manager OR HOD
      if (currentUser) {
        const target = currentUser.trim().toLowerCase();
        const ownerMatch = item.Owner?.trim().toLowerCase() === target;
        const managerMatch = item.Manager?.trim().toLowerCase() === target;
        const hodMatch = item.HOD?.trim().toLowerCase() === target;
        
        if (!ownerMatch && !managerMatch && !hodMatch) {
          return false;
        }
      }

      // 2. Status dropdown filter
      if (statusFilter !== 'ALL') {
        const itemStatus = (item.Status || '').trim().toLowerCase();
        const filterStatus = statusFilter.trim().toLowerCase();
        if (filterStatus === 'pending renewal') {
          if (itemStatus !== 'pending renewal' && itemStatus !== 'pending') return false;
        } else if (itemStatus !== filterStatus) {
          return false;
        }
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const terms = searchQuery.trim().toLowerCase().split(/\s+/);
        const searchableFields = [
          item.DocumentNumber,
          item.Title,
          item.Category,
          item.Sub_Category,
          item.Owner,
          item.Manager,
          item.HOD,
          item.Status,
          item.IssuerAgency,
          item.Renewal_Frequency,
          item.When_To_Notify
        ].map(val => (val || '').toString().toLowerCase());

        const itemMatchesAllTerms = terms.every(term => 
          searchableFields.some(field => field.includes(term))
        );

        if (!itemMatchesAllTerms) {
          return false;
        }
      }

      return true;
    });
  }, [data, currentUser, statusFilter, searchQuery]);

  const handleSignInOutToggle = () => {
    if (currentUser) {
      setCurrentUser('');
    } else {
      setLoginEmailInput('');
      setIsSignInModalOpen(true);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmailInput.trim()) {
      setCurrentUser(loginEmailInput.trim());
      setIsSignInModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA] dark:bg-ink-950 text-[#221F1B] dark:text-ink-50 relative font-sans flex flex-col justify-between selection:bg-[#0066CC] selection:text-white transition-colors duration-200">

      {/* Background layer structure (Layer 0 & Layer 1) */}
      <ConstellationBackground isDarkMode={isDarkMode} />

      {/* Layer 2: Main Application Content */}
      <div className="relative z-10 flex-1 flex flex-col">

        {/* Dark Graphite Header */}
        <Header
          currentUser={currentUser}
          onSignInOutClick={handleSignInOutToggle}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        {/* Content Container (Optimized for full screen fitting) */}
        <main className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-4 w-full flex-1 flex flex-col justify-start">
          
          {/* API Error Notification */}
          {apiError && (
            <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <div>
                  <span className="font-bold">API Connection Error:</span> {apiError}
                </div>
              </div>
              <button
                onClick={loadApiData}
                className="px-2.5 py-1 bg-white dark:bg-ink-800 rounded-lg border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {/* Quick Stats Overview */}
          <StatsCards 
            records={filteredRecords} 
            selectedEmail={currentUser} 
          />

          {/* Main Tabular Display */}
          {isLoading ? (
            <div className="bg-white dark:bg-ink-900 rounded-2xl border border-[#DDD7C6] dark:border-ink-800 p-10 flex flex-col items-center justify-center text-center shadow-sm">
              <Loader2 className="w-7 h-7 text-[#0066CC] dark:text-white animate-spin mb-2" />
              <p className="text-xs font-bold text-[#221F1B] dark:text-white">Fetching live compliance records from API...</p>
              <p className="text-[11px] text-[#6B6459] dark:text-ink-400 mt-0.5">Requesting data for user: {currentUser}</p>
            </div>
          ) : (
            <DataTable
              records={filteredRecords}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              selectedEmail={currentUser}
            />
          )}

        </main>
      </div>

      {/* Sign In Modal */}
      {isSignInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-[#DDD7C6] dark:border-ink-800 max-w-md w-full p-6 relative">
            <h3 className="text-base font-bold text-[#221F1B] dark:text-white font-display mb-1">
              Sign In to Compliance Portal
            </h3>
            <p className="text-xs text-[#6B6459] dark:text-ink-400 mb-4">
              Enter your corporate email address to view documents where you are assigned as Owner, Manager, or HOD.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  Corporate Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. suresh.p@embassyindia.com"
                  value={loginEmailInput}
                  onChange={(e) => setLoginEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-800 rounded-xl text-[#221F1B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC] dark:focus:ring-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignInModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6B6459] dark:text-ink-400 hover:bg-[#EAE7DC] dark:hover:bg-ink-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0055AA] dark:bg-white dark:text-ink-950 dark:hover:bg-ink-50 rounded-xl shadow-md transition-all active:scale-95"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}



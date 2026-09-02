import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ArrowUpDown, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Building2,
  Tag,
  ChevronDown,
  Info
} from 'lucide-react';

export function DataTable({ 
  records, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  selectedEmail
}) {

  const [sortField, setSortField] = useState('IssuedDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRecords = [...records].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'active') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#70A597]/25 dark:bg-emerald-950/80 text-[#137458] dark:text-emerald-300 border border-[#70A597]/40 dark:border-emerald-700/60 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#137458] dark:bg-emerald-400 mr-1.5"></span>
          Active
        </span>
      );
    }

    if (s.includes('pending')) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 mr-1.5 animate-pulse"></span>
          Pending Renewal
        </span>
      );
    }
    if (s === 'expired') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700/60 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 mr-1.5"></span>
          Expired
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-[#3A3A3C] text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
        {status || 'Unknown'}
      </span>
    );
  };


  const renderEmailCell = (email, roleLabel) => {
    const isTarget = selectedEmail && selectedEmail !== 'ALL' && email?.toLowerCase() === selectedEmail.toLowerCase();
    return (
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-semibold text-[#96908A] tracking-wider">
          {roleLabel}
        </span>
        <span
          className={`text-xs font-medium truncate max-w-[190px] ${
            isTarget
              ? 'text-[#0066CC] dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40 px-1 py-0.5 rounded border border-blue-200/60 dark:border-blue-900 inline-block'
              : 'text-[#221F1B] dark:text-ink-50'
          }`}
          title={email}
        >
          {email || '—'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#232325] rounded-2xl border border-[#DDD7C6] dark:border-[#3A3A3C] shadow-sm relative z-10 overflow-hidden">

      {/* Table Toolbar & Search (Instant Filtering) */}
      <div className="p-4 sm:p-5 border-b border-[#EAE7DC] dark:border-[#3A3A3C] bg-[#FAF8F5]/80 dark:bg-[#141415]/80 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#96908A] dark:text-[#909093] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Title, Category, Document #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#141415] border border-[#DDD7C6] dark:border-[#3A3A3C] rounded-xl text-[#221F1B] dark:text-white placeholder-[#96908A] dark:placeholder-[#909093] focus:outline-none focus:ring-2 focus:ring-[#0066CC] dark:focus:ring-white focus:border-transparent transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-xs text-[#96908A] dark:text-[#909093] hover:text-[#221F1B] dark:hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Status Filter & Metrics */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#6B6459] dark:text-[#D6D6D8]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium bg-white dark:bg-[#141415] border border-[#DDD7C6] dark:border-[#3A3A3C] text-[#221F1B] dark:text-[#D6D6D8] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0066CC] dark:focus:ring-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Renewal">Pending Renewal</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="text-xs text-[#6B6459] dark:text-[#D6D6D8] bg-[#EAE7DC]/60 dark:bg-[#3A3A3C] px-3 py-1.5 rounded-xl border border-[#DDD7C6] dark:border-[#3A3A3C] font-medium">
            Showing <strong className="text-[#221F1B] dark:text-white font-bold">{sortedRecords.length}</strong> records
          </div>
        </div>

      </div>

      {/* Tabular Output - Compact Screen Fit */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] dark:bg-[#141415] border-b border-[#DDD7C6] dark:border-[#3A3A3C] text-[#6B6459] dark:text-[#909093] text-[10px] font-bold uppercase tracking-wider select-none">


              <th
                className="py-3 px-3 cursor-pointer hover:text-[#0066CC] dark:hover:text-white transition-colors"
                onClick={() => handleSort('Title')}
              >
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#0066CC]" />
                  <span>Document Details</span>
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-60" />
                </div>
              </th>

              <th
                className="py-3 px-3 cursor-pointer hover:text-[#0066CC] dark:hover:text-white transition-colors"
                onClick={() => handleSort('Category')}
              >
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#96908A]" />
                  <span>Category</span>
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-60" />
                </div>
              </th>

              <th className="py-3 px-3">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-[#96908A]" />
                  <span>Stakeholders</span>
                </div>
              </th>

              <th
                className="py-3 px-3 cursor-pointer hover:text-[#0066CC] dark:hover:text-white transition-colors"
                onClick={() => handleSort('Status')}
              >
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-60" />
                </div>
              </th>

              <th
                className="py-3 px-3 cursor-pointer hover:text-[#0066CC] dark:hover:text-white transition-colors text-right"
                onClick={() => handleSort('IssuedDate')}
              >
                <div className="flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3 text-[#96908A]" />
                  <span>Validity & Schedule</span>
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-60" />
                </div>
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-[#EAE7DC] dark:divide-[#3A3A3C] text-xs text-[#221F1B] dark:text-[#D6D6D8]">
            {sortedRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#96908A] dark:text-[#909093]">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <Info className="w-8 h-8 text-[#D8D2BF] dark:text-[#3A3A3C] mb-2" />
                    <p className="text-xs font-semibold text-[#6B6459] dark:text-[#909093]">No documents found</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedRecords.map((item, index) => (
                <tr
                  key={item.DocumentNumber || index}
                  className="hover:bg-[#FAF8F5] dark:hover:bg-[#3A3A3C]/40 transition-colors group"
                >
                  {/* Title & Document # */}
                  <td className="py-2.5 px-3 max-w-[220px]">
                    <div className="font-bold text-xs text-[#221F1B] dark:text-white truncate" title={item.Title}>
                      {item.Title || 'Untitled Document'}
                    </div>
                    <div className="text-[10px] text-[#96908A] dark:text-[#909093] font-mono mt-0.5 flex items-center gap-1.5 truncate">
                      <span>#{item.DocumentNumber}</span>
                      {item.IssuerAgency && (
                        <span className="text-[#6B6459] dark:text-[#909093] truncate font-sans">
                          • {item.IssuerAgency}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Category & Subcategory */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EAE7DC]/60 dark:bg-[#3A3A3C] text-[#221F1B] dark:text-[#F4F4F5] border border-[#DDD7C6] dark:border-[#525255] shadow-xs">
                      {item.Category || 'General'}
                    </span>
                    {item.Sub_Category && (
                      <div className="text-[10px] text-[#6B6459] dark:text-[#A1A1AA] mt-0.5 truncate max-w-[140px]" title={item.Sub_Category}>
                        {item.Sub_Category}
                      </div>
                    )}
                  </td>


                  {/* Stakeholders (Compact Stacked Owner / Mgr / HOD) */}
                  <td className="py-2 px-3 max-w-[210px]">
                    <div className="flex flex-col gap-0.5 text-[11px]">
                      {item.Owner && (
                        <div className="flex items-center gap-1 truncate text-[#221F1B] dark:text-white" title={`Owner: ${item.Owner}`}>
                          <span className="text-[9px] font-bold text-[#0066CC] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-1 rounded">OWN</span>
                          <span className="truncate">{item.Owner}</span>
                        </div>
                      )}
                      {item.Manager && (
                        <div className="flex items-center gap-1 truncate text-[#6B6459] dark:text-[#909093] text-[10px]" title={`Manager: ${item.Manager}`}>
                          <span className="text-[9px] font-semibold text-[#6B6459] dark:text-[#D6D6D8] bg-[#EAE7DC] dark:bg-[#3A3A3C] px-1 rounded">MGR</span>
                          <span className="truncate">{item.Manager}</span>
                        </div>
                      )}
                      {item.HOD && (
                        <div className="flex items-center gap-1 truncate text-[#873800] dark:text-amber-400 text-[10px]" title={`HOD: ${item.HOD}`}>
                          <span className="text-[9px] font-semibold text-[#873800] dark:text-amber-400 bg-[#FFF1B8]/60 dark:bg-amber-950/60 px-1 rounded">HOD</span>
                          <span className="truncate">{item.HOD}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getStatusBadge(item.Status)}
                  </td>

                  {/* Validity & Schedule */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-right">
                    <div className="text-[11px] font-semibold text-[#221F1B] dark:text-white">
                      {item.IssuedDate || '—'}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-[#6B6459] dark:text-[#909093] mt-0.5">
                      {item.Renewal_Frequency && (
                        <span>{item.Renewal_Frequency}</span>
                      )}
                      {item.When_To_Notify && (
                        <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1 py-0.2 rounded border border-amber-200/50 dark:border-amber-800/60">
                          {item.When_To_Notify}
                        </span>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


    </div>
  );
}




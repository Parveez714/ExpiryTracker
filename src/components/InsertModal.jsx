import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, PlusCircle, Loader2 } from 'lucide-react';


const CATEGORY_DATA = {
  "Legal & Compliance": [
    "Trade License",
    "Business Registration Certificate",
    "Shops & Establishment License",
    "RERA Registration",
    "Environmental Clearance Certificate",
    "Fire NOC",
    "Occupancy Certificate",
    "Completion Certificate",
    "Building Plan Approval",
    "Change of Land Use Certificate",
    "Layout Approval"
  ],
  "Insurance": [
    "Property Insurance Policy",
    "Public Liability Insurance",
    "Contractor's All Risk (CAR) Insurance",
    "Workmen's Compensation Policy",
    "Directors & Officers (D&O) Insurance",
    "Cyber Liability Insurance",
    "Marine / Transit Insurance",
    "Group Medical Insurance",
    "Keyman Insurance"
  ],
  "Financial & Regulatory": [
    "Bank Guarantee",
    "Performance Bond",
    "Letter of Credit",
    "GST Registration",
    "FEMA / RBI Approval",
    "SEBI Registration",
    "Debenture Trust Deed",
    "Escrow Agreement",
    "Loan Sanction Letter"
  ],
  "Contracts & Agreements": [
    "Lease Agreement",
    "Leave & License Agreement",
    "Sale Deed",
    "Development Agreement",
    "Joint Development Agreement (JDA)",
    "Maintenance Contract",
    "Service Level Agreement (SLA)",
    "Vendor / Supplier Contract",
    "AMC (Annual Maintenance Contract)",
    "Facility Management Agreement",
    "Brokerage / Agency Agreement"
  ],
  "Certifications & Audits": [
    "ISO Certification",
    "Energy Audit Certificate",
    "Structural Safety Certificate",
    "Electrical Safety Certificate",
    "Lift / Elevator Certification",
    "Green Building Certification (LEED/IGBC)",
    "BMS Certification",
    "Fire Safety Audit Certificate",
    "Pest Control Certificate"
  ],
  "Utility & Operational": [
    "Water Connection License",
    "Electricity / Power Supply Agreement",
    "Sewage / STP Approval",
    "Telecom / Internet Lease",
    "Generator / DG Set Approval",
    "Signage Permission",
    "Hoarding / Billboard License",
    "Parking Allocation Agreement"
  ],
  "HR & Statutory": [
    "PF Registration",
    "ESIC Registration",
    "Contract Labour License",
    "Professional Tax Registration",
    "Factory / Labour License",
    "POSH Compliance Certificate",
    "Apprenticeship Registration"
  ],
  "Tax & Statutory Filings": [
    "Property Tax Assessment",
    "Stamp Duty & Registration Document",
    "TDS Certificate",
    "Tax Exemption Certificate",
    "BBMP / Municipal Approval"
  ],
  "Project & Construction": [
    "Commencement Certificate",
    "Building Permit",
    "Structural Drawing Approval",
    "Soil Investigation Report",
    "Third Party Quality Audit Certificate",
    "Contractor License",
    "Subcontractor Agreement"
  ],
  "Intellectual Property": [
    "Trademark Registration",
    "Brand License Agreement",
    "Software License",
    "Domain / Digital Asset Registration"
  ],
  "Information Technology": [
    "License",
    "Certificate",
    "Domain",
    "Audit"
  ]
};

const WHEN_TO_NOTIFY_OPTIONS = [
  "1 week",
  "15 days",
  "1 month",
  "3 months",
  "6 months",
  "9 months",
  "1 year"
];

const RENEWAL_FREQUENCY_OPTIONS = [
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
  "5 Years"
];


export function InsertModal({ isOpen, onClose, onInsert, currentUser }) {
  const [formDoc, setFormDoc] = useState({
    DocumentNumber: '',
    Title: '',
    Category: '',
    Sub_Category: '',
    IssuerAgency: '',
    IssuedDate: new Date().toISOString().split('T')[0],
    When_To_Notify: '1 month',
    Owner: currentUser || '',
    Manager: '',
    HOD: '',
    IsRecurring: 'Yes',
    Status: 'Active',
    Renewal_Frequency: '1 Year',
    Project_Department: 'Asset Management'
  });


  // Automatically update and lock Owner to current signed in user
  React.useEffect(() => {
    if (isOpen) {
      setFormDoc(prev => ({
        ...prev,
        Owner: currentUser || ''
      }));
    }
  }, [isOpen, currentUser]);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormDoc({
      ...formDoc,
      Category: selectedCategory,
      Sub_Category: '' // reset subcategory on category change
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formDoc.DocumentNumber?.trim() || !formDoc.Title?.trim() || !formDoc.Category?.trim() || !formDoc.Sub_Category?.trim()) {
      setError('Document Number, Title, Category, and Subcategory are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onInsert) {
        await onInsert([formDoc]);
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Record creation failed:', err);
      setError(err.message || 'API request failed. Document was not created.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const availableSubcategories = formDoc.Category ? (CATEGORY_DATA[formDoc.Category] || []) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-[#DDD7C6] dark:border-ink-800 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">

        {/* Modal Header */}
        <div className="bg-[#1C1914] dark:bg-ink-950 px-6 py-4 flex items-center justify-between border-b border-[#2A261F] dark:border-ink-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#8A8A8A] via-[#D0D0D0] to-[#AFAFAF] text-[#1F1F1F] flex items-center justify-center shadow-md">
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                New Document Tracker
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#96908A] hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Interactive Form */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#FDFCFA] dark:bg-ink-900">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <div>Document tracker successfully created!</div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  Document Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DOC-00123"
                  value={formDoc.DocumentNumber}
                  onChange={(e) => setFormDoc({ ...formDoc, DocumentNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Provisional NOC (Sample)"
                  value={formDoc.Title}
                  onChange={(e) => setFormDoc({ ...formDoc, Title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formDoc.Category}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-[#0066CC] cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {Object.keys(CATEGORY_DATA).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Dropdown (Dependent on Category) */}
              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  Subcategory *
                </label>
                <select
                  required
                  disabled={!formDoc.Category}
                  value={formDoc.Sub_Category}
                  onChange={(e) => setFormDoc({ ...formDoc, Sub_Category: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-[#0066CC] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">
                    {formDoc.Category ? "Select Subcategory" : "Select Category first"}
                  </option>
                  {availableSubcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  Status
                </label>
                <select
                  value={formDoc.Status}
                  onChange={(e) => setFormDoc({ ...formDoc, Status: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                >
                  <option value="Active">Active</option>
                  <option value="Pending Renewal">Pending Renewal</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1 flex items-center justify-between">
                  <span>Owner Email *</span>
                  <span className="text-[10px] text-[#0066CC] dark:text-blue-400 font-semibold">Auto-captured (Signed-in User)</span>
                </label>
                <input
                  type="email"
                  required
                  readOnly
                  value={formDoc.Owner}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 font-medium cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  Manager Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. manager@embassyindia.com"
                  value={formDoc.Manager}
                  onChange={(e) => setFormDoc({ ...formDoc, Manager: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  HOD Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. hod@embassyindia.com"
                  value={formDoc.HOD}
                  onChange={(e) => setFormDoc({ ...formDoc, HOD: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  Renewal Frequency
                </label>
                <select
                  value={formDoc.Renewal_Frequency}
                  onChange={(e) => setFormDoc({ ...formDoc, Renewal_Frequency: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-[#0066CC] cursor-pointer"
                >
                  <option value="">Select Renewal Frequency</option>
                  {RENEWAL_FREQUENCY_OPTIONS.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  Issued Date
                </label>
                <input
                  type="date"
                  value={formDoc.IssuedDate}
                  onChange={(e) => setFormDoc({ ...formDoc, IssuedDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  Issuer Agency
                </label>
                <input
                  type="text"
                  placeholder="e.g. GENERIC TEST AUTHORITY"
                  value={formDoc.IssuerAgency}
                  onChange={(e) => setFormDoc({ ...formDoc, IssuerAgency: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

              {/* When To Notify Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  When to Notify
                </label>
                <select
                  value={formDoc.When_To_Notify}
                  onChange={(e) => setFormDoc({ ...formDoc, When_To_Notify: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-[#0066CC] cursor-pointer"
                >
                  <option value="">Select notification period</option>
                  {WHEN_TO_NOTIFY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#221F1B] dark:text-ink-200 mb-1">
                  Project Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Asset Management"
                  value={formDoc.Project_Department}
                  onChange={(e) => setFormDoc({ ...formDoc, Project_Department: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-ink-950 border border-[#DDD7C6] dark:border-ink-700 rounded-xl text-[#221F1B] dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE7DC] dark:border-ink-800 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-[#6B6459] dark:text-ink-400 hover:bg-[#EAE7DC] dark:hover:bg-ink-800 rounded-full transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-bold text-[#1F1F1F] rounded-full bg-gradient-to-r from-[#8A8A8A] via-[#D0D0D0] to-[#AFAFAF] hover:from-[#949494] hover:via-[#DCDCDC] hover:to-[#B8B8B8] border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.22),inset_0_1px_1px_rgba(255,255,255,0.6)] transition-all hover:shadow-[0_6px_16px_rgba(0,0,0,0.28)] active:scale-95 active:shadow-[0_2px_6px_rgba(0,0,0,0.3)] flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1F1F1F]" />
                    Creating Tracker...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5 text-[#1F1F1F] stroke-[2.5]" />
                    Add Document Tracker
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}




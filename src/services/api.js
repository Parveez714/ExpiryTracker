/**
 * API Service for Expiry Tracker & Compliance
 * Handles fetching documents and creating new document trackers
 */

const API_CONFIG = {
  fetchUrl: import.meta.env.VITE_API_URL || '',
  createUrl: import.meta.env.VITE_CREATE_API_URL || import.meta.env.VITE_API_URL || '',
  authorizationKey: import.meta.env.VITE_AUTHORIZATION_KEY || '',
};

/**
 * Fetch compliance documents for a given email address directly from external API
 */
export async function fetchComplianceDocuments(email = '') {
  if (!API_CONFIG.fetchUrl || !email) {
    return [];
  }

  const payload = {
    Authorization_Key: API_CONFIG.authorizationKey,
    Email: email.trim()
  };

  try {
    const response = await fetch(API_CONFIG.fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API returned HTTP ${response.status}: ${response.statusText}`);
    }

    let data = await response.json();
    
    // If returned as stringified JSON
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse string response as JSON', e);
      }
    }

    // Extract list
    let list = [];
    if (Array.isArray(data)) {
      list = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) list = data.data;
      else if (Array.isArray(data.records)) list = data.records;
      else if (Array.isArray(data.value)) list = data.value;
      else if (Array.isArray(data.body)) {
        list = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      } else {
        list = [data];
      }
    }

    // Deduplicate records by DocumentNumber (or Title if DocumentNumber is absent)
    const seen = new Set();
    const uniqueRecords = [];
    for (const item of list) {
      if (!item || typeof item !== 'object') continue;
      const key = String(item.DocumentNumber || item.Title || JSON.stringify(item)).trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueRecords.push(item);
      }
    }

    return uniqueRecords;
  } catch (error) {
    console.error('[API Service] Fetch failed:', error);
    throw error;
  }
}



/**
 * Insert / Create compliance documents by sending exact required array schema to VITE_CREATE_API_URL
 */
export async function insertComplianceDocuments(documents) {
  if (!API_CONFIG.createUrl) {
    return { success: true, localOnly: true };
  }

  // Ensure documents is an array conforming to the schema
  const formattedDocuments = (Array.isArray(documents) ? documents : [documents]).map(doc => ({
    DocumentNumber: String(doc.DocumentNumber || ''),
    Title: String(doc.Title || ''),
    Category: String(doc.Category || ''),
    Sub_Category: String(doc.Sub_Category || ''),
    IssuerAgency: String(doc.IssuerAgency || ''),
    IssuedDate: String(doc.IssuedDate || ''),
    When_To_Notify: String(doc.When_To_Notify || ''),
    Owner: String(doc.Owner || ''),
    Manager: String(doc.Manager || ''),
    HOD: String(doc.HOD || ''),
    IsRecurring: String(doc.IsRecurring || 'No'),
    Status: String(doc.Status || 'Active'),
    Renewal_Frequency: String(doc.Renewal_Frequency || ''),
    Project_Department: String(doc.Project_Department || '')
  }));

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization_Key': API_CONFIG.authorizationKey || 'RXhwaXJhdGlvbl9BUEk6RTFAMjAyNiM='
  };

  try {
    const response = await fetch(API_CONFIG.createUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(formattedDocuments),
    });


    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Create API returned HTTP ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
    }

    let result = null;
    try {
      result = await response.json();
    } catch (e) {
      result = { success: true };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('[API Service] Insert failed:', error);
    throw error;
  }
}


export { API_CONFIG };





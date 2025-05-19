export const formatPhoneDisplay = (phone) => {
  if (!phone) return '-';
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // UK numbers: +44XXXXXXXXXX
  if (cleaned.startsWith('+44')) {
    const areaAndNumber = cleaned.substring(3);
    
    // UK mobile numbers (start with 7)
    if (/^7\d+/.test(areaAndNumber)) {
      // Format: +44-7XXX-XXX-XXX
      return `+44-${areaAndNumber.substring(0, 4)}-${areaAndNumber.substring(4, 7)}-${areaAndNumber.substring(7)}`;
    }
    // UK landline numbers (start with 1,2,3, etc.)
    else {
      // London numbers (20) get different formatting
      if (areaAndNumber.startsWith('20')) {
        // Format: +44-20-XXXX-XXXX
        return `+44-20-${areaAndNumber.substring(2, 6)}-${areaAndNumber.substring(6)}`;
      }
      // Other landline numbers
      else {
        // Format: +44-XXX-XXX-XXXX
        return `+44-${areaAndNumber.substring(0, 3)}-${areaAndNumber.substring(3, 6)}-${areaAndNumber.substring(6)}`;
      }
    }
  }
  
  // Return original if doesn't match UK format
  return phone;
};


export const formatDateDisplay = (date) => {
  if (!date) return '-';
  // Add your date formatting logic here
  return date;
};


export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  // Handles both "YYYY-MM-DD" and "DD/MM/YYYY"
  if (dateStr.includes('/')) return dateStr;
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB');
};


// TODO: I may use this code later if data would exactly same for Instructions and Invoices table

// export const mapServeToTableRow = (serve) => ({
//   wpr: serve.id,
//   owner: serve.applicant_name || serve.client_id || 'N/A',
//   serve: serve.title,
//   type: serve.priority ? serve.priority.charAt(0).toUpperCase() + serve.priority.slice(1) : 'N/A',
//   court: serve.issuing_court,
//   recipient_name: serve.recipient_name, // Changed
//   recipient_address: serve.recipient_address, // Changed
//   date_of_submission: formatDate(serve.date_of_submission) !== 'N/A' ? formatDate(serve.date_of_submission) : formatDate(serve.created_at), // Changed
//   deadline: serve.deadline,
//   status: serve.status,
// });


export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};


export const formatDocumentTypesForDisplay = (types, reason) => {
  const filteredDocumentTypes = types?.filter(
    type => type !== 'Other (Please Specify)'
  );

  const base = filteredDocumentTypes?.join(', ') || '';
  return reason ? `${base}${base ? ', ' : ''}Other (${reason})` : base;
};


/**
 * Get deadline date based on filter and format
 * @param {string} filter - time period filter (weekly, monthly, etc.)
 * @param {string} format - desired output format 
 *        (YYYY-MM-DD, DD-MM-YYYY, YYYY/MM/DD, DD/MM/YYYY)
 * @returns {string} - formatted deadline date
 */
export const getDeadlineDate = (filter, format = 'YYYY-MM-DD') => {
    const today = new Date();
    const result = new Date(today); // Create a copy to avoid mutating original date
    
    // Calculate deadline date based on filter
    switch(filter.toLowerCase()) {
        case 'weekly':
            result.setDate(result.getDate() + 7);
            break;
        case 'biweekly':
            result.setDate(result.getDate() + 14);
            break;
        case 'monthly':
            result.setMonth(result.getMonth() + 1);
            break;
        case 'quarterly':
            result.setMonth(result.getMonth() + 3);
            break;
        case 'annually':
            result.setFullYear(result.getFullYear() + 1);
            break;
        case 'custom':
            return null; // Handle custom dates separately
        default: // monthly as fallback
            result.setMonth(result.getMonth() + 1);
    }
    
    // Format date according to requested format
    const pad = num => String(num).padStart(2, '0');
    const day = pad(result.getDate());
    const month = pad(result.getMonth() + 1);
    const year = result.getFullYear();
    
    switch(format.toUpperCase()) {
        case 'DD-MM-YYYY':
            return `${day}-${month}-${year}`;
        case 'YYYY/MM/DD':
            return `${year}/${month}/${day}`;
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'YYYY-MM-DD':
        default:
            return `${year}-${month}-${day}`;
    }
};


/**
 * Get date range based on filter and format
 * @param {string} filter - time period filter (weekly, monthly, etc.)
 * @param {string} format - desired output format 
 *        (YYYY-MM-DD, DD-MM-YYYY, YYYY/MM/DD, DD/MM/YYYY)
 * @returns {object} - { from_date, to_date } in requested format
 */
export const getDateRange = (filter, format = 'DD/MM/YYYY') => {
    const today = new Date();
    const toDate = new Date(today);
    const fromDate = new Date(today);

    // Reset time to avoid timezone issues
    toDate.setHours(0, 0, 0, 0);
    fromDate.setHours(0, 0, 0, 0);

    // Calculate past date range
    switch(filter.toLowerCase()) {
        case 'today':
            // No change needed (from = to = today)
            break;
        case 'weekly':
            fromDate.setDate(fromDate.getDate() - 7); // Last 7 days
            break;
        case 'biweekly':
            fromDate.setDate(fromDate.getDate() - 14); // Last 14 days
            break;
        case 'monthly':
            fromDate.setMonth(fromDate.getMonth() - 1); // Last month
            break;
        case 'quarterly':
            fromDate.setMonth(fromDate.getMonth() - 3); // Last 3 months
            break;
        case 'annually':
            fromDate.setFullYear(fromDate.getFullYear() - 1); // Last year
            break;
        default:
            console.warn(`Unknown filter "${filter}". Defaulting to "monthly".`);
            fromDate.setMonth(fromDate.getMonth() - 1);
    }

    // Format dates (supports DD/MM/YYYY, YYYY-MM-DD, etc.)
    const formatDate = (date) => {
        const pad = num => String(num).padStart(2, '0');
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        
        switch(format.toLowerCase()) {
            case 'dd-mm-yyyy':
                return `${day}-${month}-${year}`;
            case 'yyyy/mm/dd':
                return `${year}/${month}/${day}`;
            case 'dd/mm/yyyy':
                return `${day}/${month}/${year}`;
            case 'yyyy-mm-dd':
                return `${year}-${month}-${day}`;
            default:
                console.warn(`Unknown format "${format}". Using "DD/MM/YYYY".`);
                return `${day}/${month}/${year}`;
        }
    };

    return {
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate) // Today (or adjust if needed)
    };
};

/**
 * Finds the label of a filter option by its value
 * @param {Array} options - Array of filter options (must have `value` and `label` properties)
 * @param {string|number} value - Value to search for
 * @returns {string} The matching label or empty string if not found
 */
export const getFilterLabel = (options, value) => {
  const foundOption = options.find(op => op.value === value);
  return foundOption?.label || '';
};
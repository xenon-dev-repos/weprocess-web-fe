import { Images } from "../assets/images";

export const formatPhoneDisplay = (phone) => {
  if (!phone) return '-'; 
  
  // Remove all non-digit characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Check for +44 UK numbers
  if (cleaned.startsWith('+44')) {
    const number = cleaned.slice(3).slice(0, 10); // Extract 10 digits after +44

    // Apply consistent formatting: 4 + 3 + 3
    if (number.length <= 4) {
      return `+44 ${number}`;
    } else if (number.length <= 7) {
      return `+44 ${number.slice(0, 4)} ${number.slice(4)}`;
    } else {
      return `+44 ${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(7)}`;
    }
  }

  // Return original if not a UK number
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


export const formatServiceType = (input) => {
  if (!input) return '';

  const cleaned = input.replace(/[_-]+/g, ' ').toLowerCase(); // Normalize and lowercase
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);  // Rejoin
};


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
        case 'yearly':
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
        case 'yearly':
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

export function formatNotificationText(title, message) {
  // Simple implementation - it may need to be adjusted based on your actual data structure
  const importantParts = [...title.split(' '), ...message.split(' ').filter(word => 
    word.startsWith('#') || word === 'accepted' || word === 'rejected'
  )];
  
  return (
    <>
      {`${title} ${message}`.split(' ').map((word, i) => (
        <span key={i} style={{ 
          fontFamily: importantParts.includes(word) ? 'Inter' : 'Manrope',
          fontWeight: importantParts.includes(word) ? 500 : 400 
        }}>
          {word}{' '}
        </span>
      ))}
    </>
  );
}

export function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${monthNames[date.getMonth()]}${date.getFullYear() !== now.getFullYear() ? ' ' + date.getFullYear() : ''}`;
}

export const formatLastSeen = (timestamp) => {
  if (!timestamp) return 'recently';
  
  const now = new Date();
  const lastSeen = new Date(timestamp);
  const diffMinutes = Math.floor((now - lastSeen) / (1000 * 60));
  
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
  return `${Math.floor(diffMinutes / 1440)} days ago`;
};

export const getFileTypeIcon = (type) => {
  if (!type || typeof type !== 'string') return Images.instructions.fileIcon;

  const fileExtension = type.includes('/')
    ? type.split('/')[1]
    : type.split('.').pop().toLowerCase();

  switch (fileExtension) {
    case 'pdf':
      return Images.instructions.pdfIcon;
    case 'msword':
    case 'doc':
    case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'docx':
      return Images.instructions.wordIcon;
    case 'jpeg':
    case 'jpg':
    case 'png':
      return Images.instructions.imageIcon;
    default:
      return Images.instructions.fileIcon;
  }
};

export const getStatusColors = (statusValue) => {
  const status = String(statusValue).toLowerCase().trim();

  switch (status) {
    case '1st attempt':
    case 'new':
    case 'paid':
    case '1':
      return { background: '#D4F8D3', color: '#008000' };
    case '2nd attempt':
    case 'pending':
    case 'un_paid':
    case '0':
      return { background: '#FFF0BB', color: '#E78E00' };
    case '3rd attempt':
      return { background: '#FFE5E5', color: '#B71C1C' };
    case 'in transit':
      return { background: '#F2F2F2', color: '#6585FE' };
    case 'completed':
      return { background: '#8B5CF6', color: '#ffffff' };
    case 'active':
      return { background: '#FF5B5B', color: '#ffffff' };
    case 'on_hold':
      return { background: '#6B7280', color: '#ffffff' };
    default:
      return { background: '#e5e7eb', color: '#374151' };
  }
};



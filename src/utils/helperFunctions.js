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


export const getDeadlineDate = (filter) => {
    const today = new Date();
    const result = new Date(today); // Create a copy to avoid mutating original date
    
    switch(filter) {
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
        default: // monthly as fallback
            result.setMonth(result.getMonth() + 1);
    }
    
    return result.toISOString().split('T')[0]; // Format as yyyy-mm-dd
};

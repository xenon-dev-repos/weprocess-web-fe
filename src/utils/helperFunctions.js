  export const formatPhoneDisplay = (phone) => {
    if (!phone) return '-';
    // Add your phone formatting logic here
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
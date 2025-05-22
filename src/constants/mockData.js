export const instructionsTableData = [
  { wpr: 5102, owner: "Andrew Garfield", serve: "Serve to Alex", court: "Court A", type: "Urgent", deadline: "11/11/2022", status: "1st attempt" },
  { wpr: 6650, owner: "Halen Millar", serve: "Type B serve", court: "Court B", type: "Medium", deadline: "11/11/2022", status: "2nd attempt" },
  { wpr: 7896, owner: "Zayn Malik", serve: "Serve XYZ", court: "Court A", type: "Standard", deadline: "11/11/2022", status: "3rd attempt" },
  { wpr: 179, owner: "Harry Styles", serve: "Serve to Amanda", court: "Court E", type: "Urgent", deadline: "11/11/2022", status: "In Transit" },
  { wpr: 7896, owner: "Andy Samberg", serve: "Brittney's Case", court: "Court A", type: "Standard", deadline: "11/11/2022", status: "3rd attempt" },
  { wpr: 2021, owner: "Tom Holland", serve: "Serve to Peter", court: "Court B", type: "Medium", deadline: "11/11/2022", status: "2nd attempt" },
  { wpr: 3382, owner: "Emma Stone", serve: "Serve to Gwen", court: "Court C", type: "Standard", deadline: "11/11/2022", status: "1st attempt" },
  { wpr: 4290, owner: "Chris Evans", serve: "Serve to Steve", court: "Court D", type: "Urgent", deadline: "11/11/2022", status: "In Transit" },
  { wpr: 5501, owner: "Scarlett Johansson", serve: "Serve to Natasha", court: "Court E", type: "Medium", deadline: "11/11/2022", status: "3rd attempt" },
  { wpr: 6230, owner: "Robert Downey Jr.", serve: "Serve to Tony", court: "Court A", type: "Standard", deadline: "11/11/2022", status: "2nd attempt" },
];

export const statusMockData = {
  onHold: 35,
  inProgress: 15,
  completed: 50,
};

export const InstructionsMockData = {
  january: { totalRequests: 955 },
  february: { totalRequests: 1009 },
  march: { totalRequests: 552 },
};

// mockNotifications.js
export const mockNotifications = {
  data: [
    {
      id: "15712712-ab68-42a1-899f-d43332179b13",
      title: "Invoice Paid",
      message: "Invoice INV-00001 has been paid.",
      related_id: 1,
      type: "invoice_paid",
      read: false,
      timestamp: new Date(Date.now() - 10000).toISOString() // 10 seconds ago
    },
    {
      id: "c7b09cd7-ef0b-47a7-9075-31c19b7112f1",
      title: "New Serve Created",
      message: "A new serve has been created: Serve Title",
      related_id: 11,
      type: "serve_created",
      read: true,
      timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: "d3b09cd7-ef0b-47a7-9075-31c19b7112f2",
      title: "Payment Failed",
      message: "Your payment for invoice INV-00002 failed",
      related_id: 2,
      type: "payment_failed",
      read: false,
      timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: "e4b09cd7-ef0b-47a7-9075-31c19b7112f3",
      title: "New Message",
      message: "You have a new message from John Doe",
      related_id: 15,
      type: "new_message",
      read: false,
      timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
      id: "f5b09cd7-ef0b-47a7-9075-31c19b7112f4",
      title: "Account Updated",
      message: "Your account settings have been updated",
      related_id: null,
      type: "account_updated",
      read: true,
      timestamp: new Date(Date.now() - 259200000).toISOString() // 3 days ago
    },
    {
      id: "g6b09cd7-ef0b-47a7-9075-31c19b7112f5",
      title: "Subscription Renewal",
      message: "Your subscription will renew in 7 days",
      related_id: 3,
      type: "subscription_renewal",
      read: false,
      timestamp: new Date(Date.now() - 604800000).toISOString() // 7 days ago
    },
    {
      id: "h7b09cd7-ef0b-47a7-9075-31c19b7112f6",
      title: "New Feature",
      message: "Check out our new dashboard features!",
      related_id: null,
      type: "new_feature",
      read: true,
      timestamp: new Date(Date.now() - 1209600000).toISOString() // 14 days ago
    },
    {
      id: "i8b09cd7-ef0b-47a7-9075-31c19b7112f7",
      title: "Support Ticket Closed",
      message: "Your support ticket #12345 has been resolved",
      related_id: 12345,
      type: "ticket_closed",
      read: false,
      timestamp: new Date(Date.now() - 2592000000).toISOString() // 30 days ago
    },
    {
      id: "j9b09cd7-ef0b-47a7-9075-31c19b7112f8",
      title: "Monthly Report",
      message: "Your monthly usage report is ready",
      related_id: 4,
      type: "monthly_report",
      read: true,
      timestamp: new Date(Date.now() - 2678400000).toISOString() // 31 days ago
    },
    {
      id: "k0b09cd7-ef0b-47a7-9075-31c19b7112f9",
      title: "System Maintenance",
      message: "Scheduled maintenance this weekend",
      related_id: null,
      type: "system_maintenance",
      read: false,
      timestamp: new Date(Date.now() - 5184000000).toISOString() // 60 days ago
    }
  ],
  pagination: {
    current_page: 1,
    last_page: 3,
    per_page: 10,
    total: 25
  }
};

// Additional pages of mock data
export const getMockNotifications = (page = 1, perPage = 10) => {
  // Clone the data to avoid mutation
  const allData = JSON.parse(JSON.stringify(mockNotifications.data));
  
  // For testing pagination, we'll simulate having more data
  if (page === 2) {
    return {
      data: [
        {
          id: "l1b09cd7-ef0b-47a7-9075-31c19b7112f0",
          title: "New Login",
          message: "New login detected from Chrome on Windows",
          related_id: null,
          type: "new_login",
          read: false,
          timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        // Add more items as needed
      ],
      pagination: {
        current_page: 2,
        last_page: 3,
        per_page: 5,
        total: 25
      }
    };
  } else if (page === 3) {
    return {
      data: [
        {
          id: "m2b09cd7-ef0b-47a7-9075-31c19b7112f1",
          title: "Password Changed",
          message: "Your password was successfully changed",
          related_id: null,
          type: "password_changed",
          read: true,
          timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        // Add more items as needed
      ],
      pagination: {
        current_page: 3,
        last_page: 3,
        per_page: 5,
        total: 25
      }
    };
  }
  
  // Return first page by default
  return {
    data: allData.slice(0, perPage),
    pagination: {
      current_page: 1,
      last_page: 3,
      per_page: 5,
      total: 25
    }
  };
};
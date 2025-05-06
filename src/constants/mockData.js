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

export const statusData = {
  onHold: 35,
  inProgress: 15,
  completed: 50,
};

export const monthlyInstructionsData = {
  january: { newRequests: 455, inProgress: 300, completed: 200 },
  february: { newRequests: 409, inProgress: 350, completed: 250 },
  march: { newRequests: 222, inProgress: 180, completed: 150 },
};

export const mockConversations = [
  {
    id: '1',
    title: 'Test Client',
    avatar: null,
    last_message: 'Yes I am good. What about you?',
    last_message_time: '2023-05-06 00:45:01',
    unread_count: 0
  },
  {
    id: '2',
    title: 'Test Firm',
    avatar: null,
    last_message: 'Hi, Are you fine?',
    last_message_time: '2023-05-06 00:44:21',
    unread_count: 2
  }
];

export const mockMessages = {
  '1': [
    {
      id: 'msg-1',
      content: 'Hi, How are you?',
      sender_id: 'currentUser',
      created_at: '2023-05-06 00:44:11',
      attachments: []
    },
    {
      id: 'msg-3',
      content: 'Yes I am good. What about you?',
      sender_id: 'other',
      created_at: '2023-05-06 00:45:01',
      attachments: []
    }
  ],
  '2': [
    {
      id: 'msg-2',
      content: 'Hi, Are you fine?',
      sender_id: 'currentUser',
      created_at: '2023-05-06 00:44:21',
      attachments: []
    }
  ]
};

// Mock data for chat sessions
export const getMockChatSessions = () => {
  return {
    data: [
      {
        chat_session_id: 1,
        participant: {
          id: 5,
          name: "Test Client",
          type: "client",
          profile_picture_url: null
        },
        latest_message: {
          text: "Yes I am good. What about you?",
          media_url: null,
          timestamp: "2023-05-06 00:45:01"
        },
        unread_count: 0
      },
      {
        chat_session_id: 2,
        participant: {
          id: 1,
          name: "Test Firm",
          type: "client",
          profile_picture_url: null
        },
        latest_message: {
          text: "Hi, Are you fine?",
          media_url: null,
          timestamp: "2023-05-06 00:44:21"
        },
        unread_count: 2
      }
    ],
    pagination: {
      total: 2,
      current_page: 1,
      last_page: 1
    }
  };
};

// Mock data for chat messages
export const getMockChatMessages = (sessionId) => {
  const messages = {
    1: [
      {
        id: 1,
        text: "Hi, How are you?",
        media_url: null,
        mime_type: null,
        timestamp: "2023-05-06 00:44:11",
        is_sent: true,
        is_read: 0
      },
      {
        id: 3,
        text: "Yes I am good. What about you?",
        media_url: null,
        mime_type: null,
        timestamp: "2023-05-06 00:45:01",
        is_sent: false,
        is_read: 1
      }
    ],
    2: [
      {
        id: 2,
        text: "Hi, Are you fine?",
        media_url: null,
        mime_type: null,
        timestamp: "2023-05-06 00:44:21",
        is_sent: true,
        is_read: 0
      }
    ]
  };

  return {
    success: true,
    data: messages[sessionId] || [],
    pagination: {
      total: messages[sessionId]?.length || 0,
      current_page: 1,
      per_page: 10,
      last_page: 1,
      has_more: false
    }
  };
};

// Mock sending a message
export const sendMockMessage = (text) => {
  return {
    success: true,
    chat_session_id: 1
  };
}; 
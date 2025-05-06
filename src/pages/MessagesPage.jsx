import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import ChatList from '../components/chat/ChatList';
import ChatMessages from '../components/chat/ChatMessages';
import { useToast } from '../services/ToastService';
import { useNavigation } from '../hooks/useNavigation';

// Import React for error boundary
import React from 'react';

// Error boundary component for handling errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>The chat component encountered an error. Please try again later.</ErrorMessage>
          <ErrorButton onClick={() => window.location.reload()}>Refresh Page</ErrorButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const MessagesPage = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const messageIdCounter = useRef(0);
  const isMounted = useRef(true);
  const initialDataLoaded = useRef(false);
  const abortController = useRef(new AbortController());
  const timeoutRef = useRef(null);
  const toast = useToast();
  const { navigateToDashboard } = useNavigation();
  // We're using direct mock data instead of API service
  // const apiService = createApiService(toast);

  // Cleanup on unmount
  useEffect(() => {
    // Set mounted flag to true on mount
    isMounted.current = true;
    
    return () => {
      console.log('Component unmounting, cleaning up...');
      isMounted.current = false;
      abortController.current.abort();
      
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Simplified mock data for immediate display
  const MOCK_CHAT_SESSIONS = [
    {
      id: "1",
      title: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      last_message: "Looking forward to our meeting tomorrow!",
      last_message_time: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      unread_count: 2,
      _raw: {
        participant_id: "101",
        participant_type: "client"
      }
    },
    {
      id: "2",
      title: "Emma Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      last_message: "I've sent you the documents you requested.",
      last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      unread_count: 0,
      _raw: {
        participant_id: "102",
        participant_type: "client"
      }
    },
    {
      id: "3",
      title: "Alex Williams",
      avatar: null,
      last_message: "Thanks for your help with the tax issue!",
      last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      unread_count: 1,
      _raw: {
        participant_id: "103",
        participant_type: "client"
      }
    }
  ];
  
  const MOCK_MESSAGES = {
    "1": [
      {
        id: "msg-101",
        content: "Hello, I have a question about my account",
        sender_id: "other",
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        attachments: []
      },
      {
        id: "msg-102",
        content: "Sure, I'd be happy to help. What's your question?",
        sender_id: "currentUser",
        created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
        attachments: []
      },
      {
        id: "msg-103",
        content: "I'm wondering about the status of my invoice #12345",
        sender_id: "other",
        created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
        attachments: []
      },
      {
        id: "msg-104",
        content: "Let me check that for you right away",
        sender_id: "currentUser",
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        attachments: []
      },
      {
        id: "msg-105",
        content: "Looking forward to our meeting tomorrow!",
        sender_id: "other",
        created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        attachments: []
      }
    ],
    "2": [
      {
        id: "msg-201",
        content: "Hi, do you have time to review the contract?",
        sender_id: "other",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        attachments: []
      },
      {
        id: "msg-202",
        content: "Yes, I can look at it this afternoon",
        sender_id: "currentUser",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        attachments: []
      },
      {
        id: "msg-203",
        content: "Great, here are the documents",
        sender_id: "other",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString(),
        attachments: ["contract.pdf"]
      },
      {
        id: "msg-204",
        content: "I've sent you the documents you requested.",
        sender_id: "other",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        attachments: []
      }
    ],
    "3": [
      {
        id: "msg-301",
        content: "Hello, I need help with a tax issue",
        sender_id: "other",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
        attachments: []
      },
      {
        id: "msg-302",
        content: "Could you provide more details?",
        sender_id: "currentUser",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 29).toISOString(),
        attachments: []
      },
      {
        id: "msg-303",
        content: "I received a notice from the IRS about missing documentation",
        sender_id: "other",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
        attachments: ["notice.jpg"]
      },
      {
        id: "msg-304",
        content: "I'll take care of this for you",
        sender_id: "currentUser",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        attachments: []
      },
      {
        id: "msg-305",
        content: "Thanks for your help with the tax issue!",
        sender_id: "other",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        attachments: []
      }
    ]
  };

  // Initialize data with mock data immediately to avoid loading state
  useEffect(() => {
    if (initialDataLoaded.current) return;
    initialDataLoaded.current = true;
    
    try {
      // Set mock data immediately
      setChatSessions(MOCK_CHAT_SESSIONS);
      
      // Automatically select the first chat session
      const firstSession = MOCK_CHAT_SESSIONS[0];
      setSelectedSession(firstSession);
      setMessages(MOCK_MESSAGES[firstSession.id]);
      
      setLoading(false);
      
      console.log('Initialized with mock data');
    } catch (err) {
      console.error('Error initializing data:', err);
      setError(err);
    }
  }, []);

  // Fetch messages for a specific session (simplified to use local mock data)
  const fetchMessages = useCallback((sessionId) => {
    if (!sessionId || !isMounted.current) return;
    
    setMessagesLoading(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Simulate a short delay to show loading state
    timeoutRef.current = setTimeout(() => {
      if (!isMounted.current) return;
      
      try {
        const messageData = MOCK_MESSAGES[sessionId] || [];
        console.log(`Fetched ${messageData.length} messages for session ${sessionId}`);
        
        if (isMounted.current) {
          setMessages(messageData);
          setMessagesLoading(false);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        if (isMounted.current) {
          setError(err);
          setMessagesLoading(false);
        }
      }
    }, 300);
  }, []);

  // Send a message (simplified to use local mock data)
  const handleSendMessage = useCallback((text, attachments = []) => {
    if (!selectedSession || !isMounted.current) return;
    
    try {
      // Create a unique temporary ID for the message
      const tempId = `msg-new-${Date.now()}-${messageIdCounter.current++}`;
      const newMessage = {
        id: tempId,
        content: text,
        sender_id: 'currentUser',
        created_at: new Date().toISOString(),
        attachments: attachments.map(file => file.name || '')
      };
      
      console.log('Sending message:', text);
      
      // Add message to UI
      setMessages(prev => [...prev, newMessage]);
      
      // Update session preview
      setChatSessions(prev => prev.map(session => 
        session.id === selectedSession.id 
          ? {
              ...session,
              last_message: text,
              last_message_time: new Date().toISOString()
            }
          : session
      ));
      
      // Also update the mock data for future reference
      if (MOCK_MESSAGES[selectedSession.id]) {
        MOCK_MESSAGES[selectedSession.id].push(newMessage);
      }
      
      console.log('Message sent successfully');
    } catch (err) {
      console.error('Error sending message:', err);
      if (isMounted.current) {
        setError(err);
        toast.showError('Failed to send message. Please try again.');
      }
    }
  }, [selectedSession, messageIdCounter, toast]);

  // Handle session selection
  const handleSelectSession = useCallback((session) => {
    if (!session || !isMounted.current) return;
    
    console.log('Selecting session:', session.id);
    setSelectedSession(session);
    fetchMessages(session.id);
  }, [fetchMessages]);

  // Toggle chat visibility function - now just used to close the chat
  const toggleChat = useCallback(() => {
    if (!isMounted.current) return;
    // Navigate back to dashboard when closing chat
    navigateToDashboard();
  }, [navigateToDashboard]);

  // Render error state if needed
  if (error) {
    return (
      <MainLayout 
        title="Messages" 
        showMessagesPageHeader={true}
        filterButtons={[
          { id: 'all', label: 'All', dotColor: 'gray' },
          { id: 'unread', label: 'Unread', dotColor: 'green' },
          { id: 'archived', label: 'Archived', dotColor: 'red' }
        ]}
        onToggleChat={toggleChat}
        totalUnreadCount={0}
      >
        <PageContent>
          <ErrorContainer>
            <ErrorTitle>Unable to load messages</ErrorTitle>
            <ErrorMessage>There was a problem loading your messages. Please try again later.</ErrorMessage>
            <ErrorButton onClick={() => window.location.reload()}>Refresh Page</ErrorButton>
          </ErrorContainer>
        </PageContent>
      </MainLayout>
    );
  }

  return (
    <MainLayout messagesLayout={true}>
      <PageContent>
        <ErrorBoundary>
          <ChatContainer>
            <ChatList 
              conversations={chatSessions}
              selectedConversation={selectedSession}
              onSelectConversation={handleSelectSession}
              loading={loading}
            />
            {selectedSession && (
              <ChatMessages 
                conversation={selectedSession}
                messages={messages}
                onSendMessage={handleSendMessage}
                loading={messagesLoading}
              />
            )}
            <CloseButton onClick={toggleChat}>×</CloseButton>
          </ChatContainer>
        </ErrorBoundary>
      </PageContent>
    </MainLayout>
  );
};

const PageContent = styled.div`
  max-width: 1728px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 0;
  box-sizing: border-box;
  position: relative;
`;

const ChatContainer = styled.div`
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: 100vh;
  width: 100%;
  position: relative;
  max-height: calc(100vh - 250px);
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: 90vh;
    max-height: calc(100vh - 200px);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #333;
  cursor: pointer;
  z-index: 20;
  
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 48px;
  max-width: 500px;
  margin: 0 auto;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const ErrorTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  color: #d32f2f;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
`;

const ErrorButton = styled.button`
  background-color: #075E54;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #054C44;
  }
`;

export default MessagesPage; 
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { createApiService } from '../services/ApiService';
import { useToast } from '../contexts/ToastContext';
import ChatList from '../components/chat/ChatList';
import ChatMessages from '../components/chat/ChatMessages';
import ApiTesterPanel from '../components/ApiTesterPanel';

const ChatPage = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showApiTester, setShowApiTester] = useState(false);
  const toast = useToast();
  const apiService = createApiService(toast);

  // Fetch chat sessions
  const fetchChatSessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getChatSessions();
      if (response?.data) {
        // Transform the data to match the expected format for ChatList
        const transformedSessions = response.data.map(session => ({
          id: session.chat_session_id.toString(),
          title: session.participant.name,
          avatar: session.participant.profile_picture_url,
          last_message: session.latest_message.text,
          last_message_time: session.latest_message.timestamp,
          unread_count: session.unread_count,
          // Store original data for API calls
          _raw: {
            participant_id: session.participant.id,
            participant_type: session.participant.type
          }
        }));
        setChatSessions(transformedSessions);
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      toast.showError('Failed to load chat sessions');
    } finally {
      setLoading(false);
    }
  }, [apiService, toast]);

  // Fetch messages for a selected session
  const fetchMessages = useCallback(async (sessionId) => {
    if (!sessionId) return;
    
    setMessagesLoading(true);
    try {
      const response = await apiService.getChatMessages(sessionId);
      if (response?.data) {
        // Transform messages to match the expected format for ChatMessages
        const transformedMessages = response.data.map(message => ({
          id: message.id.toString(),
          content: message.text,
          sender_id: message.is_sent ? 'currentUser' : 'other',
          created_at: message.timestamp,
          attachments: message.media_url ? [message.media_url] : []
        }));
        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.showError('Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
  }, [apiService, toast]);

  // Send a message
  const handleSendMessage = useCallback(async (text, attachments = []) => {
    if (!selectedSession) return;

    try {
      const media = attachments.length > 0 ? attachments[0] : null;
      const response = await apiService.sendChatMessage(
        selectedSession._raw.participant_id,
        selectedSession._raw.participant_type,
        text,
        media
      );

      if (response?.success) {
        // Add the sent message to the UI immediately
        const newMessage = {
          id: Date.now().toString(), // Temporary ID
          content: text,
          sender_id: 'currentUser',
          created_at: new Date().toISOString(),
          attachments: attachments.map(file => file.name)
        };
        setMessages(prev => [...prev, newMessage]);

        // Refresh messages to get the actual message from the server
        fetchMessages(selectedSession.id);
        
        // Refresh chat sessions to update the latest message
        fetchChatSessions();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.showError('Failed to send message');
    }
  }, [selectedSession, apiService, fetchMessages, fetchChatSessions, toast]);

  // Handle session selection
  const handleSelectSession = useCallback((session) => {
    setSelectedSession(session);
    fetchMessages(session.id);
    
    // Mark chat as read when selecting a conversation
    if (session && session.unread_count > 0) {
      apiService.markChatAsRead(session.id)
        .then(() => {
          // Update the unread count in the UI
          setChatSessions(prevSessions => 
            prevSessions.map(s => 
              s.id === session.id ? { ...s, unread_count: 0 } : s
            )
          );
        })
        .catch(error => {
          console.error('Error marking chat as read:', error);
        });
    }
  }, [fetchMessages, apiService]);

  // Load chat sessions on component mount
  useEffect(() => {
    fetchChatSessions();
  }, [fetchChatSessions]);

  // Keyboard shortcut to toggle API tester (Ctrl+Alt+T)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key === 't') {
        setShowApiTester(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <PageContainer>
      <ChatContainer>
        <ChatList 
          conversations={chatSessions}
          selectedConversation={selectedSession}
          onSelectConversation={handleSelectSession}
          loading={loading}
        />
        <ChatMessages 
          conversation={selectedSession}
          messages={messages}
          onSendMessage={handleSendMessage}
          loading={messagesLoading}
        />
      </ChatContainer>
      
      {/* Add the API Tester Panel */}
      {showApiTester && (
        <ApiTesterPanel 
          sessionId={selectedSession?.id}
          participantId={selectedSession?._raw?.participant_id}
          participantType={selectedSession?._raw?.participant_type}
          onClose={() => setShowApiTester(false)}
        />
      )}
      
      <TesterToggleButton onClick={() => setShowApiTester(prev => !prev)}>
        {showApiTester ? 'Hide API Tester' : 'Show API Tester'}
      </TesterToggleButton>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChatContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  height: calc(100vh - 120px);
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: calc(100vh - 100px);
  }
`;

const TesterToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  z-index: 9998;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

export default ChatPage; 
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ChatMessages = ({ conversation, messages, onSendMessage, loading }) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && attachments.length === 0) return;

    onSendMessage(newMessage, attachments);
    setNewMessage('');
    setAttachments([]);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const formatMessageDay = (timestamp) => {
    if (!timestamp) return 'Today';
    try {
      const date = new Date(timestamp);
      const today = new Date();
      
      // Check if the message is from today
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      }
      
      // Check if the message is from yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      
      // Check if the message is from earlier this week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      if (date >= startOfWeek) {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
      }
      
      // For older messages
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting day:', error);
      return 'Unknown date';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    try {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 1);
    } catch (error) {
      console.error('Error getting initials:', error);
      return 'A';
    }
  };

  // Group messages by day safely
  const groupMessagesByDay = () => {
    const groups = {};
    
    if (!Array.isArray(messages)) {
      return [];
    }
    
    messages.forEach(message => {
      try {
        if (!message || !message.created_at) return;
        
        const date = new Date(message.created_at);
        const day = date.toDateString();
        
        if (!groups[day]) {
          groups[day] = {
            date: message.created_at,
            messages: []
          };
        }
        
        groups[day].messages.push(message);
      } catch (error) {
        console.error('Error processing message for grouping:', error, message);
      }
    });
    
    return Object.values(groups);
  };

  const messageGroups = groupMessagesByDay();

  if (!conversation) {
    return (
      <EmptyContainer>
        <EmptyStateMessage>Select a conversation to start chatting</EmptyStateMessage>
      </EmptyContainer>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <HeaderInfo>
          {conversation.avatar ? (
            <Avatar src={conversation.avatar} alt={conversation.title || 'Contact'} />
          ) : (
            <AvatarInitial>{getInitials(conversation.title)}</AvatarInitial>
          )}
          <div>
            <ContactName>{conversation.title || 'Unknown Contact'}</ContactName>
          </div>
        </HeaderInfo>
      </HeaderContainer>

      <MessagesContainer>
        {loading ? (
          <LoadingState>Loading messages...</LoadingState>
        ) : messages.length === 0 ? (
          <EmptyState>No messages yet. Start the conversation!</EmptyState>
        ) : (
          <>
            {messageGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <DayDivider>
                  <DayLabel>{formatMessageDay(group.date)}</DayLabel>
                </DayDivider>
                {group.messages.map((message) => (
                  <MessageItem 
                    key={message.id || `msg-${groupIndex}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`} 
                    $isSentByMe={message.sender_id === 'currentUser'}
                  >
                    {message.sender_id !== 'currentUser' && (
                      <AvatarInitial small>{getInitials(conversation.title)}</AvatarInitial>
                    )}
                    <MessageContent $isSentByMe={message.sender_id === 'currentUser'}>
                      <MessageText>{message.content || ''}</MessageText>
                      {message.attachments && message.attachments.length > 0 && (
                        <AttachmentsList>
                          {message.attachments.map((attachment, index) => (
                            <AttachmentItem key={`${message.id}-attach-${index}`}>
                              <AttachmentIcon>📎</AttachmentIcon>
                              <AttachmentName>{attachment}</AttachmentName>
                            </AttachmentItem>
                          ))}
                        </AttachmentsList>
                      )}
                      <MessageTime>{formatMessageTime(message.created_at)}</MessageTime>
                    </MessageContent>
                  </MessageItem>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </MessagesContainer>

      <InputContainer onSubmit={handleSendMessage}>
        {attachments.length > 0 && (
          <AttachmentsPreview>
            {attachments.map((file, index) => (
              <AttachmentPreviewItem key={`attach-preview-${index}`}>
                <AttachmentPreviewName>{file.name}</AttachmentPreviewName>
                <RemoveAttachment onClick={() => removeAttachment(index)}>×</RemoveAttachment>
              </AttachmentPreviewItem>
            ))}
          </AttachmentsPreview>
        )}
        
        <InputWrapper>
          <AttachButton type="button" onClick={handleAttachmentClick}>
            📎
          </AttachButton>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
          />
          <MessageInput
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type here..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSendMessage(e);
              }
            }}
          />
          <SendButton 
            type="submit"
            disabled={newMessage.trim() === '' && attachments.length === 0}
          >
            <SendIcon />
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </Container>
  );
};

ChatMessages.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    status: PropTypes.string
  }),
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      sender_id: PropTypes.string.isRequired,
      created_at: PropTypes.string,
      attachments: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

ChatMessages.defaultProps = {
  messages: [],
  loading: false
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const HeaderContainer = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  flex-shrink: 0;
  z-index: 10;
  position: sticky;
  top: 0;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const AvatarInitial = styled.div`
  width: ${props => props.small ? '32px' : '40px'};
  height: ${props => props.small ? '32px' : '40px'};
  border-radius: 50%;
  background-color: #075E54;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.small ? '14px' : '18px'};
  font-weight: 600;
`;

const ContactName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #111827;
`;

const Status = styled.div`
  font-size: 13px;
  color: #6B7280;
  margin-top: 2px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #f7f7f7;
  height: calc(100% - 140px);
  max-height: calc(100% - 140px);
`;

const DayDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
`;

const DayLabel = styled.div`
  background-color: #e2e8f0;
  color: #4b5563;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 16px;
`;

const MessageItem = styled.div`
  display: flex;
  justify-content: ${props => props.$isSentByMe ? 'flex-end' : 'flex-start'};
  align-items: flex-end;
  margin-bottom: 8px;
  gap: 8px;
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${props => props.$isSentByMe ? '#DCF8C6' : 'white'};
  color: #111827;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const MessageText = styled.div`
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.4;
`;

const MessageTime = styled.div`
  font-size: 11px;
  color: #6B7280;
  margin-top: 4px;
  text-align: right;
`;

const AttachmentsList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6B7280;
`;

const AttachmentIcon = styled.span`
  font-size: 14px;
`;

const AttachmentName = styled.span`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const InputContainer = styled.form`
  border-top: 1px solid #E5E7EB;
  padding: 16px;
  background-color: #fff;
  flex-shrink: 0;
  z-index: 10;
  position: sticky;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #f0f2f5;
  padding: 8px 16px;
  border-radius: 24px;
`;

const AttachButton = styled.button`
  background: none;
  border: none;
  color: #6B7280;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  
  &:hover {
    color: #4B5563;
  }
`;

const MessageInput = styled.textarea`
  flex: 1;
  border: none;
  background: none;
  resize: none;
  outline: none;
  padding: 8px 0;
  font-size: 15px;
  line-height: 1.4;
  max-height: 120px;
  min-height: 24px;
  background-color: transparent;
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

const SendButton = styled.button`
  background: none;
  border: none;
  color: #075E54;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    color: #054C44;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const SendIcon = styled.span`
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23075E54'%3E%3Cpath d='M2.01 21L23 12 2.01 3 2 10l15 2-15 2z'%3E%3C/path%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
`;

const AttachmentsPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const AttachmentPreviewItem = styled.div`
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 200px;
`;

const AttachmentPreviewName = styled.span`
  font-size: 12px;
  color: #4B5563;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RemoveAttachment = styled.button`
  background: none;
  border: none;
  color: #6B7280;
  font-size: 16px;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #EF4444;
  }
`;

const EmptyContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F9FAFB;
  color: #6B7280;
  font-size: 18px;
`;

const EmptyStateMessage = styled.div`
  max-width: 300px;
  text-align: center;
  padding: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #6B7280;
  margin: 48px 0;
`;

const LoadingState = styled.div`
  text-align: center;
  color: #6B7280;
  margin: 48px 0;
`;

export default ChatMessages; 
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import EmojiIcon from '../../assets/images/dashboard/emoji-icon.svg';
import SendIcon from '../../assets/images/dashboard/send-icon.svg';

const ChatWindow = ({ session, messages, currentUser, onSendMessage, loading, disabled, authError }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() && !disabled) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSend(e);
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp) return '';
      return format(parseISO(timestamp), 'h:mma');
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    
    messages.forEach(message => {
      const timestamp = message.timestamp || message.created_at;
      if (!timestamp) return;
      
      try {
        const date = parseISO(timestamp);
        const dateStr = format(date, 'MMMM d, yyyy');
        
        if (!groups[dateStr]) {
          groups[dateStr] = [];
        }
        
        groups[dateStr].push(message);
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate();
  
  if (!session) {
    return (
      <EmptyChatWindow>
        <EmptyStateMessage>
          Select a conversation to start chatting
        </EmptyStateMessage>
      </EmptyChatWindow>
    );
  }
  
  return (
    <ChatWindowContainer>
      <ChatHeader>
        <Avatar>
          {session.participant?.name 
            ? session.participant.name.charAt(0).toUpperCase() 
            : 'U'}
        </Avatar>
        <HeaderInfo>
          <ChatName>{session.participant?.name || 'Unknown'}</ChatName>
          <Status>
            {session.participant?.type === 'client' ? 'Client' : 'Support'}
          </Status>
        </HeaderInfo>
      </ChatHeader>
      
      <MessageContainer>
        {loading && messages.length === 0 ? (
          <LoadingContainer>Loading messages...</LoadingContainer>
        ) : (
          <>
            {Object.keys(messageGroups).map(dateStr => (
              <MessageGroup key={dateStr}>
                <DateDivider><DateLabel>{dateStr}</DateLabel></DateDivider>
                
                {messageGroups[dateStr].map(message => {
                  // Check if the message is from the current user
                  const isCurrentUser = message.sender_id === currentUser?.id;
                  
                  return (
                    <MessageBubble key={message.id || message.message_id} isCurrentUser={isCurrentUser}>
                      <MessageContent isCurrentUser={isCurrentUser}>
                        {message.content || message.text}
                      </MessageContent>
                      <MessageTime isCurrentUser={isCurrentUser}>
                        {formatTimestamp(message.timestamp || message.created_at)}
                      </MessageTime>
                    </MessageBubble>
                  );
                })}
              </MessageGroup>
            ))}
            
            {messages.length === 0 && (
              <EmptyMessages>
                <p>No messages yet. Start the conversation!</p>
              </EmptyMessages>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </MessageContainer>
      
      <InputContainer onSubmit={handleSend}>
        <EmojiButton type="button" disabled={disabled || loading}>
          <img src={EmojiIcon} alt="Emoji" />
        </EmojiButton>
        <MessageInput 
          placeholder={
            disabled 
              ? authError 
                ? "Authentication required to send messages" 
                : "Chat service unavailable" 
              : "Type here..."
          } 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || disabled}
        />
        <SendButton type="submit" disabled={!newMessage.trim() || loading || disabled}>
          <img src={SendIcon} alt="Send" />
        </SendButton>
        
        {disabled && (
          <AuthOverlay error={authError}>
            <AuthMessage>
              {authError 
                ? "Please sign in to continue messaging" 
                : "Chat service unavailable. Please try refreshing."}
            </AuthMessage>
          </AuthOverlay>
        )}
      </InputContainer>
    </ChatWindowContainer>
  );
};

ChatWindow.propTypes = {
  session: PropTypes.object,
  messages: PropTypes.array,
  currentUser: PropTypes.object,
  onSendMessage: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  authError: PropTypes.bool
};

ChatWindow.defaultProps = {
  messages: [],
  loading: false,
  disabled: false,
  authError: false
};

const ChatWindowContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;
`;

const ChatHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1E473C;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  margin-right: 15px;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChatName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const Status = styled.div`
  font-size: 12px;
  color: #4caf50;
`;

const MessageContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
`;

const MessageGroup = styled.div`
  margin-bottom: 20px;
`;

const DateDivider = styled.div`
  text-align: center;
  margin: 15px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    background-color: #e0e0e0;
    z-index: 1;
  }
`;

const DateLabel = styled.span`
  background-color: #f9f9f9;
  padding: 0 10px;
  position: relative;
  z-index: 2;
  font-size: 12px;
  color: #777;
`;

const MessageBubble = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 10px;
  max-width: 80%;
  align-self: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.isCurrentUser ? 'auto' : '0'};
  margin-right: ${props => props.isCurrentUser ? '0' : 'auto'};
`;

const MessageContent = styled.div`
  background-color: ${props => props.isCurrentUser ? '#1E473C' : '#e0e0e0'};
  color: ${props => props.isCurrentUser ? 'white' : '#333'};
  padding: 10px 15px;
  border-radius: ${props => props.isCurrentUser ? '15px 15px 0 15px' : '15px 15px 15px 0'};
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
`;

const MessageTime = styled.div`
  font-size: 10px;
  color: #777;
  margin-top: 5px;
  text-align: ${props => props.isCurrentUser ? 'right' : 'left'};
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid #e0e0e0;
  position: relative;
`;

const EmojiButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  img {
    width: 24px;
    height: 24px;
  }
`;

const MessageInput = styled.textarea`
  flex: 1;
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  background-color: #f0f0f0;
  margin: 0 10px;
  resize: none;
  min-height: 40px;
  max-height: 100px;
  font-size: 14px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    background-color: #e8e8e8;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  img {
    width: 24px;
    height: 24px;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const EmptyChatWindow = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  padding: 20px;
`;

const EmptyStateMessage = styled.div`
  text-align: center;
  color: #777;
  font-size: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #777;
`;

const EmptyMessages = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #777;
  text-align: center;
`;

const AuthOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.error 
    ? 'rgba(248, 215, 218, 0.7)' // Reddish for auth error
    : 'rgba(209, 236, 241, 0.7)' // Blueish for service unavailable
  };
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const AuthMessage = styled.div`
  background-color: ${props => props.error 
    ? '#f8d7da' // Red for auth error 
    : '#d1ecf1' // Blue for service unavailable
  };
  color: ${props => props.error 
    ? '#721c24' // Dark red for auth error
    : '#0c5460' // Dark blue for service unavailable
  };
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
`;

export default ChatWindow; 
import { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import SearchIcon from '../../assets/images/dashboard/search-icon.svg';

const ChatList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation, 
  loading 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ensure conversations is always an array
  const safeConversations = Array.isArray(conversations) ? conversations : [];
  
  const filteredConversations = safeConversations.filter(conversation => 
    conversation?.title?.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const handleSelectConversation = (conversation) => {
    if (!conversation) return;
    onSelectConversation(conversation);
  };

  const formatLastTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      
      // Same day
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // Within last week
      const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      if (daysDiff < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
      }
      
      // Older
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    try {
      return name
        .split(' ')
        .map(part => part?.[0] || '')
        .join('')
        .toUpperCase()
        .substring(0, 1);
    } catch (error) {
      console.error('Error getting initials:', error);
      return '';
    }
  };

  return (
    <Container>
      <Header>
        <Title>Chats</Title>
        {filteredConversations.length > 0 && (
          <UnreadCount>{filteredConversations.length}</UnreadCount>
        )}
      </Header>
      
      <SearchContainer>
        <SearchIconElement />
        <SearchInput 
          type="text" 
          placeholder="Search here..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>
      
      <FilterHeader>All messages</FilterHeader>
      
      <ConversationsList>
        {loading ? (
          <LoadingState>Loading conversations...</LoadingState>
        ) : filteredConversations.length === 0 ? (
          <EmptyState>
            {searchQuery ? 'No conversations found' : 'No conversations yet'}
          </EmptyState>
        ) : (
          filteredConversations.map(conversation => (
            <ConversationItem 
              key={conversation.id || `conversation-${Math.random().toString(36).substring(2, 9)}`}
              $isSelected={selectedConversation?.id === conversation.id}
              onClick={() => handleSelectConversation(conversation)}
            >
              {conversation.avatar ? (
                <Avatar src={conversation.avatar} alt={conversation.title || 'Contact'} />
              ) : (
                <AvatarInitial>{getInitials(conversation.title)}</AvatarInitial>
              )}
              <ConversationDetails>
                <ConversationHeader>
                  <ContactName>{conversation.title || 'Unknown Contact'}</ContactName>
                  <Time>{formatLastTime(conversation.last_message_time)}</Time>
                </ConversationHeader>
                <LastMessage>
                  {conversation.last_message || 'No messages yet'}
                </LastMessage>
              </ConversationDetails>
              {(conversation.unread_count > 0) && (
                <UnreadBadge>{conversation.unread_count}</UnreadBadge>
              )}
            </ConversationItem>
          ))
        )}
      </ConversationsList>
    </Container>
  );
};

ChatList.propTypes = {
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      last_message: PropTypes.string,
      last_message_time: PropTypes.string,
      unread_count: PropTypes.number
    })
  ).isRequired,
  selectedConversation: PropTypes.object,
  onSelectConversation: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

ChatList.defaultProps = {
  conversations: [],
  loading: false
};

const Container = styled.div`
  width: 320px;
  min-width: 280px;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #E5E7EB;
    min-height: 300px;
    max-height: 40%;
  }
`;

const Header = styled.div`
  padding: 24px;
  display: flex;
  align-items: center;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #333;
`;

const UnreadCount = styled.span`
  background-color: #F3F4F6;
  color: #4B5563;
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 12px;
`;

const SearchContainer = styled.div`
  padding: 0 16px 16px;
  position: sticky;
  top: 70px;
  display: flex;
  align-items: center;
  z-index: 5;
  background-color: #fff;
`;

const SearchIconElement = styled.span`
  position: absolute;
  left: 26px;
  width: 16px;
  height: 16px;
  opacity: 0.5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clip-rule='evenodd' /%3E%3C/svg%3E");
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  border-radius: 20px;
  border: none;
  background-color: #F3F4F6;
  font-size: 14px;
  
  &::placeholder {
    color: #9CA3AF;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
  }
`;

const FilterHeader = styled.div`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  position: sticky;
  top: 120px;
  background-color: #fff;
  z-index: 5;
`;

const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  height: calc(100% - 180px);
  padding-bottom: 20px;
`;

const ConversationItem = styled.div`
  padding: 16px 24px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.$isSelected ? '#F3F4F6' : 'transparent'};
  position: relative;
  
  &:hover {
    background-color: ${props => props.$isSelected ? '#F3F4F6' : '#F9FAFB'};
  }
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const AvatarInitial = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #075E54;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
`;

const ConversationDetails = styled.div`
  flex: 1;
  overflow: hidden;
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ContactName = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #111827;
`;

const Time = styled.div`
  font-size: 12px;
  color: #6B7280;
`;

const LastMessage = styled.div`
  font-size: 14px;
  color: #6B7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: #075E54;
  color: white;
  font-size: 12px;
  font-weight: 600;
  height: 20px;
  min-width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0 6px;
`;

const LoadingState = styled.div`
  padding: 24px;
  text-align: center;
  color: #6B7280;
`;

const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: #6B7280;
`;

export default ChatList; 
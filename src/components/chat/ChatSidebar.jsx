import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import SearchIcon from '../../assets/images/dashboard/search-icon.svg';

const ChatSidebar = ({ sessions, currentSession, onSelectSession, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSessions = sessions.filter(session => 
    session.participant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Title>Chats <Badge>{sessions.length}</Badge></Title>
        <SearchContainer>
          <SearchInput 
            placeholder="Search here..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <SearchIconWrapper>
            <img src={SearchIcon} alt="Search" />
          </SearchIconWrapper>
        </SearchContainer>
      </SidebarHeader>
      
      <ChatList>
        <ChatCategoryTitle>All messages</ChatCategoryTitle>
        
        {loading && <LoadingText>Loading chats...</LoadingText>}
        
        {!loading && filteredSessions.length === 0 && (
          <EmptyState>No chat sessions found</EmptyState>
        )}
        
        {!loading && filteredSessions.map(session => (
          <ChatItem 
            key={session.chat_session_id} 
            active={currentSession?.chat_session_id === session.chat_session_id}
            onClick={() => onSelectSession(session)}
            unread={session.unread_count > 0}
          >
            <LeftSection>
              <Avatar>
                {session.participant?.name ? session.participant.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <ChatInfo>
                <ChatName>{session.participant?.name || 'Unknown'}</ChatName>
                <LastMessage>
                  {session.latest_message?.text 
                    ? `${session.latest_message.text.slice(0, 30)}${session.latest_message.text.length > 30 ? '...' : ''}` 
                    : 'No messages yet'}
                </LastMessage>
              </ChatInfo>
            </LeftSection>
            <RightSection>
              <TimeStamp>
                {session.latest_message?.timestamp 
                  ? formatTimestamp(session.latest_message.timestamp)
                  : ''}
              </TimeStamp>
              {session.unread_count > 0 && (
                <UnreadBadge>
                  {session.unread_count > 99 ? '99+' : session.unread_count}
                </UnreadBadge>
              )}
            </RightSection>
          </ChatItem>
        ))}
      </ChatList>
    </SidebarContainer>
  );
};

ChatSidebar.propTypes = {
  sessions: PropTypes.array.isRequired,
  currentSession: PropTypes.object,
  onSelectSession: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

ChatSidebar.defaultProps = {
  sessions: [],
  loading: false
};

const SidebarContainer = styled.div`
  width: 320px;
  border-right: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 40%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: #333;
  display: flex;
  align-items: center;
`;

const Badge = styled.span`
  background-color: #f2f2f2;
  color: #333;
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 10px;
  font-weight: 500;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-top: 10px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  padding-left: 40px;
  border-radius: 20px;
  border: none;
  background-color: #f2f2f2;
  font-size: 14px;
  
  &:focus {
    outline: none;
    background-color: #e8e8e8;
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  
  img {
    width: 16px;
    height: 16px;
    opacity: 0.5;
  }
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px 0;
`;

const ChatCategoryTitle = styled.div`
  padding: 0 20px 10px;
  font-size: 14px;
  font-weight: 500;
  color: #777;
`;

const ChatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  cursor: pointer;
  background-color: ${props => props.active ? '#e7f5ed' : 'transparent'};
  border-left: ${props => props.active ? '3px solid #1E473C' : '3px solid transparent'};
  
  &:hover {
    background-color: ${props => props.active ? '#e7f5ed' : '#f2f2f2'};
  }
  
  font-weight: ${props => props.unread ? '600' : '400'};
`;

const LeftSection = styled.div`
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

const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChatName = styled.div`
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
`;

const LastMessage = styled.div`
  font-size: 13px;
  color: #777;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  min-width: 50px;
`;

const TimeStamp = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 5px;
`;

const UnreadBadge = styled.div`
  background-color: #1E473C;
  color: white;
  font-size: 12px;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
`;

const LoadingText = styled.div`
  padding: 20px;
  text-align: center;
  color: #777;
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: #777;
`;

export default ChatSidebar; 
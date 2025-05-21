import React, { useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import { useNotifications } from '../hooks/useNotifications';
import NotificationIcon from '../assets/images/dashboard/notification-icon.svg';
import SearchIcon from '../assets/images/dashboard/search-icon-black.svg';
import { NotificationUpdateContext } from '../components/NotificationBadge';

const NotificationsPage = () => {
  const { triggerRefresh = () => {} } = useContext(NotificationUpdateContext) || {};
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    notifications, 
    loading, 
    error, 
    pagination, 
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  // Filter notifications based on search query
  const filteredNotifications = searchQuery 
    ? notifications.filter(
        n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             n.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notifications;

  // Change page handler
  const handlePageChange = useCallback((page) => {
    fetchNotifications(page, pagination.per_page);
  }, [fetchNotifications, pagination.per_page]);

  // Handle marking a notification as read
  const handleMarkAsRead = useCallback(async (id) => {
    const success = await markAsRead(id);
    if (success) {
      triggerRefresh();
    }
  }, [markAsRead, triggerRefresh]);

  // Mark all visible notifications as read with debounce
  const handleMarkAllAsRead = useCallback(async () => {
    // Disable button during processing to prevent double-clicks
    if (isMarkingAll || loading) return;
    
    setIsMarkingAll(true);
    
    try {
      const success = await markAllAsRead();
      
      if (success) {
        triggerRefresh();
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setIsMarkingAll(false);
    }
  }, [markAllAsRead, triggerRefresh, loading, isMarkingAll]);

  // TODO: I may use this function in the future
  // const handleFilterChange = function() {
  //   // Not used anymore but kept for interface compatibility
  // } 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <MainLayout
      isNotificationPage={true}
      title="notifications" 
    >
      <Container>
        <HeaderSection>
          <TitleContainer>
            <Title>Notifications</Title>
            <NotificationCount>{notifications.length}</NotificationCount>
          </TitleContainer>
          
          <SearchContainer>
            <SearchIconWrapper>
              <img src={SearchIcon} alt="Search" />
            </SearchIconWrapper>
            <SearchInput 
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </SearchContainer>

          <AllNotificationsText>
            All Notifications
          </AllNotificationsText>
        </HeaderSection>

        <ActionHeader>
          {filteredNotifications.some(n => !n.read) && (
            <MarkAllButton 
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
            >
              {isMarkingAll ? 'Marking...' : 'Mark all as read'}
            </MarkAllButton>
          )}
        </ActionHeader>

        <NotificationsContainer>
          {loading && notifications.length === 0 ? (
            <LoadingMessage>Loading notifications...</LoadingMessage>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : filteredNotifications.length === 0 ? (
            <EmptyMessage>No notifications found.</EmptyMessage>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                $read={notification.read}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <StatusIndicator $read={notification.read} />
                <IconContainer>
                  <NotifIcon src={NotificationIcon} alt="Notification" />
                </IconContainer>
                <ContentContainer>
                  <NotifTitle>{notification.title}</NotifTitle>
                  <NotifMessage>{notification.message}</NotifMessage>
                  <NotifTimestamp>{formatTimeAgo(notification.timestamp)}</NotifTimestamp>
                </ContentContainer>
              </NotificationItem>
            ))
          )}

          {!loading && !error && notifications.length > 0 && pagination.last_page > 1 && (
            <Pagination>
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <PageButton
                  key={page}
                  $active={page === pagination.current_page}
                  onClick={() => handlePageChange(page)}
                  disabled={page === pagination.current_page}
                >
                  {page}
                </PageButton>
              ))}
            </Pagination>
          )}

          {loading && notifications.length > 0 && (
            <LoadingMore>Loading more notifications...</LoadingMore>
          )}
        </NotificationsContainer>
      </Container>
    </MainLayout>
  );
};

// Helper to format relative time
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  
  // For older dates, show the date
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${monthNames[date.getMonth()]}${date.getFullYear() !== now.getFullYear() ? ' ' + date.getFullYear() : ''}`;
}

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  background: #FFFFFF;
  border-radius: 24px;
  border-left-width: 1px;

  @media (max-width: 1440px) {
    padding: 22px;
  }
  
  @media (max-width: 1280px) {
    padding: 20px;
  }
  
  @media (max-width: 1024px) {
    padding: 18px;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 16px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;

  /* Specific spacing for each child */
  & > *:not(:last-child) {
    margin-bottom: 24px;
    
    @media (max-width: 1440px) {
      margin-bottom: 22px;
    }
    
    @media (max-width: 1280px) {
      margin-bottom: 20px;
    }
    
    @media (max-width: 1024px) {
      margin-bottom: 18px;
    }
    
    @media (max-width: 768px) {
      margin-bottom: 16px;
    }
    
    @media (max-width: 480px) {
      margin-bottom: 14px;
    }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 14px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 12px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  
  @media (max-width: 1440px) {
    font-size: 26px;
  }
  
  @media (max-width: 1280px) {
    font-size: 25px;
  }
  
  @media (max-width: 1024px) {
    font-size: 24px;
  }
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const NotificationCount = styled.div`
  background-color: #f0f0f0;
  color: #666;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 500;
  
  @media (max-width: 1440px) {
    font-size: 15px;
  }
  
  @media (max-width: 1280px) {
    font-size: 15px;
  }
  
  @media (max-width: 1024px) {
    font-size: 14px;
    padding: 4px 10px;
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 3px 9px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 2px 8px;
  }
`;

const SearchContainer = styled.div`
  width: 100%;
  position: relative;
  height: 56px;
  
  @media (max-width: 1440px) {
    height: 52px;
  }
  
  @media (max-width: 1280px) {
    height: 48px;
  }
  
  @media (max-width: 1024px) {
    height: 44px;
  }
  
  @media (max-width: 768px) {
    height: 40px;
  }
  
  @media (max-width: 480px) {
    height: 36px;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 20px;
    height: 20px;
    opacity: 0.5;
    
    @media (max-width: 768px) {
      width: 18px;
      height: 18px;
    }
    
    @media (max-width: 480px) {
      width: 16px;
      height: 16px;
    }
  }
  
  @media (max-width: 768px) {
    left: 14px;
  }
  
  @media (max-width: 480px) {
    left: 12px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  border-radius: 100px;
  padding: 0 20px 0 46px;
  font-size: 16px;
  border: 1px solid transparent; 
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #999;
    transition: color 0.3s ease;
  }
  
  @media (max-width: 1440px) {
    font-size: 15px;
    padding: 0 18px 0 44px;
  }
  
  @media (max-width: 1280px) {
    font-size: 15px;
  }
  
  @media (max-width: 1024px) {
    font-size: 14px;
    padding: 0 16px 0 42px;
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 0 14px 0 38px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 0 12px 0 34px;
  }
`;

const AllNotificationsText = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #121F24;
  margin-bottom: 5px;
  
  @media (max-width: 1440px) {
    font-size: 17px;
  }
  
  @media (max-width: 1280px) {
    font-size: 16px;
  }
  
  @media (max-width: 1024px) {
    font-size: 15px;
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 4px;
  }
`;

const ActionHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
  
  @media (max-width: 1440px) {
    margin-bottom: 15px;
  }
  
  @media (max-width: 1280px) {
    margin-bottom: 14px;
  }
  
  @media (max-width: 1024px) {
    margin-bottom: 13px;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const NotificationsContainer = styled.div`
  background: white;
  overflow: hidden;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid #eee;
  background: ${({ $read }) => ($read ? '#f9f9f9' : 'white')};
  position: relative;
  cursor: ${({ $read }) => ($read ? 'default' : 'pointer')};
  
  &:hover {
    background: ${({ $read }) => ($read ? '#f9f9f9' : '#f0f8f6')};
  }
  
  @media (max-width: 1440px) {
    padding: 22px;
  }
  
  @media (max-width: 1280px) {
    padding: 20px;
  }
  
  @media (max-width: 1024px) {
    padding: 18px;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 14px;
  }
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $read }) => ($read ? '#ccc' : 'var(--color-error-500)')};
  margin-right: 16px;
  margin-top: 8px;
  
  @media (max-width: 1440px) {
    width: 11px;
    height: 11px;
    margin-right: 15px;
  }
  
  @media (max-width: 1280px) {
    width: 11px;
    height: 11px;
    margin-right: 14px;
  }
  
  @media (max-width: 1024px) {
    width: 10px;
    height: 10px;
    margin-right: 13px;
  }
  
  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
    margin-right: 12px;
    margin-top: 6px;
  }
  
  @media (max-width: 480px) {
    width: 8px;
    height: 8px;
    margin-right: 10px;
    margin-top: 5px;
  }
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e6f0ed;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  
  @media (max-width: 1440px) {
    width: 46px;
    height: 46px;
    margin-right: 15px;
  }
  
  @media (max-width: 1280px) {
    width: 44px;
    height: 44px;
    margin-right: 14px;
  }
  
  @media (max-width: 1024px) {
    width: 42px;
    height: 42px;
    margin-right: 13px;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    margin-right: 10px;
  }
`;

const NotifIcon = styled.img`
  width: 28px;
  height: 28px;
  
  @media (max-width: 1440px) {
    width: 26px;
    height: 26px;
  }
  
  @media (max-width: 1280px) {
    width: 25px;
    height: 25px;
  }
  
  @media (max-width: 1024px) {
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 768px) {
    width: 22px;
    height: 22px;
  }
  
  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  word-break: break-word;
`;

const NotifTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 4px;
  
  @media (max-width: 1440px) {
    font-size: 1.05rem;
  }
  
  @media (max-width: 1280px) {
    font-size: 1.03rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 3px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 2px;
  }
`;

const NotifMessage = styled.div`
  color: #333;
  margin-bottom: 8px;
  
  @media (max-width: 1440px) {
    font-size: 0.98rem;
  }
  
  @media (max-width: 1280px) {
    font-size: 0.96rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 0.94rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }
`;

const NotifTimestamp = styled.div`
  color: #999;
  font-size: 0.9rem;
  
  @media (max-width: 1440px) {
    font-size: 0.88rem;
  }
  
  @media (max-width: 1280px) {
    font-size: 0.86rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 0.84rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.82rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.78rem;
  }
`;

const EmptyMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #777;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 50vh;
  
  @media (max-width: 1440px) {
    padding: 22px;
  }
  
  @media (max-width: 1280px) {
    padding: 20px;
  }
  
  @media (max-width: 1024px) {
    padding: 18px;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 14px;
    font-size: 0.9rem;
  }
`;

const LoadingMessage = styled(EmptyMessage)`
  /* Inherits all styles from EmptyMessage */
`;

const ErrorMessage = styled(EmptyMessage)`
  color: var(--color-error-500);
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  flex-wrap: wrap;
  
  @media (max-width: 1440px) {
    padding: 22px;
    gap: 7px;
  }
  
  @media (max-width: 1280px) {
    padding: 20px;
    gap: 7px;
  }
  
  @media (max-width: 1024px) {
    padding: 18px;
    gap: 6px;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 14px;
    gap: 4px;
  }
`;

const PageButton = styled.button`
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? 'var(--color-primary-500)' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#333')};
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-primary-500)' : '#ddd')};
  cursor: ${({ $active }) => ($active ? 'default' : 'pointer')};
  
  &:hover {
    background: ${({ $active }) => ($active ? 'var(--color-primary-500)' : '#f5f5f5')};
  }
  
  &:disabled {
    cursor: default;
  }
  
  @media (max-width: 1440px) {
    min-width: 34px;
    height: 34px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 1280px) {
    min-width: 33px;
    height: 33px;
  }
  
  @media (max-width: 1024px) {
    min-width: 32px;
    height: 32px;
    font-size: 0.93rem;
  }
  
  @media (max-width: 768px) {
    min-width: 30px;
    height: 30px;
    font-size: 0.9rem;
    border-radius: 7px;
  }
  
  @media (max-width: 480px) {
    min-width: 28px;
    height: 28px;
    font-size: 0.85rem;
    border-radius: 6px;
  }
`;

const LoadingMore = styled.div`
  padding: 16px;
  text-align: center;
  color: #777;
  
  @media (max-width: 1440px) {
    padding: 15px;
  }
  
  @media (max-width: 1280px) {
    padding: 14px;
  }
  
  @media (max-width: 1024px) {
    padding: 13px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 0.85rem;
  }
`;

const MarkAllButton = styled.button`
  background: transparent;
  color: var(--color-primary-500);
  border: 1px solid var(--color-primary-500);
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-primary-50);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  @media (max-width: 1440px) {
    padding: 7px 15px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 1280px) {
    padding: 7px 14px;
  }
  
  @media (max-width: 1024px) {
    padding: 6px 13px;
    font-size: 0.93rem;
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.9rem;
    border-radius: 7px;
  }
  
  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 0.85rem;
    border-radius: 6px;
    width: 100%;
    text-align: center;
  }
`;

export default NotificationsPage; 

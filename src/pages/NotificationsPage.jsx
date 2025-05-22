import React, { useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import { useNotifications } from '../hooks/useNotifications';
import NotificationIcon from '../assets/images/dashboard/notification-icon.svg';
import { NotificationUpdateContext } from '../components/NotificationBadge';
import { formatNotificationText, formatTimeAgo } from '../utils/helperFunctions.jsx';
import SearchLayout from '../layouts/SearchLayout.jsx';

const NotificationsPage = () => {
  const { triggerRefresh = () => {} } = useContext(NotificationUpdateContext) || {};
  // const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    notifications, 
    loading, 
    error, 
    pagination, 
    fetchNotifications,
    markAsRead,
    // markAllAsRead
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

  // TODO: I may use this function in the future
  // Mark all visible notifications as read with debounce
  // const handleMarkAllAsRead = useCallback(async () => {
  //   // Disable button during processing to prevent double-clicks
  //   if (isMarkingAll || loading) return;
    
  //   setIsMarkingAll(true);
    
  //   try {
  //     const success = await markAllAsRead();
      
  //     if (success) {
  //       triggerRefresh();
  //     }
  //   } catch (error) {
  //     console.error('Error marking all as read:', error);
  //   } finally {
  //     setIsMarkingAll(false);
  //   }
  // }, [markAllAsRead, triggerRefresh, loading, isMarkingAll]);

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
      <SearchLayout
        title="Notifications"
        resultCount={notifications.length}
        allResultsTitle={'All Notifications'}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      >
        {/* <ActionHeader>
          {filteredNotifications.some(n => !n.read) && (
            <MarkAllButton 
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
            >
              {isMarkingAll ? 'Marking...' : 'Mark all as read'}
            </MarkAllButton>
          )}
        </ActionHeader> */}

        <NotificationsContainer minHeight= {filteredNotifications.length === 0 ? '50vh' : '100vh'}>
          {loading && notifications.length === 0 ? (
            <LoadingMessage>Loading notifications...</LoadingMessage>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : filteredNotifications.length === 0 ? (
            <EmptyMessage>No notifications found.</EmptyMessage>
          ) : (
            filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <NotificationItem 
                  $read={notification.read}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <StatusIndicator $read={notification.read} />
                  <IconContainer>
                    <NotifIcon src={NotificationIcon} alt="Notification" />
                  </IconContainer>
                  <ContentContainer>
                    <NotificationText>
                      {formatNotificationText(notification.title, notification.message)}
                    </NotificationText>
                    <NotifTimestamp>{formatTimeAgo(notification.timestamp)}</NotifTimestamp>
                  </ContentContainer>
                </NotificationItem>
                {index !== filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
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

      </SearchLayout>
    </MainLayout>
  );
};

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

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px 8px;
  background: white;
  position: relative;
  cursor: ${({ $read }) => ($read ? 'default' : 'pointer')};
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ $read }) => ($read ? '#f9f9f9' : '#f0f8f6')};
  }
  
  @media (max-width: 1440px) {
    padding: 15px 7px;
  }
  
  @media (max-width: 1280px) {
    padding: 14px 6px;
  }
  
  @media (max-width: 1024px) {
    padding: 13px 5px;
  }
  
  @media (max-width: 768px) {
    padding: 12px 4px;
  }
  
  @media (max-width: 480px) {
    padding: 11px 3px;
  }
`;

const NotificationsContainer = styled.div`
  background: white;
  overflow: hidden;
  min-height: ${({ minHeight }) => minHeight || '100vh'};
  display: flex;
  flex-direction: column;
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $read }) => ($read ? '#ccc' : 'var(--color-error-500)')};
  margin-right: 6px;
  margin-top: -6px;
  
  // @media (max-width: 1440px) {
  //   width: 11px;
  //   height: 11px;
  //   margin-right: 15px;
  // }
  
  // @media (max-width: 1280px) {
  //   width: 11px;
  //   height: 11px;
  //   margin-right: 14px;
  // }
  
  // @media (max-width: 1024px) {
  //   width: 10px;
  //   height: 10px;
  //   margin-right: 13px;
  // }
  
  // @media (max-width: 768px) {
  //   width: 10px;
  //   height: 10px;
  //   margin-right: 12px;
  //   margin-top: 6px;
  // }
  
  // @media (max-width: 480px) {
  //   width: 8px;
  //   height: 8px;
  //   margin-right: 10px;
  //   margin-top: 5px;
  // }
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #043F35;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const NotificationText = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: #2D3748;
  max-width: 310px;
  
  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 18px;
    max-width: 280px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    line-height: 16px;
    max-width: 250px;
  }
`;

const NotifTimestamp = styled.div`
  color: #999;
  font-size: 0.9rem;
  margin-top: 12px;
  
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
  // min-height: 50vh;
  
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

const Divider = styled.div`
  height: 1px;
  background: #E4E8EE;
  width: 100%;
`;

export default NotificationsPage; 

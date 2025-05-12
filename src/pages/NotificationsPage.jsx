import React, { useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import { useNotifications } from '../hooks/useNotifications';
import NotificationIcon from '../assets/images/dashboard/notification-icon.svg';
import { NotificationUpdateContext } from '../components/NotificationBadge';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'
  const { triggerRefresh = () => {} } = useContext(NotificationUpdateContext) || {};
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const { 
    notifications, 
    loading, 
    error, 
    pagination, 
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'read') return n.read;
    if (filter === 'unread') return !n.read;
    return true;
  });

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

  const handleFilterChange = function(filter) {
    setFilter(filter);
  } 

  return (
    <MainLayout title="Notifications" filterButtons={[
    ]} onFilterChange={handleFilterChange} showInvoicePageHeader>
      <Container>
        <Header>
          {/* <PageTitle>Your Notifications</PageTitle> */}
          <FilterContainer>
            <FilterButton 
              $active={filter === 'all'} 
              onClick={() => setFilter('all')}
            >
              All
            </FilterButton>
            <FilterButton 
              $active={filter === 'unread'} 
              onClick={() => setFilter('unread')}
            >
              Unread
            </FilterButton>
            <FilterButton 
              $active={filter === 'read'} 
              onClick={() => setFilter('read')}
            >
              Read
            </FilterButton>
          </FilterContainer>
          
          {filteredNotifications.some(n => !n.read) && (
            <MarkAllButton 
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
            >
              {isMarkingAll ? 'Marking...' : 'Mark all as read'}
            </MarkAllButton>
          )}
        </Header>

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
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  
  @media (max-width: 1024px) {
    padding: 20px;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 480px) {
    gap: 8px;
    flex-wrap: wrap;
  }
`;

const FilterButton = styled.button`
  background: ${({ $active }) => ($active ? 'var(--color-primary-500)' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--color-primary-500)')};
  border: 1px solid var(--color-primary-500);
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'var(--color-primary-50)')};
  }
  
  @media (max-width: 768px) {
    padding: 7px 14px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.9rem;
    flex: 1;
    text-align: center;
    min-width: 80px;
  }
`;

const NotificationsContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  @media (max-width: 768px) {
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    border-radius: 10px;
  }
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
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $read }) => ($read ? '#ccc' : 'var(--color-error-500)')};
  margin-right: 16px;
  margin-top: 8px;
  
  @media (max-width: 480px) {
    width: 10px;
    height: 10px;
    margin-right: 12px;
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
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin-right: 14px;
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }
`;

const NotifIcon = styled.img`
  width: 28px;
  height: 28px;
  
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
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
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const NotifMessage = styled.div`
  color: #333;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 6px;
  }
`;

const NotifTimestamp = styled.div`
  color: #999;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const LoadingMessage = styled.div`
  padding: 48px;
  text-align: center;
  color: #777;
  
  @media (max-width: 768px) {
    padding: 36px;
  }
  
  @media (max-width: 480px) {
    padding: 24px;
    font-size: 0.95rem;
  }
`;

const ErrorMessage = styled.div`
  padding: 48px;
  text-align: center;
  color: var(--color-error-500);
  
  @media (max-width: 768px) {
    padding: 36px;
  }
  
  @media (max-width: 480px) {
    padding: 24px;
    font-size: 0.95rem;
  }
`;

const EmptyMessage = styled.div`
  padding: 48px;
  text-align: center;
  color: #777;
  
  @media (max-width: 768px) {
    padding: 36px;
  }
  
  @media (max-width: 480px) {
    padding: 24px;
    font-size: 0.95rem;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    padding: 20px;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
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
  
  @media (max-width: 768px) {
    min-width: 32px;
    height: 32px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    min-width: 28px;
    height: 28px;
    font-size: 0.9rem;
    border-radius: 6px;
  }
`;

const LoadingMore = styled.div`
  padding: 16px;
  text-align: center;
  color: #777;
  
  @media (max-width: 480px) {
    padding: 12px;
    font-size: 0.9rem;
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
  
  @media (max-width: 768px) {
    padding: 7px 14px;
    font-size: 0.95rem;
    align-self: flex-end;
  }
  
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.9rem;
    width: 100%;
    text-align: center;
  }
`;

export default NotificationsPage; 
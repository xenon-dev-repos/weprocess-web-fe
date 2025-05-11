import React, { useEffect, useRef, useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationIcon from '../../assets/images/dashboard/notification-icon.svg';
import { ROUTES } from '../../constants/routes';
import { NotificationUpdateContext } from '../NotificationBadge';

/**
 * NotificationModal - displays user notifications in a modal
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 */
const NotificationModal = ({ open, onClose }) => {
  const contentRef = useRef(null);
  const { triggerRefresh = () => {} } = useContext(NotificationUpdateContext) || {};
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const { 
    notifications, 
    loading, 
    error, 
    pagination,
    loadMore,
    refresh,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  // Refresh when modal opens
  useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open, refresh]);

  // Handle marking a notification as read
  const handleMarkAsRead = useCallback(async (id) => {
    const success = await markAsRead(id);
    if (success) {
      triggerRefresh();
    }
  }, [markAsRead, triggerRefresh]);

  // Handle marking all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
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
  }, [markAllAsRead, triggerRefresh, isMarkingAll, loading]);

  // Scroll handler for infinite loading
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    if (isNearBottom && !loading && pagination.current_page < pagination.last_page) {
      loadMore();
    }
  }, [loading, loadMore, pagination]);

  // Set up scroll listener
  useEffect(() => {
    const contentEl = contentRef.current;
    if (contentEl) {
      contentEl.addEventListener('scroll', handleScroll);
      return () => contentEl.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  if (!open) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <Header>
          <Title>All notifications</Title>
          <ShowAllLink to={ROUTES.NOTIFICATIONS}>Show all</ShowAllLink>
          <CloseButton onClick={onClose} aria-label="Close">×</CloseButton>
        </Header>
        <Divider />
        <Content ref={contentRef}>
          {notifications.length === 0 && !loading && !error ? (
            <EmptyMsg>
              <EmptyIcon>📬</EmptyIcon>
              <p>No notifications found.</p>
              <SmallText>New notifications will appear here</SmallText>
            </EmptyMsg>
          ) : (
            <>
              {notifications.some(n => !n.read) && (
                <MarkAllContainer>
                  <MarkAllBtn onClick={handleMarkAllAsRead} disabled={isMarkingAll}>
                    {isMarkingAll ? 'Marking...' : 'Mark all as read'}
                  </MarkAllBtn>
                </MarkAllContainer>
              )}
              
              {notifications.map((n) => (
                <NotificationItem 
                  key={n.id} 
                  $read={n.read}
                  onClick={() => !n.read && handleMarkAsRead(n.id)}
                >
                  <Dot $read={n.read} />
                  <IconWrapper>
                    <IconImg src={NotificationIcon} alt="Notification" />
                  </IconWrapper>
                  <NotificationContent>
                    <NotifTitle>{n.title}</NotifTitle>
                    <NotifMsg>{n.message}</NotifMsg>
                    <NotifTime>{formatTimeAgo(n.timestamp)}</NotifTime>
                  </NotificationContent>
                </NotificationItem>
              ))}
              
              {error && (
                <ErrorMsg>
                  {error.includes('Too many requests') 
                    ? 'Rate limited: Too many requests. Please try again later.' 
                    : error}
                </ErrorMsg>
              )}
              
              {loading && <Loading>Loading more notifications...</Loading>}
              
              {!loading && !error && pagination.current_page >= pagination.last_page && notifications.length > 0 && (
                <EndMsg>No more notifications to load</EndMsg>
              )}
            </>
          )}
        </Content>
        <Footer>
          <DismissButton onClick={onClose}>Dismiss</DismissButton>
        </Footer>
      </ModalContainer>
    </ModalOverlay>
  );
};

// Helper to format time ago (simple version)
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

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalContainer = styled.div`
  background: #fff;
  border-radius: 28px;
  width: 420px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 0;
  position: relative;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
`;
const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;
const ShowAllLink = styled(Link)`
  color: var(--color-primary-500);
  font-size: 1rem;
  text-decoration: underline;
  margin-left: auto;
  margin-right: 16px;
  cursor: pointer;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  margin-left: 8px;
`;
const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 16px 0 0 0;
`;
const Content = styled.div`
  max-height: 520px;
  overflow-y: auto;
  padding: 0 0 8px 0;
`;
const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: ${({ $read }) => ($read ? '#f7f7f7' : '#fff')};
  position: relative;
  cursor: ${({ $read }) => ($read ? 'default' : 'pointer')};
  
  &:hover {
    background: ${({ $read }) => ($read ? '#f7f7f7' : '#f0f8f6')};
  }
`;
const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $read }) => ($read ? '#ccc' : 'var(--color-error-500)')};
  margin-right: 16px;
  margin-top: 8px;
`;
const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e6f0ed;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;
const IconImg = styled.img`
  width: 28px;
  height: 28px;
`;
const NotificationContent = styled.div`
  flex: 1;
`;
const NotifTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 2px;
`;
const NotifMsg = styled.div`
  color: #222;
  font-size: 1rem;
  margin-bottom: 6px;
`;
const NotifTime = styled.div`
  color: #b0b0b0;
  font-size: 0.95rem;
`;
const Loading = styled.div`
  padding: 16px;
  text-align: center;
  color: #888;
`;
const ErrorMsg = styled.div`
  padding: 16px;
  text-align: center;
  color: var(--color-error-500);
`;
const EmptyMsg = styled.div`
  padding: 32px;
  text-align: center;
  color: #888;
`;
const EndMsg = styled.div`
  padding: 16px;
  text-align: center;
  color: #888;
  font-size: 0.9rem;
`;

const EmptyIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
`;

const SmallText = styled.span`
  font-size: 0.85rem;
  color: #aaa;
  margin-top: 8px;
`;

const Footer = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #eee;
`;

const DismissButton = styled.button`
  background: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-primary-600);
  }
`;

const MarkAllContainer = styled.div`
  padding: 12px 24px;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #eee;
`;

const MarkAllBtn = styled.button`
  background: transparent;
  color: var(--color-primary-500);
  border: 1px solid var(--color-primary-500);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-primary-50);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default NotificationModal; 
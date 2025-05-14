import React, { useEffect, useRef, useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationIcon from '../../assets/images/dashboard/notification-icon.svg';
import { ROUTES } from '../../constants/routes';
import { NotificationUpdateContext } from '../NotificationBadge';

/**
 * NotificationModal - displays user notifications in a dropdown
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {React.RefObject} props.anchorEl - Reference to the notification icon element
 */
const NotificationModal = ({ open, onClose, anchorEl }) => {
  const contentRef = useRef(null);
  const modalRef = useRef(null);
  const { triggerRefresh = () => {} } = useContext(NotificationUpdateContext) || {};
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      
      // Recalculate position on resize
      if (open && anchorEl && anchorEl.current) {
        const rect = anchorEl.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          right: window.innerWidth - rect.right
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, anchorEl]);

  // Calculate position when modal opens or anchor element changes
  useEffect(() => {
    if (open && anchorEl && anchorEl.current) {
      const rect = anchorEl.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right
      });
    }
  }, [open, anchorEl]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target) &&
          anchorEl.current && !anchorEl.current.contains(event.target)) {
        onClose();
      }
    }
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose, anchorEl]);

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
    <ModalContainer 
      ref={modalRef}
      style={isMobile ? undefined : { 
        top: `${position.top}px`, 
        right: `${position.right}px` 
      }}
      $isMobile={isMobile}
    >
      {isMobile && <MobileOverlay onClick={onClose} />}
      <ModalContent $isMobile={isMobile}>
        <Header $isMobile={isMobile}>
          <Title>Notifications</Title>
          <ShowAllLink to={ROUTES.NOTIFICATIONS}>View all</ShowAllLink>
          {isMobile && (
            <CloseButton onClick={onClose}>×</CloseButton>
          )}
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
      </ModalContent>
    </ModalContainer>
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
const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: ${props => props.$isMobile ? 'fixed' : 'absolute'};
  ${props => props.$isMobile ? `
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
  ` : `
    z-index: 1001;
    margin-top: 8px;
  `}
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  width: ${props => props.$isMobile ? '90%' : '380px'};
  max-width: 95vw;
  max-height: ${props => props.$isMobile ? '80vh' : '600px'};
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  position: relative;
  
  ${props => !props.$isMobile && `
    /* Add a subtle arrow at the top for desktop */
    &::before {
      content: '';
      position: absolute;
      top: -8px;
      right: 20px;
      width: 16px;
      height: 16px;
      background: white;
      transform: rotate(45deg);
      box-shadow: -3px -3px 5px rgba(0,0,0,0.04);
    }
  `}

  @media (max-width: 480px) {
    width: 95%;
    max-height: 85vh;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.$isMobile ? '20px 24px' : '16px 20px'};
  position: relative;
  z-index: 1;
  background: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;

  @media (max-width: 480px) {
    padding: 16px 20px;
  }
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const ShowAllLink = styled(Link)`
  color: var(--color-primary-500);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  margin-left: auto;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-primary-50);
    text-decoration: underline;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 5px 8px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #888;
  margin-left: 12px;
  cursor: pointer;
  line-height: 1;
`;

const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 0;
`;

const Content = styled.div`
  max-height: 450px;
  overflow-y: auto;
  padding: 0 0 8px 0;
  flex: 1;

  @media (max-width: 768px) {
    max-height: calc(70vh - 140px);
  }
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: ${({ $read }) => ($read ? '#f7f7f7' : '#fff')};
  position: relative;
  cursor: ${({ $read }) => ($read ? 'default' : 'pointer')};
  
  &:hover {
    background: ${({ $read }) => ($read ? '#f7f7f7' : '#f0f8f6')};
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
  }
`;

const Dot = styled.div`
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

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e6f0ed;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }
`;

const IconImg = styled.img`
  width: 28px;
  height: 28px;

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
  }
`;

const NotificationContent = styled.div`
  flex: 1;
  word-break: break-word;
`;

const NotifTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 2px;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const NotifMsg = styled.div`
  color: #222;
  font-size: 1rem;
  margin-bottom: 6px;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const NotifTime = styled.div`
  color: #b0b0b0;
  font-size: 0.95rem;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
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

  @media (max-width: 480px) {
    padding: 12px 16px;
  }
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

  @media (max-width: 480px) {
    padding: 7px 20px;
    font-size: 0.9rem;
  }
`;

const MarkAllContainer = styled.div`
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #eee;

  @media (max-width: 480px) {
    padding: 10px 16px;
  }
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

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 0.8rem;
  }
`;

export default NotificationModal; 
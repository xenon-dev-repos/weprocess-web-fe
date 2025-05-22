import React, { useEffect, useRef, useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationIcon from '../../assets/images/dashboard/notification-icon.svg';
import { ROUTES } from '../../constants/routes';
import { NotificationUpdateContext } from '../NotificationBadge';
import { formatNotificationText, formatTimeAgo } from '../../utils/helperFunctions.jsx';

const NotificationModal = ({ open, onClose, anchorEl }) => {
  const contentRef = useRef(null);
  const modalRef = useRef(null);
  const { triggerRefresh = () => {} } = useContext(NotificationUpdateContext) || {};
  // const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isMobile] = useState(window.innerWidth <= 768);
  const { 
    notifications, 
    loading,
    error, 
    pagination,
    loadMore,
    refresh,
    markAsRead,
    // markAllAsRead
  } = useNotifications();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (!anchorEl?.current?.contains(event.target)) {
          onClose();
        }
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

  const handleMarkAsRead = useCallback(async (id) => {
    const success = await markAsRead(id);
    if (success) {
      triggerRefresh();
    }
  }, [markAsRead, triggerRefresh]);

  // const handleMarkAllAsRead = useCallback(async () => {
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
  // }, [markAllAsRead, triggerRefresh, isMarkingAll, loading]);

  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    if (isNearBottom && !loading && pagination.current_page < pagination.last_page) {
      loadMore();
    }
  }, [loading, loadMore, pagination]);

  useEffect(() => {
    const contentEl = contentRef.current;
    if (contentEl) {
      contentEl.addEventListener('scroll', handleScroll);
      return () => contentEl.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  if (!open) return null;

  return (
    <ModalContainer ref={modalRef} $isMobile={isMobile}>
      <Header>
        <Title>All notifications</Title>
        <ShowAllLink to={ROUTES.NOTIFICATIONS} onClick={onClose}>Show all</ShowAllLink>
        {isMobile && <CloseButton onClick={onClose}>×</CloseButton>}
      </Header>
      <Divider />
      <Content ref={contentRef}>
        {notifications.length === 0 && !loading && !error ? (
          <EmptyState>
            <EmptyIcon>📬</EmptyIcon>
            <p>No notifications found.</p>
            <SmallText>New notifications will appear here</SmallText>
          </EmptyState>
        ) : (
          <>
            {/* {notifications.some(n => !n.read) && (
              <MarkAllContainer>
                <MarkAllBtn onClick={handleMarkAllAsRead} disabled={isMarkingAll}>
                  {isMarkingAll ? 'Marking...' : 'Mark all as read'}
                </MarkAllBtn>
              </MarkAllContainer>
            )} */}
            
            {notifications.slice(0, 7).map((n) => (
              <NotificationItem 
                key={n.id} 
                $read={n.read}
                onClick={() => !n.read && handleMarkAsRead(n.id)}
              >
                <StatusIndicator $read={n.read} />
                <IconContainer>
                  <NotifIcon src={NotificationIcon} alt="Notification" />
                </IconContainer>
                <NotificationContent>
                  <NotificationText>
                    {formatNotificationText(n.title, n.message)}
                  </NotificationText>
                  <NotifTime>{formatTimeAgo(n.timestamp)}</NotifTime>
                </NotificationContent>
              </NotificationItem>
            ))}
            
            {error && <ErrorMsg>{error}</ErrorMsg>}
            {loading && <Loading>Loading more notifications...</Loading>}
            {/* {!loading && !error && pagination.current_page >= pagination.last_page && (
              <EndMsg>No more notifications to load</EndMsg>
            )} */}
          </>
        )}
      </Content>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  position: absolute;
  right: 35px;
  top: 133px;
  width: 374px;
  min-height: 226px;
  border-radius: 20px;
  background-color: white;
  padding: 8px 0px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1001;

  /* Large desktop */
  @media (max-width: 1440px) {
    width: 340px;
    right: 35px;
    top: 130px;
    padding: 8px 0px;
  }

  /* Medium desktop */
  @media (max-width: 1280px) {
    width: 320px;
    right: 30px;
    top: 125px;
    padding: 7px 0px;
  }

  /* Small desktop */
  @media (max-width: 1024px) {
    width: 300px;
    right: 25px;
    top: 110px;
    padding: 6px 0px;
  }

  /* Tablet */
  @media (max-width: 768px) {
    width: 260px;
    right: 23px;
    top: 105px;
    padding: 6px 0px;
    min-height: 200px;
  }

  /* Large mobile */
  @media (max-width: 480px) {
    width: 220px;
    top: 100px;
    padding: 5px 0px;
    min-height: 180px;
    border-radius: 16px;
  }

  /* Small mobile */
  @media (max-width: 375px) {
    width: 200px;
    padding: 5px 0px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 12px;
  height: 33px;
  background: #FFFFFF;
`;

const Title = styled.h3`
  font-weight: 500;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
  flex: 1;
  color: #2d3748;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ShowAllLink = styled(Link)`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0%;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-offset: 0%;
  text-decoration-thickness: 0%;
  text-decoration-skip-ink: auto;
  color: #126456;
  padding: 0px 8px 2px 8px;
  animation: all 0.5 ease-out;

  &:hover {
    color: #0a4238;
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #718096;
  cursor: pointer;
  padding: 0 0 0 12px;
  line-height: 1;
`;

const Divider = styled.div`
  height: 1px;
  background: #E2E8F0;
  width: cal(100% - 16px);
  margin: 0 -8px;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: hidden;
  max-height: calc(745px + 73px); /* 73px is header + divider height */
  padding-bottom: 8px;

  @media (max-width: 1440px) {
    max-height: calc(700px + 73px);
  }

  @media (max-width: 1280px) {
    max-height: calc(660px + 73px);
  }

  @media (max-width: 1024px) {
    max-height: calc(620px + 73px);
  }

  @media (max-width: 768px) {
    max-height: calc(580px + 73px);
  }

  @media (max-width: 480px) {
    max-height: calc(500px + 73px);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  text-align: center;
  color: #718096;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const SmallText = styled.p`
  font-family: Manrope;
  font-size: 14px;
  color: #A0AEC0;
  margin-top: 8px;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 8px;
  height: 100px;
  cursor: ${({ $read }) => $read ? 'default' : 'pointer'};
  background: ${({ $read }) => $read ? '#FFFFFF' : '#F8FAFC'};
  border-bottom: 1px solid #EDF2F7;

  &:hover {
    background: ${({ $read }) => $read ? '#FFFFFF' : '#F0FDF4'};
  }

  @media (max-width: 768px) {
    height: 90px;
    padding: 12px;
  }
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid ${({ $read }) => $read ? '#ACACAC' : '#5F0808'};
  background: ${({ $read }) => $read ? 'transparent' : '#B22222'};
  margin-top: -6px;
  margin-right: -6px;
  flex-shrink: 0;
`;

const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: #043F35;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NotifIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const NotifTime = styled.div`
  font-family: Manrope;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #A5ACB8;
`;

const Loading = styled.div`
  padding: 16px;
  text-align: center;
  color: #718096;
  font-size: 14px;
`;

const ErrorMsg = styled.div`
  padding: 16px;
  text-align: center;
  color: #E53E3E;
  font-size: 14px;
`;

const EndMsg = styled.div`
  padding: 16px;
  text-align: center;
  color: #718096;
  font-size: 14px;
`;

export default NotificationModal;

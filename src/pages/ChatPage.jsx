import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { MainLayout } from "../layouts/MainLayout";
import { useAuth } from "../contexts/AuthContext";
import {
  FallbackChatSidebar,
  FallbackChatWindow,
} from "../components/chat/FallbackComponents";
import { useChat } from "../hooks/useChat";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { SubLayout } from "../layouts/SubLayout";

// Define a basic error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Chat component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <h3>Something went wrong with the chat component.</h3>
          <p>Please try again later or contact support.</p>
          <button onClick={() => window.location.reload()}>Reload page</button>
          <p style={{ color: "#777", fontSize: "12px" }}>
            Error: {this.state.error?.message || "Unknown error"}
          </p>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Lazy load the chat components to handle any import errors
const ChatSidebar = React.lazy(() =>
  import("../components/chat/ChatSidebar").catch((err) => {
    console.error("Failed to load ChatSidebar:", err);
    return { default: FallbackChatSidebar };
  })
);

const ChatWindow = React.lazy(() =>
  import("../components/chat/ChatWindow").catch((err) => {
    console.error("Failed to load ChatWindow:", err);
    return { default: FallbackChatWindow };
  })
);

const RateLimitBanner = ({ visible }) => {
  if (!visible) return null;

  return (
    <RateLimitWarning>
      <WarningIcon>⚠️</WarningIcon>
      <WarningText>
        The server is experiencing high traffic. Chat updates will be less
        frequent.
      </WarningText>
    </RateLimitWarning>
  );
};

const AuthErrorBanner = ({ visible, onLogin }) => {
  if (!visible) return null;

  return (
    <AuthErrorContainer>
      <WarningIcon>🔑</WarningIcon>
      <WarningText>Your session has expired. Please sign in again.</WarningText>
      <LoginButton onClick={onLogin}>Sign In</LoginButton>
    </AuthErrorContainer>
  );
};

const StoppedRequestsBanner = ({ visible, onRefresh }) => {
  if (!visible) return null;

  const handleRefresh = () => {
    console.log("Manual refresh requested");
    // Clear any incorrect flags that might be persisting
    localStorage.removeItem("requestsStopped");
    // Call the provided refresh handler
    onRefresh();
  };

  return (
    <StoppedContainer>
      <WarningIcon>🛑</WarningIcon>
      <WarningText>
        The chat service appears unavailable. This might be a temporary
        connection issue.
      </WarningText>
      <RefreshButton onClick={handleRefresh}>Refresh</RefreshButton>
    </StoppedContainer>
  );
};

// Add a NoChatsMessage component
const NoChatsMessage = () => (
  <NoChatsContainer>
    <NoChatsIcon>💬</NoChatsIcon>
    <NoChatsTitle>No Chat Sessions Found</NoChatsTitle>
    <NoChatsText>
      There are currently no active chat sessions available.
    </NoChatsText>
  </NoChatsContainer>
);

const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Flag to prevent duplicate renders on navigation
  const hasRendered = useRef(false);

  // Use the optimized useChat hook once, preventing multiple initializations
  const {
    loading,
    chatSessions,
    currentSession,
    messages,
    pagination,
    selectSession,
    sendMessage,
    loadMoreSessions,
    rateLimited,
    authError,
    requestsStopped,
    manualRefresh,
    initialLoad,
  } = useChat();

  // Handle login redirect
  const handleLogin = () => {
    logout();
    navigate(ROUTES.SIGNIN);
  };

  // Mark that this component has rendered, preventing additional session calls
  useEffect(() => {
    if (!hasRendered.current) {
      // Set a flag in localStorage to indicate the chat page is loaded
      localStorage.setItem("chatPageLoaded", "true");

      // Add a timestamp to track when the chat page was loaded
      localStorage.setItem("chatPageLoadTime", Date.now().toString());

      hasRendered.current = true;
    }

    // Clean up flag when component unmounts
    return () => {
      localStorage.removeItem("chatPageLoaded");
      localStorage.removeItem("chatPageLoadTime");
    };
  }, []);

  // Add a check to reset the requestsStopped flag when we appear to have a connection
  useEffect(() => {
    // If we have sessions data but requestsStopped is still true,
    // something might be wrong with our state management
    if (requestsStopped && chatSessions.length > 0) {
      console.log(
        "Found sessions data while requestsStopped is true, triggering reset"
      );
      // Wait a little before attempting to reset
      setTimeout(() => {
        manualRefresh();
      }, 1000);
    }
  }, [chatSessions, requestsStopped, manualRefresh]);

  // Calculate if any banner is shown to adjust container height
  const isBannerVisible = rateLimited || authError || requestsStopped;

  return (
    <MainLayout isChatPage={true}>
      <SubLayout
        pageTitle={"Chats"}
        title={currentSession?.participant?.name || "title"}
        chatSessionsCount={chatSessions.length}
        showTitle={
          !(chatSessions.length === 0 && (!loading || initialLoad.current))
        }
      >
        {/* Left Section Content */}
        <>
          <React.Suspense fallback={<div>Loading sidebar...</div>}>
            <ChatSidebar
              sessions={chatSessions}
              currentSession={currentSession}
              onSelectSession={selectSession}
              loading={loading}
            />
          </React.Suspense>
        </>

        {/* Right Section Content */}
        <>
          <ChatContainer bannerVisible={isBannerVisible}>
            <ErrorBoundary>
              <AuthErrorBanner visible={authError} onLogin={handleLogin} />
              <RateLimitBanner
                visible={rateLimited && !requestsStopped && !authError}
              />
              <StoppedRequestsBanner
                visible={requestsStopped}
                onRefresh={manualRefresh}
              />
              <React.Suspense fallback={<div>Loading chat window...</div>}>
                {chatSessions.length === 0 &&
                (!loading || initialLoad.current) ? (
                  <NoChatsMessage />
                ) : (
                  <ChatWindow
                    session={currentSession}
                    messages={messages}
                    currentUser={user}
                    onSendMessage={sendMessage}
                    loading={loading}
                    disabled={authError || requestsStopped}
                    authError={authError}
                  />
                )}
              </React.Suspense>
            </ErrorBoundary>
          </ChatContainer>
        </>

        {pagination.totalPages > 1 && !authError && !requestsStopped && (
          <PaginationContainer>
            <PaginationButton
              onClick={() => loadMoreSessions(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || loading}
            >
              Previous
            </PaginationButton>
            <PaginationInfo>
              Page {pagination.currentPage} of {pagination.totalPages}
            </PaginationInfo>
            <PaginationButton
              onClick={() => loadMoreSessions(pagination.currentPage + 1)}
              disabled={
                pagination.currentPage === pagination.totalPages || loading
              }
            >
              Next
            </PaginationButton>
          </PaginationContainer>
        )}
      </SubLayout>
    </MainLayout>
  );
};

const ChatContainer = styled.div`
  display: flex;
  height: ${(props) =>
    props.bannerVisible ? "calc(100vh - 120px)" : "calc(100vh - 80px)"};
  width: 100%;
  // background-color: #fff;
  // border-radius: 8px;
  // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    height: ${(props) =>
      props.bannerVisible ? "calc(100vh - 110px)" : "calc(100vh - 70px)"};
  }
`;

const RateLimitWarning = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff3cd;
  color: #856404;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  border-left: 4px solid #ffc107;
`;

const AuthErrorContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  border-left: 4px solid #dc3545;
`;

const StoppedContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #d1ecf1;
  color: #0c5460;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  border-left: 4px solid #17a2b8;
`;

const LoginButton = styled.button`
  background-color: #1e473c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  margin-left: auto;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #2e6a5b;
  }
`;

const RefreshButton = styled.button`
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  margin-left: auto;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #138496;
  }
`;

const WarningIcon = styled.span`
  margin-right: 10px;
  font-size: 18px;
`;

const WarningText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 200px);
  text-align: center;
  padding: 20px;

  h3 {
    color: #e74c3c;
    margin-bottom: 10px;
  }

  button {
    margin-top: 20px;
    padding: 8px 16px;
    background-color: #1e473c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #2e6a5b;
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  gap: 10px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
`;

const PaginationButton = styled.button`
  padding: 8px 16px;
  background-color: ${(props) => (props.disabled ? "#f2f2f2" : "#1E473C")};
  color: ${(props) => (props.disabled ? "#888" : "white")};
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};

  &:hover {
    background-color: ${(props) => (props.disabled ? "#f2f2f2" : "#2e6a5b")};
  }
`;

const PaginationInfo = styled.span`
  font-size: 14px;
  color: #666;
`;

// Add the styled components for NoChatsMessage
const NoChatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
`;

const NoChatsIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const NoChatsTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const NoChatsText = styled.p`
  font-size: 16px;
  color: #666;
  max-width: 400px;
`;

export default ChatPage;

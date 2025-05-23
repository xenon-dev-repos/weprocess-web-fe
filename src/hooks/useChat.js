import { useState, useEffect, useCallback, useRef } from 'react';
import { CreateApiService } from '../services/ApiService';
import { useToast } from '../services/ToastService';
import { API_ENDPOINTS } from '../constants/api';
import { GLOBAL_SESSION_REQUEST } from '../utils/RequestTracker'; 
import { useAuth } from '../contexts/AuthContext';

export const useChat = () => {
  const { user } = useAuth(); // Assuming useAuth is a custom hook to get user info
  const [loading, setLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [authError, setAuthError] = useState(false);
  const [requestsStopped, setRequestsStopped] = useState(false);
  const toast = useToast();
  const api = CreateApiService(toast, setLoading);
  const fetchInProgress = useRef(false);
  const sessionsCache = useRef({});
  const messagesCache = useRef({});
  const lastError = useRef(null);
  const initialLoad = useRef(true);
  const pollingInterval = useRef(120000); // 2 minutes polling interval
  const sessionCallMade = useRef(false);
  const lastSessionCallTime = useRef(0);
  const pendingSessionCall = useRef(false);
  const currentPage = useRef(1);
  const lastMessageFetchTime = useRef(0);
  const lastMessageFetchTimeBySession = useRef({});

  // Check if token exists before making requests
  const checkToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      setAuthError(true);
      toast.showError('Authentication required. Please sign in again.');
      return false;
    }
    return true;
  }, [toast]);

  // Handle stopping requests after first failure
  const stopRequests = useCallback(() => {
    if (!requestsStopped) {
      console.warn('Request failed, stopping all future requests');
      setRequestsStopped(true);
      toast.showWarning('Chat service is unavailable. Manual refresh required.');
    }
  }, [requestsStopped, toast]);

  // Improved debounced fetch with caching, proper authentication and rate limit handling
  const debouncedFetchSessions = useCallback(async (page = 1, perPage = 10, force = false) => {
    if (fetchInProgress.current && !force) return;
    
    currentPage.current = page;
    
    if (requestsStopped && !force) {
      console.log('Requests are stopped. Skipping fetch sessions.');
      return;
    }
    
    if (sessionCallMade.current && !force) {
      console.log('Session call already made successfully, skipping to prevent duplicate calls');
      return;
    }
    
    if (!checkToken()) return;
    
    if (GLOBAL_SESSION_REQUEST.inProgress && !force) {
      console.log('GLOBAL: Session request already in progress, skipping duplicate call');
      return;
    }
    
    const now = Date.now();
    const minInterval = initialLoad.current ? 0 : 60000;
    const timeSinceLastCall = now - Math.max(
      lastSessionCallTime.current, 
      GLOBAL_SESSION_REQUEST.lastRequestTime
    );
    
    if (!force && timeSinceLastCall < minInterval) {
      console.log(`Throttling API request - too soon since last request (${timeSinceLastCall}ms)`);
      
      if (!pendingSessionCall.current && !GLOBAL_SESSION_REQUEST.pendingRequest) {
        const delay = minInterval - timeSinceLastCall;
        console.log(`Scheduling session fetch in ${delay}ms`);
        pendingSessionCall.current = true;
        GLOBAL_SESSION_REQUEST.pendingRequest = true;
        
        setTimeout(() => {
          console.log('Executing scheduled session fetch');
          pendingSessionCall.current = false;
          GLOBAL_SESSION_REQUEST.pendingRequest = false;
          debouncedFetchSessions(page, perPage, true);
        }, delay);
      }
      return;
    }
    
    const cacheKey = `page_${page}_${perPage}_${localStorage.getItem('token')?.substring(0, 10) || 'notoken'}`;
    
    if (!force && sessionsCache.current[cacheKey] && now - sessionsCache.current[cacheKey].timestamp < 300000) {
      const cachedData = sessionsCache.current[cacheKey].data;
      setChatSessions(cachedData.data);
      setPagination({
        currentPage: cachedData.pagination.current_page,
        totalPages: cachedData.pagination.last_page,
        total: cachedData.pagination.total
      });
      
      if (!currentSession && cachedData.data.length > 0) {
        setCurrentSession(cachedData.data[0]);
      }
      
      console.log('Using cached sessions data');
      return;
    }
    
    fetchInProgress.current = true;
    GLOBAL_SESSION_REQUEST.inProgress = true;
    lastSessionCallTime.current = now;
    GLOBAL_SESSION_REQUEST.lastRequestTime = now;
    
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const url = `${API_ENDPOINTS.GET_CHAT_SESSIONS}?page=${page}&per_page=${perPage}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      });
      
      if (response.ok) {
        if (requestsStopped) {
          console.log('Resetting requestsStopped flag due to successful API response');
          setRequestsStopped(false);
        }
      } else {
        stopRequests();
        
        if (response.status === 401) {
          setAuthError(true);
          throw new Error('Authentication failed. Please sign in again.');
        } else if (response.status === 429) {
          throw new Error('429 Too Many Requests');
        } else {
          throw new Error(`HTTP error ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      if (Array.isArray(data.data) && data.data.length === 0 && data.pagination) {
        console.log('Received empty data array');
        sessionsCache.current[cacheKey] = {
          data,
          timestamp: now
        };
        
        setChatSessions([]);
        setPagination({
          currentPage: data.pagination.current_page || 1,
          totalPages: data.pagination.last_page || 0,
          total: data.pagination.total || 0
        });
        
        setLastFetchTime(now);
        initialLoad.current = false;
        lastError.current = null;
        sessionCallMade.current = true;
        return;
      }
      
      // In your useChat hook, modify the session data handling:
      if (data.data && data.pagination) {
        sessionsCache.current[cacheKey] = {
          data,
          timestamp: now
        };
        
        setChatSessions(data.data);
        setPagination({
          currentPage: data.pagination.current_page,
          totalPages: data.pagination.last_page,
          total: data.pagination.total
        });
        
        // Auto-select the first session if none is selected
        if (!currentSession && data.data.length > 0) {
          setCurrentSession(data.data[0]);
          // Immediately fetch messages for this session
          fetchMessages(true);
        }
      } else {
        console.error('Invalid response format:', data);
        if (force) toast.showError('Invalid chat sessions response format');
      }
      
      setLastFetchTime(now);
      initialLoad.current = false;
      lastError.current = null;
      sessionCallMade.current = true;
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      lastError.current = error;
      
      if (error.message && error.message.includes('401')) {
        setAuthError(true);
        if (force) toast.showError('Authentication failed. Please sign in again.');
      } else if (error.message && error.message.includes('429')) {
        if (force) toast.showError('Server is busy. Please try again later.');
      } else if (force) {
        toast.showError('Failed to load chat sessions');
      }
      
      if (sessionsCache.current[cacheKey]) {
        console.log('Falling back to cached sessions data after error');
        const cachedData = sessionsCache.current[cacheKey].data;
        setChatSessions(cachedData.data);
        setPagination({
          currentPage: cachedData.pagination.current_page,
          totalPages: cachedData.pagination.last_page,
          total: cachedData.pagination.total
        });
      }
    } finally {
      setTimeout(() => {
        fetchInProgress.current = false;
        GLOBAL_SESSION_REQUEST.inProgress = false;
      }, 500);
      setLoading(false);
    }
  }, [api, currentSession, toast, lastFetchTime, checkToken, authError, requestsStopped, stopRequests]);

  // Fetch messages for the current session with caching
  const fetchMessages = useCallback(async (force = false) => {
    if (!currentSession) return;
    if (requestsStopped && !force) {
      console.log('Requests are stopped. Skipping fetch messages.');
      return;
    }
    if (!checkToken()) return;
    if (fetchInProgress.current && !force) return;
    
    const now = Date.now();
    const minMessageInterval = 30000;
    const lastMsgFetchTime = messagesCache.current[`last_fetch_${currentSession.chat_session_id}`] || 0;
    
    if (!force && now - lastMsgFetchTime < minMessageInterval) {
      console.log('Throttling message API request - too soon since last request');
      return;
    }
    
    const cacheKey = `session_${currentSession.chat_session_id}`;
    if (!force && messagesCache.current[cacheKey] && now - messagesCache.current[cacheKey].timestamp < 180000) {
      setMessages(messagesCache.current[cacheKey].data);
      console.log('Using cached messages data');
      return;
    }
    
    fetchInProgress.current = true;
    try {
      setLoading(true);
      const sessionId = currentSession.chat_session_id;
      
      const url = API_ENDPOINTS.GET_CHAT_MESSAGES.replace(':sessionId', sessionId);
      const token = localStorage.getItem('token');
      
      console.log(`[${new Date().toISOString()}] Fetching messages for session`, sessionId);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      });
      
      messagesCache.current[`last_fetch_${currentSession.chat_session_id}`] = now;
      lastMessageFetchTime.current = now;
      
      if (response.ok) {
        if (requestsStopped) {
          console.log('Resetting requestsStopped flag due to successful messages API response');
          setRequestsStopped(false);
        }

        // Update last fetch time for this session
        lastMessageFetchTimeBySession.current[sessionId] = now;
        
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
          messagesCache.current[cacheKey] = {
            data: data,
            timestamp: now
          };
          
          const currentMessageIds = new Set(messages.map(m => m.message_id));
          const hasNewMessages = data.some(m => !currentMessageIds.has(m.message_id));
          
          if (hasNewMessages || force) {
            setMessages(data);
            
            if (hasNewMessages) {
              try {
                await api.markChatAsRead(sessionId);
                
                setCurrentSession(prev => ({
                  ...prev,
                  unread_count: 0
                }));
                
                setChatSessions(prev => prev.map(session => {
                  if (session.chat_session_id === sessionId) {
                    return {
                      ...session,
                      unread_count: 0
                    };
                  }
                  return session;
                }));
              } catch (markError) {
                console.error('Error marking chat as read:', markError);
              }
            }
          }
        }
        
        lastError.current = null;
      } else {
        if (response.status === 401) {
          setAuthError(true);
          throw new Error('Authentication failed. Please sign in again.');
        } else if (response.status === 429) {
          throw new Error('429 Too Many Requests');
        } else {
          throw new Error(`HTTP error ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      lastError.current = error;
      stopRequests();
      
      if (error.message && error.message.includes('401')) {
        setAuthError(true);
        if (force) toast.showError('Authentication failed. Please sign in again.');
      } else if (error.message && error.message.includes('429')) {
        if (force) toast.showError('Server is busy. Please try again later.');
      } else if (force) {
        toast.showError('Failed to load messages');
      }
      
      if (messagesCache.current[cacheKey]) {
        setMessages(messagesCache.current[cacheKey].data);
      }
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, [api, currentSession, messages, toast, checkToken, authError, requestsStopped, stopRequests]);

  // Manual refresh function
  const manualRefresh = useCallback(() => {
    console.log('Manual refresh triggered, resetting requestsStopped');
    setRequestsStopped(false);
    sessionCallMade.current = false;
    lastError.current = null;
    lastMessageFetchTimeBySession.current = {}; 
    
    setTimeout(() => {
      debouncedFetchSessions(pagination.currentPage, 10, true);
      if (currentSession) {
        fetchMessages(true);
      }
    }, 100);
  }, [debouncedFetchSessions, fetchMessages, pagination.currentPage, currentSession]);

  // Initial load effect
  useEffect(() => {
    if (authError || requestsStopped) return;
    
    const loadInitialData = async () => {
      if (!sessionCallMade.current) {
        if (!GLOBAL_SESSION_REQUEST.inProgress && 
            Date.now() - GLOBAL_SESSION_REQUEST.lastRequestTime > 30000) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          debouncedFetchSessions(1, 10, true);
        }
      }
    };
    
    loadInitialData();
  }, [debouncedFetchSessions, authError, requestsStopped]);

  // Load messages when current session changes
useEffect(() => {
  if (!currentSession || authError || requestsStopped) return;

  const sessionId = currentSession.chat_session_id;
  const now = Date.now();
  const lastFetch = lastMessageFetchTimeBySession.current[sessionId] || 0;
  const timeSinceLastFetch = now - lastFetch;

  // Only fetch if:
  // 1. We haven't fetched messages for this session yet, OR
  // 2. It's been more than 30 seconds since last fetch
  const shouldFetch = timeSinceLastFetch > 30000;

  if (shouldFetch) {
    console.log(`Fetching messages for session ${sessionId} after session change`);
    const timer = setTimeout(() => {
      if (!fetchInProgress.current) {
        fetchMessages(true);
      }
    }, 1000); // Small delay to allow other operations to complete
    
    return () => clearTimeout(timer);
  } else {
    console.log(`Skipping message fetch for session ${sessionId}, recently fetched ${Math.floor(timeSinceLastFetch/1000)}s ago`);
  }
}, [currentSession?.chat_session_id, authError, requestsStopped]);

  // Polling effect
  useEffect(() => {
    if (authError || requestsStopped) return () => {};
    
    let timeoutId;
    let isFirstPoll = true;
    
    const poll = () => {
      if (requestsStopped || fetchInProgress.current) {
        console.log('Skipping poll - requests stopped or fetch in progress');
        return;
      }
      
      const lastUserActivity = parseInt(localStorage.getItem('lastUserActivity') || Date.now());
      const inactiveThreshold = 10 * 60 * 1000;
      const isUserActive = (Date.now() - lastUserActivity) < inactiveThreshold;
      const hasGlobalRequest = GLOBAL_SESSION_REQUEST.inProgress || 
                            (Date.now() - GLOBAL_SESSION_REQUEST.lastRequestTime < 30000);
      
      if (isUserActive && !hasGlobalRequest) {
        if (currentSession && document.visibilityState === 'visible') {
          const timeSinceLastMsgFetch = Date.now() - lastMessageFetchTime.current;
          if (timeSinceLastMsgFetch > 30000) { // Only fetch if >30s since last fetch
            fetchMessages();
          }
        } else if (!sessionCallMade.current && !pendingSessionCall.current) {
          debouncedFetchSessions(currentPage.current, 10);
        }
      }
      
      if (!requestsStopped) {
        const jitter = Math.random() * 6000 - 3000;
        const delay = isFirstPoll 
          ? pollingInterval.current * 2 + jitter
          : pollingInterval.current + jitter;
        
        timeoutId = setTimeout(poll, delay);
        isFirstPoll = false;
      }
    };
    
    const updateActivity = () => {
      localStorage.setItem('lastUserActivity', Date.now().toString());
    };
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateActivity();
        if (currentSession && !requestsStopped && !fetchInProgress.current) {
          fetchMessages(true);
        }
      }
    };
    
    window.addEventListener('click', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('mousemove', updateActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const initialDelay = 180000 + (Math.random() * 30000);
    timeoutId = setTimeout(poll, initialDelay);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('mousemove', updateActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      pendingSessionCall.current = false;
      GLOBAL_SESSION_REQUEST.pendingRequest = false;
    };
  }, [currentSession, debouncedFetchSessions, fetchMessages, authError, requestsStopped]);

  // Reset polling interval when no errors
  useEffect(() => {
    if (!lastError.current && pollingInterval.current > 120000 && !requestsStopped) {
      const resetInterval = setInterval(() => {
        pollingInterval.current = Math.max(pollingInterval.current * 0.97, 120000);
      }, 300000);

      lastMessageFetchTimeBySession.current = {};
      
      return () => clearInterval(resetInterval);
    }
  }, [requestsStopped]);

  // Handle selecting a chat session
  const selectSession = (session) => {
    if (session.chat_session_id !== currentSession?.chat_session_id) {
      setCurrentSession(session);
    }
  };

  // Handle sending a new message
 // Handle sending a new message with proper form data structure
const sendMessage = async (content, mediaFile = null) => {
  if ((!content || !content.trim()) && !mediaFile) return;
  if (!currentSession) return;
  if (!checkToken()) return;

  try {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('chat_session_id', currentSession.chat_session_id);
    formData.append('to_type', 'client');
    
    if (content && content.trim()) {
      formData.append('text', content.trim());
    }
    
    if (mediaFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 
                         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!validTypes.includes(mediaFile.type)) {
        throw new Error('Invalid file type. Only jpeg, jpg, png, pdf, doc, docx are allowed.');
      }
      
      formData.append('media', mediaFile);
    }

    const url = API_ENDPOINTS.SEND_MESSAGE;
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (response.ok) {
      if (requestsStopped) {
        console.log('Resetting requestsStopped flag due to successful message send');
        setRequestsStopped(false);
      }
      
      // Create optimistic update
      const newMessage = {
        id: Date.now(), // Temporary ID
        message_id: Date.now(), // Temporary ID
        chat_session_id: currentSession.chat_session_id,
        sender_id: user?.id, // Assuming user is available in scope
        text: content,
        media_url: mediaFile ? URL.createObjectURL(mediaFile) : null,
        created_at: new Date().toISOString(),
        is_read: true,
        to_type: 'client'
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Update the latest message in sessions list
      setChatSessions(prev => prev.map(session => {
        if (session.chat_session_id === currentSession.chat_session_id) {
          return {
            ...session,
            latest_message: {
              ...session.latest_message,
              text: content || '[Media]',
              timestamp: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
          };
        }
        return session;
      }));
      
      // Fetch updated messages after a delay
      setTimeout(() => {
        if (!fetchInProgress.current) {
          fetchMessages(true);
        }
      }, 3000);
    } else {
      if (response.status === 401) {
        setAuthError(true);
        throw new Error('Authentication failed. Please sign in again.');
      } else if (response.status === 429) {
        throw new Error('429 Too Many Requests');
      } else {
        throw new Error(`HTTP error ${response.status}`);
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);
    stopRequests();
    
    if (error.message && error.message.includes('401')) {
      setAuthError(true);
      toast.showError('Authentication failed. Please sign in again.');
    } else if (error.message && error.message.includes('429')) {
      toast.showError('Unable to send message (rate limited). Please try again in a moment.');
    } else if (error.message.includes('Invalid file type')) {
      toast.showError(error.message);
    } else {
      toast.showError('Failed to send message');
    }
    
    // Remove optimistic update if there was an error
    setMessages(prev => prev.filter(msg => msg.id !== Date.now()));
  } finally {
    setLoading(false);
  }
};

  // Load more sessions (pagination)
  const loadMoreSessions = (page) => {
    if (authError) {
      toast.showError('Authentication failed. Please sign in again.');
      return;
    }
    
    if (requestsStopped) {
      toast.showWarning('Chat service is unavailable. Please refresh the page.');
      return;
    }
    
    if (page >= 1 && page <= pagination.totalPages) {
      sessionCallMade.current = false;
      debouncedFetchSessions(page, 10, true);
    }
  };

  return {
    loading,
    chatSessions,
    currentSession,
    messages,
    pagination,
    selectSession,
    sendMessage,
    loadMoreSessions,
    refreshSessions: (page) => {
      sessionCallMade.current = false;
      debouncedFetchSessions(page || pagination.currentPage, 10, true);
    },
    refreshMessages: () => fetchMessages(true),
    rateLimited: requestsStopped,
    authError,
    requestsStopped,
    manualRefresh,
    initialLoad: initialLoad,
  };
};
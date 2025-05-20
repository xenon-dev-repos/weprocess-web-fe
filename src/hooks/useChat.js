import { useState, useEffect, useCallback, useRef } from 'react';
import { CreateApiService } from '../services/ApiService';
import { useToast } from '../services/ToastService';
import { API_ENDPOINTS } from '../constants/api';
import { GLOBAL_SESSION_REQUEST } from '../utils/RequestTracker';

export const useChat = () => {
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
    // Update current page reference to ensure we use consistent pagination
    currentPage.current = page;
    
    // Don't make requests if we've stopped them, unless forced
    if (requestsStopped && !force) {
      console.log('Requests are stopped. Skipping fetch sessions.');
      return;
    }
    
    // Skip if we've already successfully made a session call and this isn't a forced refresh
    if (sessionCallMade.current && !force) {
      console.log('Session call already made successfully, skipping to prevent duplicate calls');
      return;
    }
    
    // First verify token
    if (!checkToken()) return;
    
    // Check global request tracker first - this prevents duplicate calls from multiple components
    if (GLOBAL_SESSION_REQUEST.inProgress && !force) {
      console.log('GLOBAL: Session request already in progress, skipping duplicate call');
      return;
    }
    
    // Skip if a fetch is already in progress, unless forced
    if (fetchInProgress.current && !force) {
      console.log('LOCAL: Session request already in progress, skipping duplicate call');
      return;
    }

    // Skip if there's a pending call scheduled
    if (pendingSessionCall.current && !force) {
      console.log('Session call already pending, skipping to prevent duplicate calls');
      return;
    }
    
    // Further throttle requests - 60s minimum interval
    const now = Date.now();
    const minInterval = initialLoad.current ? 0 : 60000; // No delay on first load
    const timeSinceLastCall = now - Math.max(
      lastSessionCallTime.current, 
      GLOBAL_SESSION_REQUEST.lastRequestTime
    );
    
    if (!force && timeSinceLastCall < minInterval) {
      console.log(`Throttling API request - too soon since last request (${timeSinceLastCall}ms)`);
      
      // Schedule a single fetch at the end of the throttle period if not already pending
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
    
    // Enhanced cache key with more specificity
    const cacheKey = `page_${page}_${perPage}_${localStorage.getItem('token')?.substring(0, 10) || 'notoken'}`;
    
    // Use cached data with increased cache lifetime (5 minutes)
    if (!force && sessionsCache.current[cacheKey] && now - sessionsCache.current[cacheKey].timestamp < 300000) {
      // Use cached data if it's less than 5 minutes old
      const cachedData = sessionsCache.current[cacheKey].data;
      setChatSessions(cachedData.data);
      setPagination({
        currentPage: cachedData.pagination.current_page,
        totalPages: cachedData.pagination.last_page,
        total: cachedData.pagination.total
      });
      
      // Update current session if needed
      if (!currentSession && cachedData.data.length > 0) {
        setCurrentSession(cachedData.data[0]);
      }
      
      console.log('Using cached sessions data');
      return;
    }
    
    // Set both local and global in-progress flags
    fetchInProgress.current = true;
    GLOBAL_SESSION_REQUEST.inProgress = true;
    
    // Update timestamps
    lastSessionCallTime.current = now;
    GLOBAL_SESSION_REQUEST.lastRequestTime = now;
    
    try {
      setLoading(true);
      
      // Make direct API call with proper headers to ensure token is sent
      const token = localStorage.getItem('token');
      const url = `${API_ENDPOINTS.GET_CHAT_SESSIONS}?page=${page}&per_page=${perPage}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store' // Prevent browser caching
      });
      
      // Reset requestsStopped on any successful response, regardless of content
      if (response.ok) {
        // If we get a successful response, always reset the requestsStopped flag
        if (requestsStopped) {
          console.log('Resetting requestsStopped flag due to successful API response');
          setRequestsStopped(false);
        }
      } else {
        // Only stop requests on actual HTTP errors
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
      
      // Add explicit handling for empty data arrays - treat as a successful response
      if (Array.isArray(data.data) && data.data.length === 0 && data.pagination) {
        console.log('Received empty data array');
        // Cache the empty response
        sessionsCache.current[cacheKey] = {
          data,
          timestamp: now
        };
        
        // Update state with empty data
        setChatSessions([]);
        setPagination({
          currentPage: data.pagination.current_page || 1,
          totalPages: data.pagination.last_page || 0,
          total: data.pagination.total || 0
        });
        
        setLastFetchTime(now);
        initialLoad.current = false;
        lastError.current = null;
        
        // Mark that we've successfully made a session call, even if data is empty
        sessionCallMade.current = true;
        
        return;
      }
      
      // Existing code for handling non-empty data
      if (data.data && data.pagination) {
        // Cache the response
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
        
        // If sessions exist, select the first one by default if none selected
        if (!currentSession && data.data.length > 0) {
          setCurrentSession(data.data[0]);
        } else if (currentSession) {
          // Update the current session with fresh data if it exists in the new data
          const updatedCurrentSession = data.data.find(
            session => session.chat_session_id === currentSession.chat_session_id
          );
          if (updatedCurrentSession) {
            setCurrentSession(updatedCurrentSession);
          }
        }
      } else {
        console.error('Invalid response format:', data);
        if (force) toast.showError('Invalid chat sessions response format');
      }
      
      setLastFetchTime(now);
      initialLoad.current = false;
      lastError.current = null;
      
      // Mark that we've successfully made a session call, even if data is empty
      sessionCallMade.current = true;
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      lastError.current = error;
      
      // Only show specific error messages
      if (error.message && error.message.includes('401')) {
        setAuthError(true);
        if (force) toast.showError('Authentication failed. Please sign in again.');
      } else if (error.message && error.message.includes('429')) {
        if (force) toast.showError('Server is busy. Please try again later.');
      } else if (force) {
        toast.showError('Failed to load chat sessions');
      }
      
      // On error, fallback to cache if available regardless of age
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
      // Clear the in-progress flags with a slight delay to prevent race conditions
      setTimeout(() => {
        fetchInProgress.current = false;
        GLOBAL_SESSION_REQUEST.inProgress = false;
      }, 500);
      setLoading(false);
    }
  }, [api, currentSession, toast, lastFetchTime, checkToken, authError, requestsStopped, stopRequests]);

  // Fetch messages for the current session with caching
  const fetchMessages = useCallback(async (force = false) => {
    // Don't fetch if no current session or requests are stopped (unless forced)
    if (!currentSession) return;
    if (requestsStopped && !force) {
      console.log('Requests are stopped. Skipping fetch messages.');
      return;
    }
    if (!checkToken()) return;
    
    // Skip if a fetch is already in progress and not forced
    if (fetchInProgress.current && !force) return;
    
    // Further throttle message requests
    const now = Date.now();
    const minMessageInterval = 30000; // 30 seconds between message fetches
    const lastMsgFetchTime = messagesCache.current[`last_fetch_${currentSession.chat_session_id}`] || 0;
    
    if (!force && now - lastMsgFetchTime < minMessageInterval) {
      console.log('Throttling message API request - too soon since last request');
      return;
    }
    
    // Use cache if available and not forcing - increased cache time from 120s to 180s
    const cacheKey = `session_${currentSession.chat_session_id}`;
    if (!force && messagesCache.current[cacheKey] && now - messagesCache.current[cacheKey].timestamp < 180000) {
      // Use cached messages if less than 3 minutes old
      setMessages(messagesCache.current[cacheKey].data);
      console.log('Using cached messages data');
      return;
    }
    
    fetchInProgress.current = true;
    try {
      setLoading(true);
      // Use chat_session_id instead of id
      const sessionId = currentSession.chat_session_id;
      
      // Make direct API call to ensure proper handling of response status
      const url = API_ENDPOINTS.GET_CHAT_MESSAGES.replace(':sessionId', sessionId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store' // Prevent browser caching
      });
      
      // Track the time of the fetch regardless of result
      messagesCache.current[`last_fetch_${currentSession.chat_session_id}`] = now;
      
      // Reset requestsStopped on any successful response
      if (response.ok) {
        if (requestsStopped) {
          console.log('Resetting requestsStopped flag due to successful messages API response');
          setRequestsStopped(false);
        }
        
        const data = await response.json();
        
        // Add special handling for empty message arrays
        if (data && Array.isArray(data) && data.length === 0) {
          console.log('Received empty messages array');
          
          // Cache the empty messages with a longer cache time
          messagesCache.current[cacheKey] = {
            data: [],
            timestamp: now
          };
          
          setMessages([]);
          
          // Don't stop all requests here (users might send messages)
          setLastFetchTime(now);
          return;
        }
        
        // Only update if data has changed (prevent unnecessary renders)
        const currentMessageIds = new Set(messages.map(m => m.message_id));
        const hasNewMessages = data.some(m => !currentMessageIds.has(m.message_id));
        
        // Cache the messages regardless of changes
        messagesCache.current[cacheKey] = {
          data: data || [],
          timestamp: now
        };
        
        // Only update state if there are changes
        if (hasNewMessages || force) {
          setMessages(data || []);
          
          // Mark this chat as read only if there are new messages
          if (hasNewMessages) {
            try {
              await api.markChatAsRead(sessionId);
              
              // Only update the unread_count in the current session instead of fetching all sessions
              setCurrentSession(prev => ({
                ...prev,
                unread_count: 0
              }));
              
              // Also update the unread count in the sessions list
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
              // Don't show error toast for this to avoid spamming the user
            }
          }
        } else {
          console.log('No message changes detected, skipping state update');
        }
        
        lastError.current = null;
      } else {
        // Only stop requests on actual HTTP errors
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
      
      // Stop requests on actual errors
      stopRequests();
      
      // Only show specific error messages
      if (error.message && error.message.includes('401')) {
        setAuthError(true);
        if (force) toast.showError('Authentication failed. Please sign in again.');
      } else if (error.message && error.message.includes('429')) {
        if (force) toast.showError('Server is busy. Please try again later.');
      } else if (force) {
        toast.showError('Failed to load messages');
      }
      
      // On error, fallback to cache if available
      if (messagesCache.current[cacheKey]) {
        console.log('Falling back to cached messages data after error');
        setMessages(messagesCache.current[cacheKey].data);
      }
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, [api, currentSession, messages, toast, checkToken, authError, requestsStopped, stopRequests]);

  // Manual refresh function that resets the stopped state and forces a fetch
  const manualRefresh = useCallback(() => {
    console.log('Manual refresh triggered, resetting requestsStopped');
    setRequestsStopped(false);
    sessionCallMade.current = false; // Reset flag to allow fetching sessions again
    
    // Clear any error state
    lastError.current = null;
    
    // Add a slight delay to ensure state updates before making API calls
    setTimeout(() => {
      debouncedFetchSessions(pagination.currentPage, 10, true);
      if (currentSession) {
        fetchMessages(true);
      }
    }, 100);
  }, [debouncedFetchSessions, fetchMessages, pagination.currentPage, currentSession]);

  // Optimized initial load with reduced risk of rate limiting
  useEffect(() => {
    // Skip loading if auth error or requests are stopped
    if (authError || requestsStopped) return;
    
    const loadInitialData = async () => {
      // Only load if we haven't already made a successful call
      if (!sessionCallMade.current) {
        // Only do the initial load if no global request is in progress
        if (!GLOBAL_SESSION_REQUEST.inProgress && 
            Date.now() - GLOBAL_SESSION_REQUEST.lastRequestTime > 30000) {
          // Increased initial delay to prevent rate limits on page load
          await new Promise(resolve => setTimeout(resolve, 1500));
          debouncedFetchSessions(1, 10, true); // Force first load
        } else {
          console.log('Skipping initial load - recent request detected in other component');
        }
      }
    };
    
    loadInitialData();
    
    // Cleanup function that persists sessionCallMade state
    return () => {
      // We don't reset sessionCallMade.current here to prevent duplicate calls
      // when component remounts
    };
  }, [debouncedFetchSessions, authError, requestsStopped]);

  // Load messages when current session changes with improved error handling
  useEffect(() => {
    if (currentSession && !authError && !requestsStopped) {
      // Clear the navigatingToChat flag after a delay to ensure it's been processed
      // Use a longer timeout to ensure all navigation is complete
      setTimeout(() => {
        if (window.location.pathname === '/chat') {
          localStorage.removeItem('navigatingToChat');
          console.log('Cleared navigatingToChat flag on chat page');
        }
      }, 2000);
      
      // Increased delay when changing sessions to avoid rate limiting
      setTimeout(() => {
        fetchMessages(true); // Force load when session changes
      }, 500);
    }
  }, [currentSession?.chat_session_id, fetchMessages, authError, requestsStopped]);

  // Handle selecting a chat session
  const selectSession = (session) => {
    // Only change if it's a different session
    if (session.chat_session_id !== currentSession?.chat_session_id) {
      setCurrentSession(session);
    }
  };

  // Handle sending a new message with improved token verification
  const sendMessage = async (content) => {
    if (!content.trim() || !currentSession) return;
    if (!checkToken()) return;

    try {
      setLoading(true);
      const messageData = {
        session_id: currentSession.chat_session_id,
        content: content
      };

      // Make direct API call to ensure proper handling of response status
      const url = API_ENDPOINTS.SEND_MESSAGE;
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      Object.entries(messageData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      // Handle successful response
      if (response.ok) {
        // Reset requestsStopped on successful send
        if (requestsStopped) {
          console.log('Resetting requestsStopped flag due to successful message send');
          setRequestsStopped(false);
        }
        
        // Update the local messages with the new message without waiting for API
        const newMessage = {
          id: Date.now(), // Temporary ID
          message_id: Date.now(), // Temporary ID
          sender_id: currentSession.participant?.id, // Assuming current user is the sender
          content: content,
          created_at: new Date().toISOString(),
          is_read: true
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // Update the latest message in the current session without refetching all sessions
        setChatSessions(prev => prev.map(session => {
          if (session.chat_session_id === currentSession.chat_session_id) {
            return {
              ...session,
              latest_message: {
                ...session.latest_message,
                text: content,
                timestamp: new Date().toISOString()
              }
            };
          }
          return session;
        }));
        
        // Wait longer before fetching the updated messages to avoid rate limits
        setTimeout(() => {
          fetchMessages(true);
        }, 2000); // Increased from 1000ms to 2000ms
      } else {
        // Only stop requests on actual HTTP errors
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
      
      // Stop requests on actual errors
      stopRequests();
      
      if (error.message && error.message.includes('401')) {
        setAuthError(true);
        toast.showError('Authentication failed. Please sign in again.');
      } else if (error.message && error.message.includes('429')) {
        toast.showError('Unable to send message (rate limited). Please try again in a moment.');
      } else {
        toast.showError('Failed to send message');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load more sessions (pagination) with auth check
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
      // This is an explicit user action, so we need to fetch new data
      // Reset the sessionCallMade flag for pagination actions
      sessionCallMade.current = false;
      debouncedFetchSessions(page, 10, true); // Force load when explicitly requested
    }
  };

  // Significantly improved polling strategy with better backoff and reduced frequency
  useEffect(() => {
    // Skip polling entirely if auth error or requests stopped - immediately return
    if (authError || requestsStopped) return () => {};
    
    console.log('Setting up polling (requests not stopped)');
    
    // Adaptive polling with backoff and reduced frequency
    const adaptivePolling = () => {
      let timeoutId;
      let isFirstPoll = true;
      
      const poll = () => {
        // Check again in case requestsStopped changed since the timeout was set
        if (requestsStopped) {
          console.log('Requests stopped during polling wait - canceling poll');
          return;
        }
        
        // Only poll if user is active (check last activity)
        const lastUserActivity = parseInt(localStorage.getItem('lastUserActivity') || Date.now());
        const inactiveThreshold = 10 * 60 * 1000; // 10 minutes
        const isUserActive = (Date.now() - lastUserActivity) < inactiveThreshold;
        
        // Check for any global in-progress requests
        const hasGlobalRequest = GLOBAL_SESSION_REQUEST.inProgress || 
                                (Date.now() - GLOBAL_SESSION_REQUEST.lastRequestTime < 30000);
        
        // Only poll if user is active, no requests are stopped, and no global requests are in progress
        if (isUserActive && !requestsStopped && !hasGlobalRequest) {
          // For messages, only poll if the page is visible to the user
          if (currentSession && document.visibilityState === 'visible') {
            fetchMessages();
          } else if (!sessionCallMade.current && !pendingSessionCall.current) {
            // Only fetch sessions if we haven't already made a successful call
            // and there's no pending scheduled call
            debouncedFetchSessions(currentPage.current, 10);
          }
        } else {
          console.log('User inactive, requests stopped, or global request in progress - skipping poll');
        }
        
        // Only schedule next poll if requests aren't stopped
        if (!requestsStopped) {
          // Schedule next poll with a randomized jitter (±3000ms)
          const jitter = Math.random() * 6000 - 3000;
          
          // For first poll, use a longer delay to avoid duplicate calls on page load
          const delay = isFirstPoll 
            ? pollingInterval.current * 2 + jitter // Double time for first poll
            : pollingInterval.current + jitter;
          
          console.log(`Scheduling next poll in ${delay}ms`);
          timeoutId = setTimeout(poll, delay);
          isFirstPoll = false;
        }
      };
      
      // Track user activity
      const updateActivity = () => {
        localStorage.setItem('lastUserActivity', Date.now().toString());
      };
      
      // Track page visibility changes
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          console.log('Page became visible, updating activity timestamp');
          updateActivity();
          
          // When page becomes visible, trigger a message fetch if we have a session
          if (currentSession && !requestsStopped) {
            fetchMessages(true);
          }
        }
      };
      
      window.addEventListener('click', updateActivity);
      window.addEventListener('keydown', updateActivity);
      window.addEventListener('mousemove', updateActivity);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Start polling with increased initial delay
      const initialDelay = 180000 + (Math.random() * 30000); // 3 minutes + random jitter
      console.log(`Initial poll scheduled in ${initialDelay}ms`);
      timeoutId = setTimeout(poll, initialDelay);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('click', updateActivity);
        window.removeEventListener('keydown', updateActivity);
        window.removeEventListener('mousemove', updateActivity);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    };
    
    const cleanup = adaptivePolling();
    return cleanup;
  }, [currentSession, debouncedFetchSessions, fetchMessages, pagination.currentPage, authError, requestsStopped]);

  // Reset polling interval gradually when there are no errors
  useEffect(() => {
    if (!lastError.current && pollingInterval.current > 120000 && !requestsStopped) {
      const resetInterval = setInterval(() => {
        // More gradual reduction (0.97 instead of 0.95) and higher minimum (120s vs 60s)
        pollingInterval.current = Math.max(pollingInterval.current * 0.97, 120000);
        console.log(`No errors detected, reducing polling interval to ${pollingInterval.current}ms`);
      }, 300000); // Check every 5 minutes instead of 3
      
      return () => clearInterval(resetInterval);
    }
  }, [requestsStopped]);

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
      sessionCallMade.current = false; // Reset flag for explicit refresh
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
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useUserContext } from '@/context/UserContext';
import {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  updateAdminConnection,
  subscribeToConversation,
  subscribeToConversations,
  type Conversation as SupabaseConversation,
  type Message as SupabaseMessage,
} from '@/services/messaging';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Conversation {
  roomId: string;
  sessionId: string;
  lastMessage: string;
  lastMessageTime: Date;
  productName?: string;
  adminConnected?: boolean;
  customerName?: string;
}

interface CompactChatProps {
  onClose?: () => void;
  productName?: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'izaj';
  timestamp: Date;
  isContactInfo?: boolean;
  showQuickActions?: boolean;
  showChatWithAgent?: boolean;
}

const CompactChat: React.FC<CompactChatProps> = ({ onClose, productName }) => {
  const { user } = useUserContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInitialActions, setShowInitialActions] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [preferredLanguage] = useState<'en' | 'tl'>('en'); // Default to English
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [persistentUserId, setPersistentUserId] = useState<string | null>(null);
  const [isConnectingToAgent, setIsConnectingToAgent] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const connectingToAgentRef = useRef(false);
  const subscriptionChannelsRef = useRef<RealtimeChannel[]>([]);
  
  // Derive customer name
  const getCustomerName = () => {
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
    return fullName || null;
  };

  // Get connection status for current conversation
  const currentConversation = conversations.find(c => c.roomId === selectedConversation);
  // Check if conversation has admin messages (indicates it was in agent mode at some point)
  const hasAdminMessages = messages.some(m => m.sender === 'izaj');
  // Check if there's a disconnect message (indicates admin was connected and then disconnected)
  const hasDisconnectMessage = messages.some(m => 
    m.sender === 'izaj' && 
    (m.text.includes('disconnected') || m.text.includes('can no longer reply'))
  );
  // isAgentMode is true if:
  // 1. Currently connected (adminConnected === true), OR
  // 2. Was connected but now disconnected (adminConnected === false AND has disconnect message)
  // This ensures that only conversations that were actually connected show as agent mode when disconnected
  // New chats (adminConnected === false without disconnect message) should NOT show as agent mode
  const isAgentMode = currentConversation?.adminConnected === true || 
                      (currentConversation?.adminConnected === false && hasDisconnectMessage);
  const isConnected = currentConversation?.adminConnected === true;
  
  // Get or create persistent user identifier
  useEffect(() => {
    const getPersistentUserId = () => {
      // If user is logged in, use their user ID
      if (user?.id) {
        const userId = `user_${user.id}`;
        localStorage.setItem('chat_user_id', userId);
        setPersistentUserId(userId);
        return userId;
      }
      
      // If not logged in, check for existing anonymous ID in localStorage
      let anonymousId = localStorage.getItem('chat_anonymous_id');
      if (!anonymousId) {
        // Generate new anonymous ID
        anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chat_anonymous_id', anonymousId);
      }
      setPersistentUserId(anonymousId);
      return anonymousId;
    };
    
    const persistentId = getPersistentUserId();
    setPersistentUserId(persistentId);
    
    // Update persistent ID when user logs in/out
    if (user?.id) {
      const userId = `user_${user.id}`;
      if (persistentId !== userId) {
        localStorage.setItem('chat_user_id', userId);
        setPersistentUserId(userId);
      }
    }
  }, [user]);

  // Load saved conversation state from localStorage
  useEffect(() => {
    if (persistentUserId) {
      const savedRoomId = localStorage.getItem(`chat_roomId_${persistentUserId}`);
      const savedSessionId = localStorage.getItem(`chat_sessionId_${persistentUserId}`);
      const savedSelectedConversation = localStorage.getItem(`chat_selectedConversation_${persistentUserId}`);
      
      if (savedRoomId && savedSessionId) {
        setRoomId(savedRoomId);
        setSessionId(savedSessionId);
        if (savedSelectedConversation) {
          setSelectedConversation(savedSelectedConversation);
        } else {
          setSelectedConversation(savedRoomId);
        }
      }
    }
  }, [persistentUserId]);
  
  // Helper function to create a new conversation properly
  const createNewConversation = async (): Promise<{ roomId: string; sessionId: string } | null> => {
    if (!persistentUserId) return null;

    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const newRoomId = persistentUserId.startsWith('user_') || persistentUserId.startsWith('anon_')
      ? `customer:${persistentUserId}_${timestamp}`
      : `customer:${timestamp}_${random}`;
    const newSessionId = persistentUserId;

    try {
      // Create conversation in Supabase
        const result = await getOrCreateConversation({
          roomId: newRoomId,
          sessionId: newSessionId,
          productName: productName || undefined,
          preferredLanguage: preferredLanguage || undefined,
          customerEmail: user?.email || undefined,
          customerName: getCustomerName() || undefined,
        });

      if (result.success) {
        console.log(`✅ [Web] Created conversation in Supabase: ${newRoomId}`);
        return { roomId: newRoomId, sessionId: newSessionId };
      } else {
        console.error('Error creating conversation:', result.error);
      }
    } catch (error) {
      console.error('Error creating conversation in database:', error);
    }

    return { roomId: newRoomId, sessionId: newSessionId };
  };

  // Initialize Supabase real-time subscriptions
  useEffect(() => {
    if (!persistentUserId) return;

    // Cleanup previous subscriptions
    subscriptionChannelsRef.current.forEach(channel => {
      channel.unsubscribe();
    });
    subscriptionChannelsRef.current = [];

    // Subscribe to conversation updates for current session
    const conversationsChannel = subscribeToConversations(persistentUserId, (conv) => {
      setConversations(prev => {
        // Use Map to ensure uniqueness by roomId
        const convMap = new Map(prev.map(c => [c.roomId, c]));
        const existing = convMap.get(conv.room_id);
        
        if (existing) {
          // Update existing conversation
          convMap.set(conv.room_id, {
            ...existing,
            adminConnected: conv.admin_connected || false,
            lastMessage: existing.lastMessage || '', // Keep existing lastMessage
            lastMessageTime: new Date(conv.last_message_at || conv.updated_at),
            productName: conv.product_name || existing.productName,
            customerName: conv.customer_name || existing.customerName,
          });
        } else {
          // Add new conversation only if it doesn't exist
          console.log('➕ [Web] Adding new conversation from real-time:', conv.room_id);
          convMap.set(conv.room_id, {
            roomId: conv.room_id,
            sessionId: conv.session_id,
            lastMessage: '',
            lastMessageTime: new Date(conv.last_message_at || conv.created_at),
            productName: conv.product_name || undefined,
            adminConnected: conv.admin_connected || false,
            customerName: conv.customer_name || undefined,
          });
        }
        
        // Convert back to array and sort
        return Array.from(convMap.values()).sort((a, b) => 
          b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
        );
      });
    });
    subscriptionChannelsRef.current.push(conversationsChannel);

    // Subscribe to selected conversation for real-time updates
    if (selectedConversation) {
      const conversationChannel = subscribeToConversation(selectedConversation, {
        onMessage: (supabaseMsg: SupabaseMessage) => {
          console.log('📨 [Web] Real-time message received:', {
            id: supabaseMsg.id,
            text: supabaseMsg.message_text.substring(0, 50),
            sender: supabaseMsg.sender_type,
            roomId: supabaseMsg.room_id,
            timestamp: supabaseMsg.created_at
          });
          
          setIsTyping(false);
          
          const currentRoomId = selectedConversation;
          
          // Update conversation list
          setConversations(prev => {
            const existing = prev.find(c => c.roomId === currentRoomId);
            if (existing) {
              return prev.map(conv => 
                conv.roomId === currentRoomId 
                  ? { 
                      ...conv, 
                      lastMessage: supabaseMsg.message_text, 
                      lastMessageTime: new Date(supabaseMsg.created_at) 
                    }
                  : conv
              ).sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
            }
            return prev;
          });
          
          // Add message to current conversation
          if (currentRoomId === selectedConversation) {
            setMessages(prev => {
              // Better duplicate detection using message ID
              const exists = prev.some(m => {
                // Check by exact ID match
                if (String(m.id) === String(supabaseMsg.id)) {
                  console.log('⚠️ [Web] Duplicate message detected by ID:', supabaseMsg.id);
                  return true;
                }
                // Check by text and timestamp (within 2 seconds)
                const msgTime = new Date(supabaseMsg.created_at).getTime();
                if (m.text === supabaseMsg.message_text && 
                    Math.abs(m.timestamp.getTime() - msgTime) < 2000) {
                  console.log('⚠️ [Web] Duplicate message detected by text+time');
                  return true;
                }
                return false;
              });
              
              if (exists) {
                console.log('⏭️ [Web] Skipping duplicate message');
                return prev;
              }
              
              // Generate a more reliable ID from Supabase message ID
              let messageId: number;
              try {
                // Try to extract numeric part from UUID or use hash
                const idStr = supabaseMsg.id.replace(/-/g, '');
                messageId = parseInt(idStr.substring(0, 15), 16) || Date.now();
              } catch {
                messageId = Date.now();
              }
              
              console.log('✅ [Web] Adding new message to chat:', {
                id: messageId,
                text: supabaseMsg.message_text.substring(0, 30),
                sender: supabaseMsg.sender_type === 'admin' ? 'izaj' : 'user'
              });
              
              const newMessage: Message = {
                id: messageId,
                text: supabaseMsg.message_text,
                sender: supabaseMsg.sender_type === 'admin' ? 'izaj' : 'user',
                timestamp: new Date(supabaseMsg.created_at),
              };
              
              const updated = [...prev, newMessage];
              return updated.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
            });
          } else {
            console.log('⏭️ [Web] Message received for different room, not adding to current chat');
          }
        },
        onAdminConnected: ({ roomId: connectedRoomId, adminConnected }) => {
          if (connectedRoomId !== selectedConversation) return;
          
          setIsConnectingToAgent(false);
          connectingToAgentRef.current = false;
          
          setConversations(prev => {
            const existing = prev.find(c => c.roomId === connectedRoomId);
            if (existing) {
              return prev.map(conv => 
                conv.roomId === connectedRoomId 
                  ? { ...conv, adminConnected: true }
                  : conv
              );
            }
            return prev;
          });
          
          // Add greeting message
          setMessages(prev => {
            const hasGreeting = prev.some(m => 
              m.text.includes('Hello! You are now connected')
            );
            if (hasGreeting) return prev;
            
            return [...prev, {
              id: prev.length + 1,
              text: 'Hello! You are now connected to one of our agents. How can I help you?',
              sender: 'izaj',
              timestamp: new Date(),
            }];
          });
        },
        onAdminDisconnected: ({ roomId: disconnectedRoomId }) => {
          if (disconnectedRoomId !== selectedConversation) return;
          
          setIsConnectingToAgent(false);
          connectingToAgentRef.current = false;
          
          setConversations(prev => {
            const existing = prev.find(c => c.roomId === disconnectedRoomId);
            if (existing) {
              return prev.map(conv => 
                conv.roomId === disconnectedRoomId 
                  ? { ...conv, adminConnected: false }
                  : conv
              );
            }
            return prev;
          });
          
          setInputValue('');
          
          // Add disconnect message
          setMessages(prev => {
            const hasDisconnectMessage = prev.some(m => 
              m.text.includes('disconnected') || 
              m.text.includes('can no longer reply')
            );
            
            if (hasDisconnectMessage) return prev;
            
            return [...prev, {
              id: prev.length + 1,
              text: 'The agent has disconnected. You can no longer reply to this conversation.',
              sender: 'izaj',
              timestamp: new Date(),
            }];
          });
        },
      });
      subscriptionChannelsRef.current.push(conversationChannel);
    }

    return () => {
      console.log('🧹 [Web] Cleaning up subscriptions for persistentUserId:', persistentUserId, 'selectedConversation:', selectedConversation);
      subscriptionChannelsRef.current.forEach(channel => {
        try {
          channel.unsubscribe();
        } catch (error) {
          console.warn('⚠️ [Web] Error unsubscribing channel:', error);
        }
      });
      subscriptionChannelsRef.current = [];
    };
  }, [persistentUserId, selectedConversation]);

  // Legacy handler for admin connected (kept for compatibility but not used with Supabase)
  const handleAdminConnected = (msg: { text: string; sentAt?: string; roomId?: string }) => {
      console.log('✅ [Web] Admin connected event received:', msg);
      console.log('Current roomId:', roomId, 'selectedConversation:', selectedConversation, 'msg.roomId:', msg.roomId);
      console.log('Current conversations:', conversations.map(c => c.roomId));
      
      // Get current room ID
      const currentRoomId = selectedConversation || roomId;
      const msgRoomId = msg.roomId || currentRoomId;
      
      // Always accept the event if roomId is provided (server ensures it's for the right room)
      // If roomId matches current conversation or exists in conversations list, process it
      if (msg.roomId) {
        // Check if this roomId exists in conversations list or matches current
        const convExists = conversations.some(c => c.roomId === msg.roomId);
        const matchesCurrent = msg.roomId === currentRoomId;
        
        console.log('🔍 [Web] Room check:', { 
          msgRoomId: msg.roomId, 
          currentRoomId, 
          convExists, 
          matchesCurrent 
        });
        
        // If it exists but is not the current one, switch to it
        if (convExists && !matchesCurrent) {
          console.log('🔄 [Web] Switching to conversation:', msg.roomId);
          setSelectedConversation(msg.roomId);
          setRoomId(msg.roomId);
        }
        
        // If it doesn't exist and doesn't match current, still process it (might be new)
        if (!convExists && !matchesCurrent) {
          console.log('⚠️ [Web] Room ID not found in conversations, but processing anyway:', msg.roomId);
          // Set as selected conversation if no current selection
          if (!selectedConversation) {
            setSelectedConversation(msg.roomId);
            setRoomId(msg.roomId);
          }
        }
      }
      
      // Update connecting state
      setIsConnectingToAgent(false);
      connectingToAgentRef.current = false;
      
      // Use the correct roomId = msg.roomId if available, otherwise use current
      const finalRoomId = msg.roomId || currentRoomId;
      
      console.log('🔧 [Web] Updating conversation with finalRoomId:', finalRoomId);
      
      // Update conversation list to reflect connected status (per-conversation)
      // Always update/create the conversation in the list
      if (finalRoomId) {
        setConversations(prev => {
          const convMap = new Map(prev.map(c => [c.roomId, c]));
          const existing = convMap.get(finalRoomId);
          
          if (existing) {
            // Update existing conversation
            convMap.set(finalRoomId, {
              ...existing,
              adminConnected: true,
              lastMessage: msg.text || existing.lastMessage,
              lastMessageTime: new Date(),
            });
            console.log('✅ [Web] Updated conversation adminConnected to true');
          } else {
            // Add new conversation if it doesn't exist
            console.log('➕ [Web] Adding new conversation to list from handleAdminConnected');
            convMap.set(finalRoomId, {
              roomId: finalRoomId,
              sessionId: sessionId || persistentUserId || '',
              lastMessage: msg.text || '',
              lastMessageTime: new Date(),
              productName,
              adminConnected: true,
            });
          }
          
          // Convert back to array and sort
          return Array.from(convMap.values()).sort((a, b) => 
            b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
          );
        });
      }
      
      // Remove waiting message if exists and add greeting
      setMessages(prev => {
        const filtered = prev.filter(m => m.text !== 'Please wait for agent to connect to you.');
        // Check if greeting message already exists
        const hasGreeting = filtered.some(m => 
          m.text.includes('Hello! You are now connected') || 
          m.text === msg.text
        );
        if (hasGreeting) {
          return filtered;
        }
        return [...filtered, {
          id: filtered.length + 1,
          text: msg.text || 'Hello! You are now connected to one of our agents. How can I help you?',
          sender: 'izaj',
          timestamp: msg.sentAt ? new Date(msg.sentAt) : new Date(),
        }];
      });
      
      console.log('✅ [Web] Admin connected - finalRoomId:', finalRoomId, 'conversation updated in list');
      console.log('✅ [Web] isAgentMode will be:', true, 'isConnected will be:', true);
    };

  // Load conversation history based on persistent user ID
  useEffect(() => {
    const loadConversations = async () => {
      const userId = persistentUserId;
      if (!userId) return;
      
      setIsLoadingHistory(true);
      try {
        const result = await getConversations(userId);
        
        if (result.success && result.conversations) {
          // Get last message for each conversation
          const convsWithMessages = await Promise.all(
            result.conversations.map(async (conv) => {
              try {
                const messagesResult = await getMessages(conv.room_id);
                const lastMessage = messagesResult.messages && messagesResult.messages.length > 0
                  ? messagesResult.messages[messagesResult.messages.length - 1].message_text
                  : '';
                
                return {
                  roomId: conv.room_id,
                  sessionId: conv.session_id,
                  lastMessage,
                  lastMessageTime: new Date(conv.last_message_at || conv.created_at),
                  productName: conv.product_name || undefined,
                  adminConnected: conv.admin_connected || false,
                  customerName: conv.customer_name || undefined,
                };
              } catch (error) {
                console.warn('⚠️ [Web] Error loading messages for conversation:', conv.room_id, error);
                // Return conversation without last message if error
                return {
                  roomId: conv.room_id,
                  sessionId: conv.session_id,
                  lastMessage: '',
                  lastMessageTime: new Date(conv.last_message_at || conv.created_at),
                  productName: conv.product_name || undefined,
                  adminConnected: conv.admin_connected || false,
                  customerName: conv.customer_name || undefined,
                };
              }
            })
          );
          
          // Use Map to ensure uniqueness and prevent duplicates
          const convMap = new Map<string, Conversation>();
          convsWithMessages.forEach(conv => {
            if (!convMap.has(conv.roomId)) {
              convMap.set(conv.roomId, conv);
            } else {
              console.warn('⚠️ [Web] Duplicate conversation found during load, skipping:', conv.roomId);
            }
          });
          
          // Sort conversations by last message time (newest first)
          const sortedConvs = Array.from(convMap.values()).sort((a, b) => 
            b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
          );
          
          setConversations(sortedConvs);
          
          // If no conversation is selected and we have conversations, select the most recent one
          if (!selectedConversation && sortedConvs.length > 0) {
            const mostRecent = sortedConvs[0];
            setSelectedConversation(mostRecent.roomId);
            if (!roomId) {
              setRoomId(mostRecent.roomId);
              setSessionId(mostRecent.sessionId);
            }
            // Save to localStorage
            if (persistentUserId) {
              localStorage.setItem(`chat_selectedConversation_${persistentUserId}`, mostRecent.roomId);
            }
          }
        }
      } catch (error) {
        console.error('❌ [Web] Error loading conversations:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    loadConversations();
  }, [persistentUserId]);

  // Conversation state is managed via adminConnected in conversations list
  // No need for separate useEffect - currentConversation computed value handles it

  // Save conversation state to localStorage whenever it changes
  useEffect(() => {
    if (persistentUserId && roomId && sessionId) {
      localStorage.setItem(`chat_roomId_${persistentUserId}`, roomId);
      localStorage.setItem(`chat_sessionId_${persistentUserId}`, sessionId);
      if (selectedConversation) {
        localStorage.setItem(`chat_selectedConversation_${persistentUserId}`, selectedConversation);
      }
    }
  }, [persistentUserId, roomId, sessionId, selectedConversation]);

  // Cleanup function when chat box closes
  useEffect(() => {
    return () => {
      // Unsubscribe from all Supabase channels when component unmounts
      subscriptionChannelsRef.current.forEach(channel => {
        channel.unsubscribe();
      });
      subscriptionChannelsRef.current = [];
    };
  }, []);

  // Handle close button with cleanup
  const handleClose = () => {
    // Unsubscribe from Supabase channels but keep conversation state
    subscriptionChannelsRef.current.forEach(channel => {
      channel.unsubscribe();
    });
    subscriptionChannelsRef.current = [];
    
    // Don't reset conversation state - keep it for when chat reopens
    // Don't reset isAgentMode and isConnected - they will be restored from database when chat reopens
    // Only reset UI-related states
    setIsConnectingToAgent(false);
    setInputValue('');
    connectingToAgentRef.current = false;
    
    // Call onClose callback
    if (onClose) {
      onClose();
    }
  };

  // Load messages for selected conversation
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) {
        setMessages([]);
        return;
      }
      
      setIsLoadingHistory(true);
      try {
        const result = await getMessages(selectedConversation);
        
        if (result.success && result.messages) {
          // Sort messages by timestamp to ensure correct order
          const sortedMessages = [...result.messages].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          
          const loadedMessages: Message[] = sortedMessages.map((msg, index) => ({
            id: parseInt(msg.id.replace(/-/g, '').substring(0, 15)) || Date.now() + index,
            text: msg.message_text || '',
            sender: msg.sender_type === 'customer' ? 'user' : 'izaj',
            timestamp: new Date(msg.created_at),
          }));
          
          // Set loaded messages
          setMessages(loadedMessages);
          // Show initial actions if no messages loaded
          if (loadedMessages.length === 0) {
            setShowInitialActions(true);
          } else {
            setShowInitialActions(false);
          }
          
          // Update conversation admin_connected status in conversations list
          if (result.conversation && result.conversation.admin_connected !== undefined && selectedConversation) {
            const conv = result.conversation;
            setConversations(prev => {
              const existing = prev.find(c => c.roomId === selectedConversation);
              if (existing) {
                const updated = prev.map(c => 
                  c.roomId === selectedConversation 
                    ? { ...c, adminConnected: conv.admin_connected }
                    : c
                );
                // If admin is disconnected, clear input to prevent sending
                if (!conv.admin_connected) {
                  setInputValue('');
                }
                return updated;
              } else {
                // If conversation doesn't exist in list, add it
                return [...prev, {
                  roomId: selectedConversation,
                  sessionId: conv.session_id || sessionId || '',
                  lastMessage: loadedMessages.length > 0 ? loadedMessages[loadedMessages.length - 1].text : '',
                  lastMessageTime: loadedMessages.length > 0 ? loadedMessages[loadedMessages.length - 1].timestamp : new Date(),
                  productName: conv.product_name || productName,
                  adminConnected: conv.admin_connected,
                }];
              }
            });
          }
          
          console.log(`📥 [Web] Loaded ${loadedMessages.length} messages for room: ${selectedConversation}`);
        } else {
          setMessages([]);
          setShowInitialActions(true);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        setMessages([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    loadMessages();
  }, [selectedConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  // Quick Actions component
  const QuickActions = () => {
    const handleAction = (action: 'customer-support' | 'faq') => {
      let response = '';
      
      // Hide initial actions
      setShowInitialActions(false);
      
      if (action === 'customer-support') {
        response = "I'd be happy to connect you with one of our agents! Click the button below to start chatting with a live agent who can help you with any questions or concerns.";
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: 'Customer Support',
          sender: 'user',
          timestamp: new Date()
        }, {
          id: prev.length + 2,
          text: response,
          sender: 'izaj',
          timestamp: new Date(),
          showChatWithAgent: true
        }]);
      } else if (action === 'faq') {
        response = "Here are some frequently asked questions:\n\n• Product Information\n• Pricing & Discounts\n• Delivery & Shipping\n• Installation Services\n• Payment Methods\n• Warranty & Returns\n• Store Pickup\n• Bulk Orders\n\nWhat would you like to know more about?";
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: 'FAQ',
          sender: 'user',
          timestamp: new Date()
        }, {
          id: prev.length + 2,
          text: response,
          sender: 'izaj',
          timestamp: new Date()
        }]);
      }
    };

    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleAction('customer-support')}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium text-sm flex items-center justify-center gap-2"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          <Icon icon="mdi:account-circle" className="text-lg" />
          Customer Support
        </button>
        <button
          onClick={() => handleAction('faq')}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium text-sm flex items-center justify-center gap-2"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          <Icon icon="mdi:help-circle" className="text-lg" />
          FAQ
        </button>
      </div>
    );
  };

  // Contact information component
  const ContactInfoMessage = () => {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Icon icon="mdi:account-circle" className="text-blue-600 text-xl" />
          <h4 className="font-semibold text-blue-900 text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>Contact IZAJ Lighting</h4>
        </div>
        <div className="space-y-2 text-sm">
          <a 
            href="tel:+63491234567" 
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            <Icon icon="mdi:phone" className="text-lg" />
            <span>+63 (49) 123-4567</span>
          </a>
          <a 
            href="mailto:info@izajlighting.com" 
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            <Icon icon="mdi:email" className="text-lg" />
            <span>info@izajlighting.com</span>
          </a>
          <a 
            href="https://facebook.com/izajlighting" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            <Icon icon="mdi:facebook" className="text-lg" />
            <span>Facebook: IZAJ Lighting Centre</span>
          </a>
          <div className="flex items-start gap-2 text-gray-700 mt-3 pt-3 border-t border-blue-200" style={{ fontFamily: 'Jost, sans-serif' }}>
            <Icon icon="mdi:map-marker" className="text-lg mt-0.5" />
            <div>
              <p className="font-medium">Address:</p>
              <p>173 1, San Pablo City, 4000 Laguna, Philippines</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Detect if message is in Tagalog
  const isTagalog = (message: string): boolean => {
    const tagalogWords = [
      'magkano', 'presyo', 'mayroon', 'may', 'wala', 'paano', 'ano', 'saan', 'kailan', 'bakit',
      'salamat', 'kumusta', 'oo', 'opo', 'hindi', 'hindi po', 'padala', 'delivery', 'kabit',
      'installation', 'garantiya', 'warranty', 'stock', 'available', 'kulay', 'laki', 'sukat',
      'bayad', 'payment', 'pickup', 'marami', 'bulk', 'custom', 'oras', 'orasan', 'produkto',
      'led', 'hello', 'hi', 'kumusta', 'salamat', 'tulong', 'help', 'paalam', 'bye', 'order',
      'sundan', 'track', 'admin', 'manager', 'tao', 'makausap', 'kontak', 'telepono', 'email',
      'facebook', 'address', 'lugar', 'tindahan', 'store', 'opisina', 'office', 'diskwento',
      'sale', 'promo', 'install', 'setup', 'mount', 'return', 'refund', 'balik', 'quality',
      'kalidad', 'material', 'materyal', 'durable', 'matibay', 'catalog', 'katalogo', 'items',
      'gamit', 'collection', 'koleksyon', 'energy', 'enerhiya', 'efficient', 'mahusay', 'wattage'
    ];
    return tagalogWords.some(word => message.includes(word));
  };

  // Chatbot intelligence function
  const generateBotResponse = (userMessage: string): { text: string; showContactInfo?: boolean } => {
    const message = userMessage.toLowerCase();
    // Use preferred language if set, otherwise detect from message
    const isTagalogMessage = preferredLanguage === 'tl' || (preferredLanguage === null && isTagalog(message));
    
    // Check if user wants to speak with admin/manager
    if (
      message.includes('admin') || 
      message.includes('manager') || 
      message.includes('human') || 
      message.includes('person') ||
      message.includes('tao') ||
      message.includes('makausap') ||
      message.includes('talk to') ||
      message.includes('speak with') ||
      message.includes('contact') ||
      message.includes('kontak') ||
      message.includes('phone') ||
      message.includes('telepono') ||
      message.includes('email') ||
      message.includes('facebook') ||
      message.includes('address') ||
      message.includes('lugar') ||
      message.includes('location') ||
      message.includes('store') ||
      message.includes('tindahan') ||
      message.includes('office') ||
      message.includes('opisina')
    ) {
      return {
        text: isTagalogMessage 
          ? "Masaya akong makakonekta kayo sa aming team! Narito kung paano kayo makakontak sa IZAJ Lighting:"
          : "I'd be happy to connect you with our team! Here's how you can reach IZAJ Lighting:",
        showContactInfo: true
      };
    }
    
    // Check for shipping fee questions FIRST - show contact info automatically
    // This must be checked BEFORE general price questions to avoid conflicts
    if (
      message.includes('shipping fee') || 
      message.includes('delivery fee') || 
      message.includes('ship fee') || 
      message.includes('deliver fee') ||
      message.includes('magkano shipping') ||
      message.includes('magkano delivery') ||
      message.includes('magkano padala') ||
      message.includes('magkano ang shipping') ||
      message.includes('magkano ang delivery') ||
      message.includes('magkano ang padala') ||
      message.includes('how much shipping') ||
      message.includes('how much delivery') ||
      message.includes('how much is shipping') ||
      message.includes('how much is delivery') ||
      message.includes('shipping cost') ||
      message.includes('delivery cost') ||
      message.includes('padala fee') ||
      message.includes('bayad sa padala') ||
      message.includes('presyo ng shipping') ||
      message.includes('presyo ng delivery') ||
      message.includes('shipping price') ||
      message.includes('delivery price') ||
      message.includes('shipping charge') ||
      message.includes('delivery charge') ||
      (message.includes('shipping') && (message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('charge') || message.includes('magkano') || message.includes('how much'))) ||
      (message.includes('delivery') && (message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('charge') || message.includes('magkano') || message.includes('how much'))) ||
      (message.includes('padala') && (message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('charge') || message.includes('magkano') || message.includes('bayad')))
    ) {
      return {
        text: isTagalogMessage 
          ? "Para sa impormasyon tungkol sa shipping fee, pakikontak ang aming team. Narito ang aming contact information:"
          : "For shipping fee information, please contact our team. Here's our contact information:",
        showContactInfo: true
      };
    }
    
    // Product information responses
    // Note: Price check excludes shipping/delivery related terms to avoid conflicts
    if (
      (message.includes('price') || message.includes('cost') || message.includes('how much') || message.includes('magkano') || message.includes('presyo')) &&
      !message.includes('shipping') && 
      !message.includes('delivery') && 
      !message.includes('padala')
    ) {
      return { 
        text: isTagalogMessage 
          ? "Ang aming mga produkto ay may competitive na presyo! Makikita ninyo ang kasalukuyang presyo sa product page. Mayroon din kaming special discounts at monthly deals. Gusto ninyo bang malaman ang aming current promotions?"
          : "Our products are competitively priced! You can see the current price displayed on the product page. We also offer special discounts and monthly deals. Would you like to know about our current promotions?" 
      };
    }
    
    if (message.includes('discount') || message.includes('sale') || message.includes('promotion') || message.includes('deal') || message.includes('diskwento') || message.includes('promo')) {
      return { 
        text: isTagalogMessage 
          ? "Magandang balita! Mayroon kaming ongoing monthly deals at special promotions. Tingnan ang aming 'SALES' section para sa current discounts. Maaari din kayong makipag-ugnayan sa amin para sa bulk order discounts!"
          : "Great news! We have ongoing monthly deals and special promotions. Check out our 'SALES' section for current discounts. You can also contact us directly for bulk order discounts!" 
      };
    }
    
    if (message.includes('delivery') || message.includes('shipping') || message.includes('deliver') || message.includes('ship') || message.includes('padala')) {
      return { 
        text: isTagalogMessage 
          ? "Nag-ooffer kami ng delivery sa loob ng 10-14 working days para sa store pickup, 10-14 days para sa Metro Manila, at 14 days para sa Provincial areas. Available din ang professional installation upon request!"
          : "We offer delivery within 10-14 working days for store pickup, 10-14 days for Metro Manila, and 14 days for Provincial areas. Professional installation is also available upon request!" 
      };
    }
    
    if (message.includes('install') || message.includes('installation') || message.includes('setup') || message.includes('mount') || message.includes('kabit')) {
      return { 
        text: isTagalogMessage 
          ? "Oo! Nagbibigay kami ng professional installation services para sa lahat ng aming lighting products. Ang aming experienced technicians ay tiyak na proper setup at safety. Makipag-ugnayan sa amin para mag-schedule ng installation appointment."
          : "Yes! We provide professional installation services for all our lighting products. Our experienced technicians will ensure proper setup and safety. Contact us to schedule an installation appointment." 
      };
    }
    
    if (message.includes('warranty') || message.includes('guarantee') || message.includes('return') || message.includes('refund') || message.includes('garantiya') || message.includes('balik')) {
      return { 
        text: isTagalogMessage 
          ? "Sinusuportahan namin ang aming mga produkto ng comprehensive warranty coverage. Para sa specific warranty details at return policies, pakikontak ang aming customer service team. Kami ay committed sa inyong satisfaction!"
          : "We stand behind our products with comprehensive warranty coverage. For specific warranty details and return policies, please contact our customer service team. We're committed to your satisfaction!" 
      };
    }
    
    if (message.includes('stock') || message.includes('available') || message.includes('in stock') || message.includes('availability') || message.includes('mayroon') || message.includes('may')) {
      return { 
        text: isTagalogMessage 
          ? "Karamihan ng aming mga produkto ay available! Ang availability ay makikita sa bawat product page. Kung kailangan ninyo ng specific item urgently, makipag-ugnayan sa amin at iche-check namin ang aming inventory para sa inyo."
          : "Most of our products are in stock! The availability is shown on each product page. If you need a specific item urgently, feel free to contact us directly and we'll check our inventory for you." 
      };
    }
    
    if (message.includes('color') || message.includes('colors') || message.includes('finish') || message.includes('paint') || message.includes('kulay')) {
      return { 
        text: isTagalogMessage 
          ? "Ang aming mga produkto ay may iba't ibang kulay at finishes para tumugma sa inyong style! Makikita ninyo ang available options sa product page. Kung kailangan ninyo ng custom color, maaari nating pag-usapan ang special orders."
          : "Our products come in various colors and finishes to match your style! You can see the available options on the product page. If you need a custom color, we can discuss special orders." 
      };
    }
    
    if (message.includes('size') || message.includes('dimension') || message.includes('measurement') || message.includes('specification') || message.includes('laki') || message.includes('sukat')) {
      return { 
        text: isTagalogMessage 
          ? "Ang product dimensions at specifications ay nakalista sa bawat product page. Kung kailangan ninyo ng specific measurements o may space constraints, matutulungan ko kayong makahanap ng perfect fit para sa inyong space."
          : "Product dimensions and specifications are listed on each product page. If you need specific measurements or have space constraints, I can help you find the perfect fit for your space." 
      };
    }
    
    if (message.includes('quality') || message.includes('material') || message.includes('durable') || message.includes('long lasting') || message.includes('kalidad') || message.includes('materyal') || message.includes('matibay')) {
      return { 
        text: isTagalogMessage 
          ? "Kilala ang IZAJ Lighting sa high-quality materials at craftsmanship. Gumagamit kami ng premium materials at sumusunod sa strict quality standards. Ang aming mga produkto ay dinisenyo para tumagal at mapaganda ang inyong space."
          : "IZAJ Lighting is known for high-quality materials and craftsmanship. We use premium materials and follow strict quality standards. Our products are designed to last and enhance your space beautifully." 
      };
    }
    
    if (message.includes('payment') || message.includes('pay') || message.includes('gcash') || message.includes('credit card') || message.includes('maya') || message.includes('paypal') || message.includes('bayad')) {
      return { 
        text: isTagalogMessage 
          ? "Tumatanggap kami ng iba't ibang payment methods kabilang ang GCash, Maya, PayPal, at credit cards. Makikita ninyo ang lahat ng aming payment options sa checkout. Nag-ooffer din kami ng flexible payment terms para sa mas malalaking orders."
          : "We accept various payment methods including GCash, Maya, PayPal, and credit cards. You can see all our payment options at checkout. We also offer flexible payment terms for larger orders." 
      };
    }
    
    if (message.includes('pickup') || message.includes('pick up') || message.includes('store pickup')) {
      return { 
        text: isTagalogMessage 
          ? "Oo! Available ang store pickup sa aming location: 173 1, San Pablo City, 4000 Laguna, Philippines. Karaniwang handa ang items sa loob ng 2-4 days. Makikita ninyo ang pickup availability sa bawat product page."
          : "Yes! Store pickup is available at our location: 173 1, San Pablo City, 4000 Laguna, Philippines. Items are usually ready in 2-4 days. You can see pickup availability on each product page." 
      };
    }
    
    if (message.includes('bulk') || message.includes('wholesale') || message.includes('quantity') || message.includes('many') || message.includes('marami')) {
      return { 
        text: isTagalogMessage 
          ? "Nag-ooffer kami ng special pricing para sa bulk orders at wholesale purchases! Makipag-ugnayan sa amin para sa custom quotes sa large quantity orders. Masaya kaming makipagtrabaho sa contractors, designers, at businesses."
          : "We offer special pricing for bulk orders and wholesale purchases! Contact us directly for custom quotes on large quantity orders. We're happy to work with contractors, designers, and businesses." 
      };
    }
    
    if (message.includes('custom') || message.includes('special order') || message.includes('personalize')) {
      return { 
        text: isTagalogMessage 
          ? "Maaari naming i-accommodate ang custom orders at special requests! Kung kailangan ninyo ng specific colors, sizes, o modifications, maaaring makipagtrabaho ang aming team sa inyo. Makipag-ugnayan sa amin para pag-usapan ang inyong custom requirements."
          : "We can accommodate custom orders and special requests! Whether you need specific colors, sizes, or modifications, our team can work with you. Contact us to discuss your custom requirements." 
      };
    }
    
    if (message.includes('hours') || message.includes('open') || message.includes('business hours') || message.includes('time') || message.includes('oras') || message.includes('orasan')) {
      return { 
        text: isTagalogMessage 
          ? "Ang aming business hours ay: Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 5:00 PM, Sunday: 10:00 AM - 4:00 PM. Nandito kami para magserbisyo sa inyo!"
          : "Our business hours are: Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 5:00 PM, Sunday: 10:00 AM - 4:00 PM. We're here to serve you!" 
      };
    }
    
    if (message.includes('catalog') || message.includes('products') || message.includes('items') || message.includes('collection') || message.includes('produkto') || message.includes('gamit') || message.includes('koleksyon')) {
      return { 
        text: isTagalogMessage 
          ? "Mayroon kaming malawak na hanay ng lighting products kabilang ang chandeliers, pendant lights, wall sconces, table lamps, at marami pa! I-browse ang aming website para makita ang aming full collection. May specific type ba ng lighting na hinahanap ninyo?"
          : "We have a wide range of lighting products including chandeliers, pendant lights, wall sconces, table lamps, and more! Browse our website to see our full collection. Is there a specific type of lighting you're looking for?" 
      };
    }
    
    if (message.includes('led') || message.includes('energy') || message.includes('efficient') || message.includes('wattage') || message.includes('enerhiya') || message.includes('mahusay')) {
      return { 
        text: isTagalogMessage 
          ? "Marami sa aming mga produkto ay may energy-efficient LED technology! Ang LED lights ay long-lasting, energy-saving, at environmentally friendly. Tingnan ang product specifications para sa energy ratings at wattage information."
          : "Many of our products feature energy-efficient LED technology! LED lights are long-lasting, energy-saving, and environmentally friendly. Check product specifications for energy ratings and wattage information." 
      };
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon') || message.includes('good evening') || message.includes('kumusta')) {
      return { 
        text: isTagalogMessage 
          ? "Kumusta! Welcome sa IZAJ Lighting! Nandito ako para tumulong sa inyo na makahanap ng perfect lighting solutions para sa inyong space. Ano ang matutulungan ko sa inyo ngayon?"
          : "Hello! Welcome to IZAJ Lighting! I'm here to help you find the perfect lighting solutions for your space. What can I assist you with today?" 
      };
    }
    
    if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate') || message.includes('salamat')) {
      return { 
        text: isTagalogMessage 
          ? "Walang anuman! Masaya akong makatulong. May iba pa ba kayong gustong malaman tungkol sa aming mga produkto o serbisyo?"
          : "You're very welcome! I'm happy to help. Is there anything else you'd like to know about our products or services?" 
      };
    }
    
    if (message.includes('help') || message.includes('support') || message.includes('assist') || message.includes('tulong')) {
      return { 
        text: isTagalogMessage 
          ? "Nandito ako para tumulong! Maaari kong tulungan kayo sa product information, pricing, delivery, installation, payment methods, at marami pa. Ano ang specific information na kailangan ninyo?"
          : "I'm here to help! I can assist you with product information, pricing, delivery, installation, payment methods, and more. What specific information do you need?" 
      };
    }
    
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you') || message.includes('paalam')) {
      return { 
        text: isTagalogMessage 
          ? "Salamat sa pakikipag-chat sa IZAJ Lighting! Kung may iba pa kayong tanong, huwag mag-atubiling magtanong anumang oras. Magandang araw!"
          : "Thank you for chatting with IZAJ Lighting! If you have more questions, feel free to ask anytime. Have a great day!" 
      };
    }
    
    if (message.includes('order') || message.includes('purchase') || message.includes('buy') || message.includes('checkout')) {
      return { 
        text: isTagalogMessage 
          ? "Magaling! Maaari ninyong i-add ang items sa inyong cart at mag-proceed sa checkout. Kung kailangan ninyo ng assistance sa inyong order o may tanong tungkol sa checkout process, nandito ako para tumulong!"
          : "Great! You can add items to your cart and proceed to checkout. If you need assistance with your order or have questions about the checkout process, I'm here to help!" 
      };
    }
    
    if (message.includes('track') || message.includes('tracking') || message.includes('status') || message.includes('where is') || message.includes('sundan')) {
      return { 
        text: isTagalogMessage 
          ? "Para sa order tracking at status updates, pakikontak kami nang direkta gamit ang inyong order number. Bibigyan namin kayo ng latest information tungkol sa progress ng inyong order."
          : "For order tracking and status updates, please contact us directly with your order number. We'll provide you with the latest information about your order's progress." 
      };
    }
    
    // Default responses for general questions
    const defaultResponses = isTagalogMessage ? [
      "Magandang tanong yan! Masaya akong tumulong sa inyo. Maaari ba kayong magbigay ng kaunting detalye para mabigyan ko kayo ng pinaka-tumpak na impormasyon?",
      "Naiintindihan ko na naghahanap kayo ng impormasyon tungkol diyan. Hayaan ninyong tulungan ko kayong makahanap ng pinakamahusay na sagot. Ano ang specific aspect na gusto ninyong malaman pa?",
      "Salamat sa pagtatanong! Nandito ako para bigyan kayo ng lahat ng detalye na kailangan ninyo. Maaari ba ninyong linawin kung ano ang specific information na hinahanap ninyo?",
      "Gusto kong tumulong sa inyo! Ang aming team sa IZAJ Lighting ay committed sa pagbibigay ng excellent service. Ano pa ang gusto ninyong malaman?",
      "Mahalagang tanong yan! Maaari ko talagang tulungan kayo diyan. Para sa pinakadetailed na impormasyon, maaari ba ninyong sabihin sa akin kung ano ang specific details na kailangan ninyo?"
    ] : [
      "That's a great question! I'd be happy to help you with that. Could you provide a bit more detail so I can give you the most accurate information?",
      "I understand you're looking for information about that. Let me help you find the best answer. What specific aspect would you like to know more about?",
      "Thanks for asking! I'm here to provide you with all the details you need. Could you clarify what specific information you're looking for?",
      "I'd love to help you with that! Our team at IZAJ Lighting is committed to providing excellent service. What would you like to know more about?",
      "That's an important question! I can definitely help you with that. For the most detailed information, could you let me know what specific details you need?"
    ];
    
    return { text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)] };
  };

  const handleConnectToAgent = async () => {
    // Use persistent user ID
    let finalSessionId = persistentUserId || sessionId || '';
    // Use selectedConversation first (from New Chat), then roomId, then check localStorage
    let finalRoomId = selectedConversation || roomId || '';
    
    // If no roomId, check localStorage first, then create new one
    if (!finalRoomId && persistentUserId) {
      const savedRoomId = localStorage.getItem(`chat_roomId_${persistentUserId}`);
      const savedSessionId = localStorage.getItem(`chat_sessionId_${persistentUserId}`);
      
      if (savedRoomId && savedSessionId) {
        // Use saved conversation
        finalRoomId = savedRoomId;
        finalSessionId = savedSessionId;
        setRoomId(finalRoomId);
        setSessionId(finalSessionId);
        if (!selectedConversation) {
          setSelectedConversation(finalRoomId);
        }
      } else {
        // Create new conversation
        const newConv = await createNewConversation();
        if (newConv) {
          finalRoomId = newConv.roomId;
          finalSessionId = newConv.sessionId;
          setRoomId(finalRoomId);
          setSessionId(finalSessionId);
          setSelectedConversation(finalRoomId);
        } else {
          alert('Unable to create conversation. Please try again.');
          return;
        }
      }
    } else if (finalRoomId && !selectedConversation) {
      // Ensure selectedConversation is set if we have a roomId
      setSelectedConversation(finalRoomId);
    }
    
    // Show waiting message
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: 'Please wait for agent to connect to you.',
      sender: 'izaj',
      timestamp: new Date(),
    }]);
    
    // Set connecting state
    setIsConnectingToAgent(true);
    connectingToAgentRef.current = true;

    // Ensure conversation exists in Supabase
    if (finalRoomId && finalSessionId) {
      await getOrCreateConversation({
        roomId: finalRoomId,
        sessionId: finalSessionId,
        productName: productName || undefined,
        preferredLanguage: preferredLanguage || undefined,
        customerEmail: user?.email || undefined,
        customerName: getCustomerName() || undefined,
      });
      
      // Ensure conversation is in the list
      setConversations(prev => {
        const exists = prev.find(c => c.roomId === finalRoomId);
        if (!exists) {
          return [...prev, {
            roomId: finalRoomId,
            sessionId: finalSessionId,
            lastMessage: '',
            lastMessageTime: new Date(),
            productName,
            adminConnected: false, // Will be updated when admin connects via real-time
          }];
        }
        return prev;
      });
      
      console.log(`📢 [Web] Requested agent for room: ${finalRoomId}`);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    // Don't allow sending if in agent mode but not connected (admin disconnected)
    if (isAgentMode && !isConnected) {
      alert('The agent has disconnected. You can no longer reply to this conversation. Please start a new chat if you need assistance.');
      setInputValue(''); // Clear input
      return;
    }
    
    // Don't allow sending if trying to send before clicking "Chat with an Agent" when in a new conversation
    // Check if there's a message with showChatWithAgent and agent mode is not active
    const hasChatWithAgentButton = messages.some(m => m.showChatWithAgent);
    if (hasChatWithAgentButton && !isAgentMode && !isConnectingToAgent) {
      alert('Please click "Chat with an Agent" first before sending messages.');
      setInputValue(''); // Clear input
      return;
    }
    
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add message optimistically
    setMessages(prev => {
      const updated = [...prev, userMessage];
      return updated.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    });
    
    const userInput = inputValue;
    setInputValue('');

    // Use selected conversation's roomId, or current roomId, or create new one
    let finalSessionId = persistentUserId || sessionId || '';
    let finalRoomId = selectedConversation || roomId || '';
    
    // If no roomId, create a new conversation
    if (!finalRoomId && persistentUserId) {
      const newConv = await createNewConversation();
      if (newConv) {
        finalRoomId = newConv.roomId;
        finalSessionId = newConv.sessionId;
        setRoomId(finalRoomId);
        setSessionId(finalSessionId);
        setSelectedConversation(finalRoomId);
        
        console.log(`✅ [Web] Room ready for messages: ${finalRoomId}`);
        
        // Add to conversations list (prevent duplicates)
        setConversations(prev => {
          const convMap = new Map(prev.map(c => [c.roomId, c]));
          
          if (!convMap.has(finalRoomId)) {
            console.log('➕ [Web] Adding conversation from handleSend:', finalRoomId);
            convMap.set(finalRoomId, {
              roomId: finalRoomId,
              sessionId: finalSessionId,
              lastMessage: userInput,
              lastMessageTime: new Date(),
              productName,
            });
          }
          
          return Array.from(convMap.values()).sort((a, b) => 
            b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
          );
        });
      }
    }
    
    // Ensure selectedConversation is set to current roomId
    if (finalRoomId && !selectedConversation) {
      setSelectedConversation(finalRoomId);
    }

    // If in agent mode, send via Supabase
    if (isAgentMode) {
      if (finalRoomId && finalSessionId) {
        console.log('📤 [Web] Sending customer message:', { roomId: finalRoomId, sessionId: finalSessionId, text: userInput });
        
        const result = await sendMessage({
          roomId: finalRoomId,
          sessionId: finalSessionId,
          senderType: 'customer',
          messageText: userInput,
        });
        
        if (result.success) {
          setIsTyping(true);
          
          // Update conversation list
          setConversations(prev => {
            const existing = prev.find(c => c.roomId === finalRoomId);
            if (existing) {
              return prev.map(conv => 
                conv.roomId === finalRoomId 
                  ? { ...conv, lastMessage: userInput, lastMessageTime: new Date() }
                  : conv
              ).sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
            } else {
              return [...prev, {
                roomId: finalRoomId,
                sessionId: finalSessionId,
                lastMessage: userInput,
                lastMessageTime: new Date(),
                productName,
              }].sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
            }
          });
          
          // Typing indicator will be cleared when admin responds via real-time
          return;
        } else {
          alert('Failed to send message. Please try again.');
          setIsTyping(false);
          return;
        }
      }
    }

    // Bot mode - save message to Supabase and generate bot response
    if (finalRoomId && finalSessionId) {
      // Save customer message to database
      await sendMessage({
        roomId: finalRoomId,
        sessionId: finalSessionId,
        senderType: 'customer',
        messageText: userInput,
      });
    }
    
    // Generate bot response
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = generateBotResponse(userInput);
      
      const botMessage: Message = {
        id: Date.now(),
        text: botResponse.text,
        sender: 'izaj',
        timestamp: new Date(),
        isContactInfo: botResponse.showContactInfo
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Save bot response to database
      if (finalRoomId && finalSessionId) {
        sendMessage({
          roomId: finalRoomId,
          sessionId: finalSessionId,
          senderType: 'admin', // Bot responses are treated as admin messages
          messageText: botResponse.text,
        });
      }
      
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Icon icon="mdi:chat" className="text-white text-sm" />
            </div>
            <h3 className="font-semibold text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>IZAJ Assistant</h3>
            <div className="flex items-center gap-1 ml-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`} />
              <span className="text-[11px] text-white/80" style={{ fontFamily: 'Jost, sans-serif' }}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
          >
            <Icon icon="mdi:close" width={18} height={18} />
          </button>
        </div>
        <p className="text-xs text-white/80" style={{ fontFamily: 'Jost, sans-serif' }}>
          {isAgentMode 
            ? (isConnected ? '👤 Connected to an agent' : '⚠️ Agent disconnected - Cannot reply')
            : '🤖 Ask me anything about our products and services!'}
        </p>
      </div>

      {/* Main Content Area - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Conversation History */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm text-gray-700" style={{ fontFamily: 'Jost, sans-serif' }}>
                Message History
              </h4>
            </div>
            {/* New Chat Button */}
            <button
              onClick={async () => {
                const newConv = await createNewConversation();
                if (!newConv) return;

                const { roomId: newRoomId, sessionId: newSessionId } = newConv;
                
                // Clear current messages
                setMessages([]);
                setShowInitialActions(true);
                
                // Set new conversation
        setRoomId(newRoomId);
        setSessionId(newSessionId);
        setSelectedConversation(newRoomId);
        
        // Reset connecting state (adminConnected will be false for new conversation)
        setIsConnectingToAgent(false);
        connectingToAgentRef.current = false;
        
        // Save to localStorage
        if (persistentUserId) {
          localStorage.setItem(`chat_roomId_${persistentUserId}`, newRoomId);
          localStorage.setItem(`chat_sessionId_${persistentUserId}`, newSessionId);
          localStorage.setItem(`chat_selectedConversation_${persistentUserId}`, newRoomId);
        }
        
        console.log(`✅ [Web] New room ready: ${newRoomId}`);
                
                // Add to conversations list (adminConnected defaults to false for new conversation)
                // Use Map to prevent duplicates
                setConversations(prev => {
                  const convMap = new Map(prev.map(c => [c.roomId, c]));
                  
                  // Only add if it doesn't already exist
                  if (!convMap.has(newRoomId)) {
                    console.log('➕ [Web] Adding new conversation to list:', newRoomId);
                    convMap.set(newRoomId, {
                      roomId: newRoomId,
                      sessionId: newSessionId,
                      lastMessage: '',
                      lastMessageTime: new Date(),
                      productName,
                      customerName: getCustomerName() || undefined,
                      adminConnected: false, // New conversation starts disconnected
                    });
                  } else {
                    console.log('⚠️ [Web] Conversation already exists, skipping:', newRoomId);
                  }
                  
                  // Convert back to array and sort
                  return Array.from(convMap.values()).sort((a, b) => 
                    b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
                  );
                });
                
                console.log(`✨ [Web] Created new conversation: ${newRoomId}`);
              }}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              <Icon icon="mdi:message-plus" className="text-lg" />
              <span>New Chat</span>
            </button>
          </div>
          
          {isLoadingHistory ? (
            <div className="p-4 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
              No conversation history
            </div>
          ) : (
            <div className="p-2">
              {conversations.map((conv) => (
                <button
                  key={conv.roomId}
                  onClick={() => {
                    // Clear current messages before switching
                    setMessages([]);
                    setSelectedConversation(conv.roomId);
                    setRoomId(conv.roomId);
                    setSessionId(conv.sessionId);
                    
                    // Connection status is now per-conversation (adminConnected in conv object)
                    // No need to set global state - currentConversation computed value handles it
                    
                    console.log(`✅ [Web] Switched to room: ${conv.roomId}`);
                    
                    // Save selected conversation
                    if (persistentUserId) {
                      localStorage.setItem(`chat_selectedConversation_${persistentUserId}`, conv.roomId);
                      localStorage.setItem(`chat_roomId_${persistentUserId}`, conv.roomId);
                      localStorage.setItem(`chat_sessionId_${persistentUserId}`, conv.sessionId);
                    }
                  }}
                  className={`w-full p-3 rounded-lg mb-2 text-left transition-all ${
                    selectedConversation === conv.roomId
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-white hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-xs" style={{ fontFamily: 'Jost, sans-serif' }}>
                        {conv.productName ? `Product: ${conv.productName}` : 'Chat Conversation'}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                    {formatTime(conv.lastMessageTime)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Conversation Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
            {/* Show initial Quick Actions if no messages */}
            {showInitialActions && messages.length === 0 && (
              <>
                {/* Welcome Message */}
                <div className="flex justify-start animate-fade-in">
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm bg-white text-gray-800 rounded-bl-md border border-gray-100">
                    <p className="text-sm leading-relaxed mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Hi! Welcome to IZAJ Lighting. How can I help you today?
                    </p>
                    <QuickActions />
                  </div>
                </div>
              </>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-black to-gray-800 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>{msg.text}</p>
                  {msg.isContactInfo && (
                    <div className="mt-3">
                      <ContactInfoMessage />
                    </div>
                  )}
                  {msg.showChatWithAgent && (
                    <div className="mt-4">
                      <button
                        onClick={handleConnectToAgent}
                        disabled={isConnectingToAgent || isAgentMode}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ fontFamily: 'Jost, sans-serif' }}
                      >
                        {isConnectingToAgent ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Connecting to agent...</span>
                          </>
                        ) : isAgentMode ? (
                          <>
                            <Icon icon="mdi:account-check" className="text-lg" />
                            <span>{isConnected ? 'Connected to Agent' : 'Waiting for agent...'}</span>
                          </>
                        ) : (
                          <>
                            <Icon icon="mdi:account-circle" className="text-lg" />
                            <span>Chat with an Agent</span>
                          </>
                        )}
                      </button>
                      {isConnectingToAgent && (
                        <p className="text-xs text-gray-500 mt-2 text-center" style={{ fontFamily: 'Jost, sans-serif' }}>
                          Please wait while we connect you to an agent...
                        </p>
                      )}
                      {isAgentMode && !isConnected && !isConnectingToAgent && (
                        <p className="text-xs text-orange-500 mt-2 text-center" style={{ fontFamily: 'Jost, sans-serif' }}>
                          Waiting for agent to connect. You cannot send messages yet.
                        </p>
                      )}
                    </div>
                  )}
                  <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`} style={{ fontFamily: 'Jost, sans-serif' }}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white text-gray-800 rounded-bl-md border border-gray-100 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-gray-400 ml-2" style={{ fontFamily: 'Jost, sans-serif' }}>IZAJ is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>


          {/* Agent Mode Indicator */}
          {isAgentMode && (
            <div className={`px-4 py-2 border-t border-gray-200 ${isConnected ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-red-50 to-orange-50'}`}>
              <div className={`flex items-center justify-center gap-2 ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                <Icon icon={isConnected ? "mdi:account-check" : "mdi:account-off"} className="text-lg" />
                <span className="text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>
                  {isConnected ? 'Connected to an agent' : 'Disconnected - Cannot reply'}
                </span>
              </div>
              {!isConnected && (
                <p className="text-xs text-red-600 mt-1 text-center" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Please reconnect or start a new chat
                </p>
              )}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-white shadow-lg">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    (isAgentMode && !isConnected)
                      ? "Agent disconnected - Cannot reply..."
                      : (messages.some(m => m.showChatWithAgent) && !isAgentMode && !isConnectingToAgent)
                      ? "Click 'Chat with an Agent' first..."
                      : "Type your message..."
                  }
                  disabled={(isAgentMode && !isConnected) || (messages.some(m => m.showChatWithAgent) && !isAgentMode && !isConnectingToAgent)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Jost, sans-serif' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping || (isAgentMode && !isConnected) || (messages.some(m => m.showChatWithAgent) && !isAgentMode && !isConnectingToAgent)}
                className="px-4 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-full hover:from-gray-800 hover:to-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                title={
                  isAgentMode && !isConnected 
                    ? "Agent disconnected - Cannot send messages" 
                    : (messages.some(m => m.showChatWithAgent) && !isAgentMode && !isConnectingToAgent)
                    ? "Please click 'Chat with an Agent' first"
                    : ""
                }
              >
                <Icon icon="mdi:send" width={18} height={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CompactChat;

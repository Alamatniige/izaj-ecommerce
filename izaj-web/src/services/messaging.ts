import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Conversation {
  id: string;
  room_id: string;
  session_id: string;
  product_name?: string;
  preferred_language?: 'en' | 'tl';
  status: 'active' | 'closed' | 'archived';
  admin_connected: boolean;
  customer_email?: string;
  customer_name?: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  room_id: string;
  session_id: string;
  sender_type: 'customer' | 'admin';
  sender_id?: string;
  message_text: string;
  created_at: string;
  read_at?: string;
  is_read: boolean;
}

/**
 * Get or create a conversation
 */
export async function getOrCreateConversation(params: {
  roomId: string;
  sessionId: string;
  productName?: string;
  preferredLanguage?: 'en' | 'tl';
  customerEmail?: string;
  customerName?: string;
}): Promise<{ success: boolean; conversation?: Conversation; error?: string }> {
  try {
    const supabase = createClient();

    // First, try to find existing conversation
    const { data: existing, error: findError } = await supabase
      .from('conversations')
      .select('*')
      .eq('room_id', params.roomId)
      .single();

    if (existing && !findError) {
      return { success: true, conversation: existing as Conversation };
    }

    // Create new conversation if not found
    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert({
        room_id: params.roomId,
        session_id: params.sessionId,
        product_name: params.productName || null,
        preferred_language: params.preferredLanguage || null,
        customer_email: params.customerEmail || null,
        customer_name: params.customerName || null,
        status: 'active',
        admin_connected: false,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating conversation:', createError);
      return { success: false, error: createError.message };
    }

    return { success: true, conversation: newConv as Conversation };
  } catch (error: any) {
    console.error('Error in getOrCreateConversation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all conversations for a session
 */
export async function getConversations(sessionId: string): Promise<{
  success: boolean;
  conversations?: Conversation[];
  error?: string;
}> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('session_id', sessionId)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return { success: false, error: error.message };
    }

    return { success: true, conversations: (data || []) as Conversation[] };
  } catch (error: any) {
    console.error('Error in getConversations:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(roomId: string): Promise<{
  success: boolean;
  messages?: Message[];
  conversation?: Conversation;
  error?: string;
}> {
  try {
    const supabase = createClient();

    // Get conversation first
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('room_id', roomId)
      .single();

    if (convError && convError.code !== 'PGRST116') {
      console.error('Error fetching conversation:', convError);
      return { success: false, error: convError.message };
    }

    // Get messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return { success: false, error: messagesError.message };
    }

    return {
      success: true,
      messages: (messages || []) as Message[],
      conversation: conv as Conversation | undefined,
    };
  } catch (error: any) {
    console.error('Error in getMessages:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send a message
 */
export async function sendMessage(params: {
  roomId: string;
  sessionId: string;
  senderType: 'customer' | 'admin';
  messageText: string;
  senderId?: string;
}): Promise<{ success: boolean; message?: Message; error?: string }> {
  try {
    const supabase = createClient();

    // Get or create conversation
    const convResult = await getOrCreateConversation({
      roomId: params.roomId,
      sessionId: params.sessionId,
    });

    if (!convResult.success || !convResult.conversation) {
      return { success: false, error: 'Failed to get or create conversation' };
    }

    // Insert message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: convResult.conversation.id,
        room_id: params.roomId,
        session_id: params.sessionId,
        sender_type: params.senderType,
        sender_id: params.senderId || null,
        message_text: params.messageText,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }

    return { success: true, message: message as Message };
  } catch (error: any) {
    console.error('Error in sendMessage:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update admin connection status
 */
export async function updateAdminConnection(
  roomId: string,
  adminConnected: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('conversations')
      .update({ admin_connected: adminConnected })
      .eq('room_id', roomId);

    if (error) {
      console.error('Error updating admin connection:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in updateAdminConnection:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Subscribe to real-time updates for a conversation
 */
export function subscribeToConversation(
  roomId: string,
  callbacks: {
    onMessage?: (message: Message) => void;
    onAdminConnected?: (data: { roomId: string; adminConnected: boolean }) => void;
    onAdminDisconnected?: (data: { roomId: string }) => void;
  }
): RealtimeChannel {
  const supabase = createClient();

  // Subscribe to messages INSERT events
  const messagesChannel = supabase
    .channel(`messages:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        console.log('📨 [Supabase] New message received via real-time:', payload.new);
        if (callbacks.onMessage) {
          callbacks.onMessage(payload.new as Message);
        }
      }
    )
    // Also listen for UPDATE events (in case messages are updated)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        console.log('📨 [Supabase] Message updated via real-time:', payload.new);
        if (callbacks.onMessage) {
          callbacks.onMessage(payload.new as Message);
        }
      }
    )
    .subscribe((status) => {
      console.log(`📡 [Supabase] Subscription status for ${roomId}:`, status);
      if (status === 'SUBSCRIBED') {
        console.log(`✅ [Supabase] Successfully subscribed to messages for room: ${roomId}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`❌ [Supabase] Error subscribing to messages for room: ${roomId}`);
      }
    });

  // Subscribe to conversation updates (for admin_connected changes)
  const convChannel = supabase
    .channel(`conversation:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        const updated = payload.new as Conversation;
        if (updated.admin_connected && callbacks.onAdminConnected) {
          callbacks.onAdminConnected({ roomId, adminConnected: true });
        } else if (!updated.admin_connected && callbacks.onAdminDisconnected) {
          callbacks.onAdminDisconnected({ roomId });
        }
      }
    )
    .subscribe();

  // Return a combined channel reference (we'll use messagesChannel as primary)
  return messagesChannel;
}

/**
 * Subscribe to new conversations for a session
 */
export function subscribeToConversations(
  sessionId: string,
  callback: (conversation: Conversation) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`conversations:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          callback(payload.new as Conversation);
        }
      }
    )
    .subscribe();

  return channel;
}


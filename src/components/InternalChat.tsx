import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  message: string;
  created_at: string;
}

const USERS = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Manuel' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Laura' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Jens' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Nico' },
];

export default function InternalChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Da noch kein Login existiert, simulieren wir, wer du gerade bist
  const [activeUser, setActiveUser] = useState(USERS[0]); 
  
  // NEU: Empfänger-Logik
  const [recipient, setRecipient] = useState<string>('all'); 
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    const subscription = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newChatMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newChatMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Fehler beim Laden der Nachrichten:', error);
    } else {
      setMessages(data || []);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert([
        { 
          sender_id: activeUser.id,
          recipient_id: recipient === 'all' ? null : recipient,
          message: newMessage 
        }
      ]);

    if (error) {
      console.error('Fehler beim Senden:', error);
    } else {
      setNewMessage('');
    }
  };

  const getUserName = (uuid: string | null) => {
    if (!uuid) return 'Alle';
    const user = USERS.find(u => u.id === uuid);
    return user ? user.name : 'Unbekannt';
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '75vh', 
      backgroundColor: '#111827', 
      borderRadius: '16px', 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
      color: '#f9fafb'
    }}>
      
      {/* Header & Controls */}
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#1f2937', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          💬 Chat
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Mock-Login (Wer bin ich?) */}
          <select 
            value={activeUser.id} 
            onChange={(e) => setActiveUser(USERS.find(u => u.id === e.target.value) || USERS[0])}
            style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#374151', color: '#f9fafb', border: 'none', outline: 'none', cursor: 'pointer' }}
          >
            {USERS.map(user => (
              <option key={`sender-${user.id}`} value={user.id}>Ich bin: {user.name}</option>
            ))}
          </select>

          {/* NEU: Senden an (Empfänger) */}
          <select 
            value={recipient} 
            onChange={(e) => setRecipient(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#ec4899', color: '#ffffff', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <option value="all">Senden an: Alle</option>
            {USERS.map(user => (
              <option key={`rec-${user.id}`} value={user.id}>Senden an: {user.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Nachrichten-Verlauf */}
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg) => {
          const isMe = msg.sender_id === activeUser.id;
          
          // Nachrichten filtern: Nur anzeigen, wenn an mich, von mir oder an Alle
          const isRelevant = msg.recipient_id === null || msg.recipient_id === activeUser.id || isMe;
          if (!isRelevant) return null;

          return (
            <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.3rem', textAlign: isMe ? 'right' : 'left' }}>
                {getUserName(msg.sender_id)} {msg.recipient_id ? `→ an ${getUserName(msg.recipient_id)}` : '→ an Alle'}
              </div>
              <div style={{ 
                padding: '0.75rem 1.25rem', 
                backgroundColor: isMe ? '#ec4899' : '#374151', 
                color: '#ffffff',
                borderRadius: '12px', 
                borderBottomRightRadius: isMe ? '2px' : '12px',
                borderBottomLeftRadius: !isMe ? '2px' : '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Eingabefeld */}
      <form onSubmit={handleSendMessage} style={{ padding: '1.5rem', backgroundColor: '#1f2937', display: 'flex', gap: '1rem' }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nachricht tippen..." 
          style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: '#111827', color: '#f9fafb', border: 'none', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#be185d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Senden
        </button>
      </form>

    </div>
  );
}
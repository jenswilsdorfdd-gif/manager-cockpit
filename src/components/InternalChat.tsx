import { useState, useEffect, useRef } from 'react';
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
  
  // Im Hintergrund fix auf den ersten User gesetzt (ohne UI)
  const [activeUser] = useState(USERS[0]); 
  
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
    <div className="fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '75vh', 
      backgroundColor: '#111827', 
      borderRadius: '16px', 
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
      borderTop: '4px solid #ec4899',
      overflow: 'hidden',
      color: '#f9fafb'
    }}>
      
      {/* Header & Controls */}
      <div style={{ 
        padding: '1.5rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ec4899' }}>
          💬 Interner Chat
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#9ca3af', fontSize: '0.95rem', fontWeight: '600' }}>Senden an:</span>
          
          <select 
            value={recipient} 
            onChange={(e) => setRecipient(e.target.value)}
            style={{ 
              padding: '0.6rem 1.2rem', 
              borderRadius: '8px', 
              backgroundColor: '#ec4899', 
              color: '#ffffff', 
              border: 'none', 
              outline: 'none', 
              cursor: 'pointer', 
              fontWeight: '600',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
            }}
          >
            <option value="all">Alle</option>
            {USERS.map(user => (
              <option key={`rec-${user.id}`} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Nachrichten-Verlauf */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {messages.map((msg) => {
          const isMe = msg.sender_id === activeUser.id;
          
          const isRelevant = msg.recipient_id === null || msg.recipient_id === activeUser.id || isMe;
          if (!isRelevant) return null;

          return (
            <div key={msg.id} className="fade-in" style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.4rem', textAlign: isMe ? 'right' : 'left' }}>
                {getUserName(msg.sender_id)} {msg.recipient_id ? `→ an ${getUserName(msg.recipient_id)}` : '→ an Alle'}
              </div>
              <div style={{ 
                padding: '1rem 1.5rem', 
                backgroundColor: isMe ? '#ec4899' : '#1f2937', 
                color: '#ffffff',
                borderRadius: '16px', 
                borderBottomRightRadius: isMe ? '4px' : '16px',
                borderBottomLeftRadius: !isMe ? '4px' : '16px',
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
      <form onSubmit={handleSendMessage} style={{ padding: '1.5rem 2rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nachricht tippen..." 
          style={{ 
            flex: 1, 
            padding: '1rem 1.25rem', 
            borderRadius: '12px', 
            backgroundColor: '#1f2937', 
            color: '#f9fafb', 
            border: 'none', 
            outline: 'none',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
        <button 
          type="submit" 
          className="hover-scale"
          style={{ 
            padding: '0 1.5rem', 
            backgroundColor: '#be185d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
          }}
        >
          Senden
        </button>
      </form>

    </div>
  );
}
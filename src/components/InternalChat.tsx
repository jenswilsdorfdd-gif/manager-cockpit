import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  message: string;
  created_at: string;
}

export default function InternalChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Speichert die echte Supabase-UUID des aktuell eingeloggten Users
  const [activeUserId, setActiveUserId] = useState<string | null>(null); 
  
  const [recipient, setRecipient] = useState<string>('all'); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Aktuellen User beim Mounten laden
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setActiveUserId(user.id);
      }
    };
    fetchUser();

    // 2. Nachrichten laden & Subscription starten
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
    if (!newMessage.trim() || !activeUserId) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert([
        { 
          sender_id: activeUserId,
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

  // Hilfsfunktion: Kürzt vorerst die UUID, bis wir eine echte User-Tabelle haben
  const formatUser = (uuid: string | null) => {
    if (!uuid) return 'Alle';
    if (uuid === activeUserId) return 'Du';
    return `User (${uuid.substring(0, 4)}...)`;
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
            <option value="" disabled>--- Echte User folgen ---</option>
          </select>
        </div>
      </div>

      {/* Nachrichten-Verlauf */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {messages.map((msg) => {
          const isMe = msg.sender_id === activeUserId;
          
          // Filter: Zeige nur Globale (null), an MICH adressierte, oder VON MIR gesendete Nachrichten
          const isRelevant = msg.recipient_id === null || msg.recipient_id === activeUserId || isMe;
          if (!isRelevant) return null;

          return (
            <div key={msg.id} className="fade-in" style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.4rem', textAlign: isMe ? 'right' : 'left' }}>
                {formatUser(msg.sender_id)} {msg.recipient_id ? `→ an ${formatUser(msg.recipient_id)}` : '→ an Alle'}
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
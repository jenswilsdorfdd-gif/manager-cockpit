import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  message: string;
  created_at: string;
}

interface Profile {
  id: string;
  first_name: string;
}

export default function InternalChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Auth & Profile States
  const [activeUserId, setActiveUserId] = useState<string | null>(null); 
  const [profiles, setProfiles] = useState<Profile[]>([]);
  
  const [recipient, setRecipient] = useState<string>('all'); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. User & Profile beim Mounten laden inkl. Debugging-Logs
    const fetchUserAndProfiles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setActiveUserId(user.id);
      }

      console.log("Lade Profile...");
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name');
        
      console.log("Supabase Profil-Antwort:", { profileData, profileError });

      if (!profileError && profileData) {
        setProfiles(profileData);
      }
    };
    fetchUserAndProfiles();

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

  // Hilfsfunktion: Wandelt UUID in echten Vornamen um
  const formatUser = (uuid: string | null) => {
    if (!uuid) return 'Alle';
    if (uuid === activeUserId) return 'Du';
    const userProfile = profiles.find(p => p.id === uuid);
    return userProfile ? userProfile.first_name : 'Unbekannt';
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
      
      {/* Scope-isolierter Style für den Placeholder im Chat-Input */}
      <style>{`
        .chat-input::placeholder {
          color: #e5e7eb !important;
          opacity: 0.9 !important;
        }
      `}</style>

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
        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ec4899' }}>
          💬 Interner Chat
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#d1d5db', fontSize: '1.1rem', fontWeight: '600' }}>Senden an:</span>
          
          <select 
            value={recipient} 
            onChange={(e) => setRecipient(e.target.value)}
            style={{ 
              padding: '0.75rem 1.25rem', 
              borderRadius: '8px', 
              backgroundColor: '#1f2937', 
              color: '#ffffff', 
              border: '2px solid #ec4899', 
              outline: 'none', 
              cursor: 'pointer', 
              fontWeight: '600',
              fontSize: '1.1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
            }}
          >
            <option value="all" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Alle</option>
            {profiles.map((profile) => (
              <option 
                key={profile.id} 
                value={profile.id} 
                style={{ backgroundColor: '#1f2937', color: '#ffffff' }}
              >
                {profile.first_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nachrichten-Verlauf */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.map((msg) => {
          const isMe = msg.sender_id === activeUserId;
          
          // Filter: Zeige nur Globale (null), an MICH adressierte, oder VON MIR gesendete Nachrichten
          const isRelevant = msg.recipient_id === null || msg.recipient_id === activeUserId || isMe;
          if (!isRelevant) return null;

          return (
            <div key={msg.id} className="fade-in" style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{ fontSize: '0.95rem', color: '#9ca3af', marginBottom: '0.5rem', textAlign: isMe ? 'right' : 'left' }}>
                {formatUser(msg.sender_id)} {msg.recipient_id ? `→ an ${formatUser(msg.recipient_id)}` : '→ an Alle'}
              </div>
              <div style={{ 
                padding: '1.25rem 1.75rem', 
                backgroundColor: isMe ? '#ec4899' : '#1f2937', 
                color: '#ffffff',
                fontSize: '1.1rem',
                lineHeight: '1.5',
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
          className="chat-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nachricht tippen..." 
          style={{ 
            flex: 1, 
            padding: '1.25rem 1.5rem', 
            borderRadius: '12px', 
            backgroundColor: '#1f2937', 
            color: '#ffffff', 
            fontSize: '1.1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            outline: 'none',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
          }}
        />
        <button 
          type="submit" 
          className="hover-scale"
          style={{ 
            padding: '0 2rem', 
            backgroundColor: '#be185d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
          }}
        >
          Senden
        </button>
      </form>

    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

// Typ-Definition für unsere Datenbank-Tabelle
interface ChatMessage {
  id: string;
  sender_id: string; 
  message: string;
  created_at: string;
}

// Dummy-User für das Frontend, bis die echte Supabase-Auth steht.
// Wir nutzen fiktive UUIDs, da die Datenbank den Typ UUID erwartet.
const USERS = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Manuel' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Laura' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Jens' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Nico' },
];

export default function InternalChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUser, setActiveUser] = useState(USERS[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Nachrichten beim Start laden & Realtime abonnieren
  useEffect(() => {
    fetchMessages();

    // Supabase Realtime Subscription für die chat_messages Tabelle
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

    // Cleanup: Verbindung trennen, wenn Komponente geschlossen wird
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Automatisches Scrollen zur neuesten Nachricht
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true }); // Älteste zuerst, damit wir von oben nach unten lesen

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
          message: newMessage 
        }
      ]);

    if (error) {
      console.error('Fehler beim Senden:', error);
    } else {
      setNewMessage(''); // Input leeren bei Erfolg
    }
  };

  // Hilfsfunktion: Finde den Namen zur UUID
  const getUserName = (uuid: string) => {
    const user = USERS.find(u => u.id === uuid);
    return user ? user.name : 'Unbekannt';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '70vh', backgroundColor: '#fdf2f8', borderRadius: '12px', border: '1px solid #fbcfe8', overflow: 'hidden' }}>
      
      {/* Header & User-Switch */}
      <div style={{ padding: '1rem', backgroundColor: '#fce7f3', borderBottom: '1px solid #fbcfe8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#9d174d', fontSize: '1.2rem' }}>💬 Interner Chat</h2>
        <select 
          value={activeUser.id} 
          onChange={(e) => setActiveUser(USERS.find(u => u.id === e.target.value) || USERS[0])}
          style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #f9a8d4' }}
        >
          {USERS.map(user => (
            <option key={user.id} value={user.id}>Schreiben als: {user.name}</option>
          ))}
        </select>
      </div>

      {/* Nachrichten-Verlauf */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {messages.map((msg) => {
          const isMe = msg.sender_id === activeUser.id;
          return (
            <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{ fontSize: '0.75rem', color: '#831843', marginBottom: '0.2rem', textAlign: isMe ? 'right' : 'left' }}>
                {getUserName(msg.sender_id)}
              </div>
              <div style={{ 
                padding: '0.6rem 1rem', 
                backgroundColor: isMe ? '#be185d' : '#ffffff', 
                color: isMe ? 'white' : '#1f2937',
                borderRadius: '12px', 
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                border: isMe ? 'none' : '1px solid #fbcfe8'
              }}>
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Eingabefeld */}
      <form onSubmit={handleSendMessage} style={{ padding: '1rem', backgroundColor: '#ffffff', borderTop: '1px solid #fbcfe8', display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nachricht tippen..." 
          style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid #fbcfe8', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '0.6rem 1.2rem', backgroundColor: '#be185d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Senden
        </button>
      </form>

    </div>
  );
}
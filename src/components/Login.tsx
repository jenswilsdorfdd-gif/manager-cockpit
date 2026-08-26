import { useState } from 'react';
import { supabase } from '../supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('Login fehlgeschlagen. Bitte Zugangsdaten prüfen.');
    }
    
    setLoading(false);
  };

  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
    }}>
      
      {/* Logo-Bereich */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
        <span style={{ color: '#ec4899', fontSize: '2.5rem', fontWeight: '600', letterSpacing: '1px' }}>
          ((o))
        </span>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '300', color: '#ffffff', letterSpacing: '0.05em' }}>
          SONAR <span style={{ fontWeight: '200' }}>AUTH</span>
        </h1>
      </div>

      {/* Login Kachel */}
      <div style={{
        backgroundColor: '#111827',
        padding: '3rem',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        borderTop: '4px solid #ec4899',
        color: '#f9fafb'
      }}>
        
        <h2 style={{ marginTop: 0, marginBottom: '2rem', fontSize: '1.5rem', textAlign: 'center' }}>
          System-Login
        </h2>

        {errorMsg && (
          <div style={{ 
            backgroundColor: 'rgba(244, 63, 94, 0.1)', 
            color: '#f43f5e', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            border: '1px solid rgba(244, 63, 94, 0.2)'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.9rem', color: '#9ca3af', fontWeight: '600' }}>E-Mail Adresse</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#1f2937',
                color: '#f9fafb',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                outline: 'none',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.9rem', color: '#9ca3af', fontWeight: '600' }}>Passwort</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#1f2937',
                color: '#f9fafb',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                outline: 'none',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="hover-scale"
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Authentifiziere...' : 'Einloggen'}
          </button>

        </form>
      </div>
    </div>
  );
}
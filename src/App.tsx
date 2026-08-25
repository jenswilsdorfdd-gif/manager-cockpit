import { useState } from 'react';
import InternalChat from './components/InternalChat';

// --- ANIMATIONEN & STYLES ---
// CSS direkt injiziert für fließende Animationen ohne externe Dependencies (Regel 11)
const styleSheet = `
  .fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .hover-scale {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .hover-scale:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.4) !important;
  }
  .back-btn {
    transition: all 0.2s ease;
  }
  .back-btn:hover {
    background-color: #374151 !important;
    transform: scale(1.03);
  }
`;

// --- UNTERSEITEN (Aufgewertet) ---
const TaskManager = () => (
  <div className="fade-in" style={{ padding: '2.5rem', backgroundColor: '#111827', borderRadius: '16px', minHeight: '70vh', color: '#f9fafb', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)', borderTop: '4px solid #f43f5e' }}>
    <h2 style={{ marginTop: 0, color: '#f43f5e', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>📋 Aufgaben</h2>
    <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>Hier entsteht das detaillierte Wiedervorlage-Modul (Tasks)...</p>
  </div>
);

const FinanceLedger = () => (
  <div className="fade-in" style={{ padding: '2.5rem', backgroundColor: '#111827', borderRadius: '16px', minHeight: '70vh', color: '#f9fafb', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)', borderTop: '4px solid #4f46e5' }}>
    <h2 style={{ marginTop: 0, color: '#4f46e5', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>💰 Finanzen</h2>
    <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>Hier entsteht der detaillierte Cashflow-Tracker...</p>
  </div>
);

// --- HAUPT-LAYOUT ---
export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'tasks' | 'finance' | 'chat'>('dashboard');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f9fafb', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* StyleSheet injizieren */}
      <style>{styleSheet}</style>

      {/* Header mit neuem SONAR Logo */}
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto 3rem auto', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* LOGO BEREICH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: '#ec4899', fontSize: '2rem', fontWeight: '600', letterSpacing: '1px' }}>
            ((o))
          </span>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '300', color: '#ffffff', letterSpacing: '0.05em' }}>
            SONAR <span style={{ fontWeight: '200' }}>MANAGER COCKPIT</span>
          </h1>
        </div>

        {/* ZURÜCK BUTTON */}
        {activeView !== 'dashboard' && (
          <button 
            className="fade-in back-btn"
            onClick={() => setActiveView('dashboard')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#1f2937', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '600',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
            }}
          >
            ← Zurück zum Dashboard
          </button>
        )}
      </header>
      
      {/* DASHBOARD ANSICHT */}
      {activeView === 'dashboard' && (
        <main className="fade-in" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '2rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          
          {/* AUFGABEN KACHEL */}
          <div 
            className="hover-scale"
            onClick={() => setActiveView('tasks')}
            style={{ 
              background: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)', 
              borderRadius: '16px', 
              padding: '2rem', 
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>📋 Aufgaben</h2>
            </div>
            <div style={{ fontSize: '0.95rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', color: '#ffffff' }}>
              <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Gesamt:</span> <strong>25</strong>
              </div>
              <div style={{ color: '#fee2e2', display: 'flex', justifyContent: 'space-between' }}>
                <span>Verfristet:</span> <strong>10</strong>
              </div>
            </div>
          </div>

          {/* FINANZEN KACHEL */}
          <div 
            className="hover-scale"
            onClick={() => setActiveView('finance')}
            style={{ 
              background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)', 
              borderRadius: '16px', 
              padding: '2rem', 
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>💰 Finanzen</h2>
            </div>
            <div style={{ fontSize: '0.95rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', color: '#ffffff' }}>
              <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Gesamtumsatz:</span> <strong>125.000 €</strong>
              </div>
              <div style={{ color: '#e0e7ff', display: 'flex', justifyContent: 'space-between' }}>
                <span>Fördermittel:</span> <strong>45.000 €</strong>
              </div>
            </div>
          </div>

          {/* CHAT KACHEL */}
          <div 
            className="hover-scale"
            onClick={() => setActiveView('chat')}
            style={{ 
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', 
              borderRadius: '16px', 
              padding: '2rem', 
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>💬 Interner Chat</h2>
            </div>
            <div style={{ fontSize: '0.95rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', color: '#ffffff' }}>
              <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Nachrichten gesamt:</span> <strong>100</strong>
              </div>
              <div style={{ color: '#fce7f3', display: 'flex', justifyContent: 'space-between' }}>
                <span>Neu & ungelesen:</span> <strong>2</strong>
              </div>
            </div>
          </div>

        </main>
      )}

      {/* DETAIL ANSICHTEN */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {activeView === 'tasks' && <TaskManager />}
        {activeView === 'finance' && <FinanceLedger />}
        {activeView === 'chat' && (
          <div className="fade-in">
            <InternalChat />
          </div>
        )}
      </div>

    </div>
  );
}
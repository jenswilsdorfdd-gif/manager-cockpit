import React, { useState } from 'react';
import InternalChat from './components/InternalChat';

// --- PLATZHALTER-KOMPONENTEN ---
const TaskManager = () => (
  <div style={{ padding: '1.5rem', backgroundColor: '#111827', borderRadius: '12px', minHeight: '70vh', color: 'white', border: '1px solid #1f2937' }}>
    <h2 style={{ marginTop: 0, color: '#4ade80' }}>📋 Aufgaben</h2>
    <p>Hier entsteht das detaillierte Wiedervorlage-Modul (Tasks)...</p>
  </div>
);

const FinanceLedger = () => (
  <div style={{ padding: '1.5rem', backgroundColor: '#111827', borderRadius: '12px', minHeight: '70vh', color: 'white', border: '1px solid #1f2937' }}>
    <h2 style={{ marginTop: 0, color: '#60a5fa' }}>💰 Finanzen</h2>
    <p>Hier entsteht der detaillierte Cashflow-Tracker...</p>
  </div>
);

// --- HAUPT-LAYOUT ---
export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'tasks' | 'finance' | 'chat'>('dashboard');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#f9fafb', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header mit Zurück-Button, wenn nicht auf Dashboard */}
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid #1f2937', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em' }}>MANAGER COCKPIT</h1>
        {activeView !== 'dashboard' && (
          <button 
            onClick={() => setActiveView('dashboard')}
            style={{ padding: '0.6rem 1.2rem', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ← Zurück zum Dashboard
          </button>
        )}
      </header>
      
      {/* DASHBOARD ANSICHT */}
      {activeView === 'dashboard' && (
        <main style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          {/* AUFGABEN KACHEL */}
          <div 
            onClick={() => setActiveView('tasks')}
            style={{ 
              background: 'linear-gradient(135deg, #16a34a 0%, #065f46 100%)', 
              borderRadius: '16px', 
              padding: '2rem', 
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              border: '1px solid #22c55e'
            }}
          >
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>📋 Aufgaben</h2>
            <div style={{ fontSize: '0.95rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ marginBottom: '0.5rem' }}><strong>25</strong> Aufgaben insgesamt</div>
              <div style={{ color: '#fca5a5' }}><strong>10</strong> verfristet</div>
            </div>
          </div>

          {/* FINANZEN KACHEL */}
          <div 
            onClick={() => setActiveView('finance')}
            style={{ 
              background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)', 
              borderRadius: '16px', 
              padding: '2rem', 
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              border: '1px solid #3b82f6'
            }}
          >
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>💰 Finanzen</h2>
            <div style={{ fontSize: '0.95rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ marginBottom: '0.5rem' }}><strong>Gesamtumsatz:</strong> 125.000 €</div>
              <div style={{ color: '#93c5fd' }}><strong>Fördermittel:</strong> 45.000 €</div>
            </div>
          </div>

          {/* CHAT KACHEL */}
          <div 
            onClick={() => setActiveView('chat')}
            style={{ 
              background: 'linear-gradient(135deg, #db2777 0%, #831843 100%)', 
              borderRadius: '16px', 
              padding: '2rem', 
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              border: '1px solid #ec4899'
            }}
          >
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>💬 Interner Chat</h2>
            <div style={{ fontSize: '0.95rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ marginBottom: '0.5rem' }}><strong>100</strong> Nachrichten gesamt</div>
              <div style={{ color: '#fbcfe8' }}><strong>2</strong> neu & ungelesen</div>
            </div>
          </div>

        </main>
      )}

      {/* DETAIL ANSICHTEN */}
      {activeView === 'tasks' && <TaskManager />}
      {activeView === 'finance' && <FinanceLedger />}
      {activeView === 'chat' && <InternalChat />}

    </div>
  );
}
import React, { useState } from 'react';
import InternalChat from './components/InternalChat';

// --- PLATZHALTER-KOMPONENTEN ---
const TaskManager = () => (
  <div style={{ padding: '2rem', backgroundColor: '#111827', borderRadius: '16px', minHeight: '70vh', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
    <h2 style={{ marginTop: 0, color: '#4ade80' }}>📋 Aufgaben</h2>
    <p>Hier entsteht das detaillierte Wiedervorlage-Modul (Tasks)...</p>
  </div>
);

const FinanceLedger = () => (
  <div style={{ padding: '2rem', backgroundColor: '#111827', borderRadius: '16px', minHeight: '70vh', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
    <h2 style={{ marginTop: 0, color: '#60a5fa' }}>💰 Finanzen</h2>
    <p>Hier entsteht der detaillierte Cashflow-Tracker...</p>
  </div>
);

// --- HAUPT-LAYOUT ---
export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'tasks' | 'finance' | 'chat'>('dashboard');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f9fafb', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header mit Zurück-Button, wenn nicht auf Dashboard */}
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em' }}>MANAGER COCKPIT</h1>
        {activeView !== 'dashboard' && (
          <button 
            onClick={() => setActiveView('dashboard')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#1f2937', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '600' 
            }}
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
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          {/* AUFGABEN KACHEL */}
          <div 
            onClick={() => setActiveView('tasks')}
            style={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
              borderRadius: '16px', 
              padding: '2rem', 
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>📋 Aufgaben</h2>
            </div>
            <div style={{ fontSize: '0.95rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px' }}>
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
            onClick={() => setActiveView('finance')}
            style={{ 
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', 
              borderRadius: '16px', 
              padding: '2rem', 
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>💰 Finanzen</h2>
            </div>
            <div style={{ fontSize: '0.95rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px' }}>
              <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Gesamtumsatz:</span> <strong>125.000 €</strong>
              </div>
              <div style={{ color: '#ddd6fe', display: 'flex', justifyContent: 'space-between' }}>
                <span>Fördermittel:</span> <strong>45.000 €</strong>
              </div>
            </div>
          </div>

          {/* CHAT KACHEL */}
          <div 
            onClick={() => setActiveView('chat')}
            style={{ 
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', 
              borderRadius: '16px', 
              padding: '2rem', 
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>💬 Interner Chat</h2>
            </div>
            <div style={{ fontSize: '0.95rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px' }}>
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
      {activeView === 'tasks' && <TaskManager />}
      {activeView === 'finance' && <FinanceLedger />}
      {activeView === 'chat' && <InternalChat />}

    </div>
  );
}
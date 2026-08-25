import React from 'react';
import InternalChat from './components/InternalChat';

// --- PLATZHALTER-KOMPONENTEN ---
// Diese lagern wir später gemäß Regel 12 in saubere Child-Komponenten aus.
const TaskManager = () => (
  <div style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '12px', minHeight: '70vh', border: '1px solid #bbf7d0' }}>
    <h2 style={{ marginTop: 0, color: '#166534' }}>📋 Aufgaben</h2>
    <p style={{ color: '#15803d' }}>Hier entsteht das Wiedervorlage-Modul (Tasks)...</p>
  </div>
);

const FinanceLedger = () => (
  <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '12px', minHeight: '70vh', border: '1px solid #bfdbfe' }}>
    <h2 style={{ marginTop: 0, color: '#1e40af' }}>💰 Finanzen</h2>
    <p style={{ color: '#1d4ed8' }}>Hier entsteht das Ledger / der Cashflow-Tracker...</p>
  </div>
);

// --- HAUPT-LAYOUT ---
export default function App() {
  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #e5e7eb' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#111827' }}>MANAGER COCKPIT</h1>
      </header>
      
      {/* 
        Responsives Grid: 
        - auto-fit & minmax(350px) sorgt dafür, dass auf dem Handy alles untereinander ist.
        - Auf dem Desktop/Tablet drückt es sich automatisch in 2 oder 3 Spalten nebeneinander.
      */}
      <main style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '2rem' 
      }}>
        <TaskManager />
        <FinanceLedger />
        <InternalChat />
      </main>

    </div>
  );
}
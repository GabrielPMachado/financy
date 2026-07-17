import React from 'react';
import DatePicker from 'react-datepicker';

const Header = ({ colors, dataFiltroConvertida, mesFiltro, setMesFiltro, saldo }) => {
  return (
    <header style={{ 
      marginBottom: '2.5rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      minHeight: '80px',
      position: 'relative'
    }}>
      <div>
        <p style={{ color: colors.textSecondary, margin: '0 0 4px 0', fontSize: '0.9rem' }}>Olá, Gabriel</p>
        <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '800' }}>Dashboard</h1>
      </div>
      
      <div className="glass-panel" style={{ 
        textAlign: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '0.75rem 1.5rem' // Sobrescreve o padding padrão do glass-panel
      }}>
        <p style={{ fontSize: '0.8rem', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '700', letterSpacing: '1px' }}>
          SALDO ATUAL
        </p>
        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: colors.textPrimary, textShadow: `0 0 15px rgba(255, 255, 255, 0.2)` }}>
          R$ {Number(saldo).toFixed(2).replace('.', ',')}
        </h2>
      </div>

      <div>
        <DatePicker
          selected={dataFiltroConvertida}
          onChange={(date) => {
            const ano = date.getFullYear();
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            setMesFiltro(`${ano}-${mes}`);
          }}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          popperPlacement="bottom-end"
          customInput={
            <button className="glass-panel" style={{
              color: colors.textPrimary, padding: '14px 24px', cursor: 'pointer', fontWeight: '600',
              border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem'
            }}>
              {mesFiltro.split('-').reverse().join(' / ')}
            </button>
          }
        />
      </div>
    </header>
  );
};
export default Header;
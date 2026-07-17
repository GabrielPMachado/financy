import React from 'react';

const TotalBalanceCard = ({ saldo, colors }) => {
  return (
    <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'inline-block', minWidth: '300px' }}>
        <p style={{ fontSize: '0.8rem', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '700', letterSpacing: '1px' }}>
          SALDO ATUAL
        </p>
        <h2 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '800', color: colors.textPrimary, textShadow: `0 0 15px rgba(255, 255, 255, 0.2)` }}>
          R$ {Number(saldo).toFixed(2).replace('.', ',')}
        </h2>
      </div>
    </div>
  );
};

export default TotalBalanceCard;
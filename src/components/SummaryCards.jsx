import React from 'react';

const SummaryCards = ({ resumo, colors, activeTab, setActiveTab }) => {
  const cardsData = [ 
    { label: 'RECEITA TOTAL', val: resumo.receita, color: colors.green, shadowColor: 'rgba(52, 211, 153, 0.3)', targetTab: 'Receita' }, 
    { label: 'INVESTIMENTOS', val: resumo.investimentos, color: colors.accent, shadowColor: 'rgba(129, 140, 248, 0.3)', targetTab: 'Investimento' }, 
    { label: 'DESPESAS', val: resumo.despesa, color: colors.red, shadowColor: 'rgba(248, 113, 113, 0.3)', targetTab: 'Despesa fixa' }, 
  ];

  return (
    <div className="summary-cards-container" style={{ width: '85%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
      {cardsData.map((item, i) => {
        const isExpenseTab = activeTab === 'Despesa fixa' || activeTab === 'Despesa variável';
        const isActive = (item.targetTab === activeTab) || (item.label === 'DESPESAS' && isExpenseTab);
        const isClickable = item.targetTab !== null;

        return (
          <div 
            key={i} 
            className={`glass-panel ${isActive ? 'active-card' : ''}`} 
            style={{ 
              padding: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              cursor: isClickable ? 'pointer' : 'default'
            }}
            onClick={() => isClickable && setActiveTab(item.targetTab)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: colors.textSecondary, margin: 0, fontWeight: '700', letterSpacing: '1px' }}>{item.label}</p>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: item.color, textShadow: `0 0 15px ${item.shadowColor}` }}>
              R$ {Number(item.val).toFixed(2).replace('.', ',')}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Transactions = ({ colors, activeTab, setActiveTab, setModalAberto, transacoesFiltradas }) => {
  return (
    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
      {/* Cabeçalho da Lista com Abas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '1.5rem 2rem', borderBottom: `1px solid ${colors.border}`, flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Receita', 'Investimento', 'Despesa fixa', 'Despesa variável', 'Investimento'].map(tab => (
            <div 
              key={tab} 
              className={`tab-item ${activeTab === tab ? 'active' : ''}`} 
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => setModalAberto(true)}>
          + Nova Transação
        </button>
      </div>
      
      {/* Tabela de Transações */}
      <div style={{ overflowX: 'auto', padding: '0 2rem 2rem 2rem', minHeight: '300px' }}>
        {transacoesFiltradas.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: colors.textSecondary }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem', opacity: 0.3 }}>🛰️</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: colors.textPrimary, fontWeight: '600' }}>O espaço está vazio</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Nenhum registro encontrado nesta categoria neste mês.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
            <thead>
               <tr style={{ color: colors.textSecondary, textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                 {/* Ajuste de título dinâmico para evitar "Vencimento" em Receitas/Investimentos */}
                 <th style={{ padding: '0 0 16px 0', fontWeight: '600' }}>
                   {activeTab === 'Receita' || activeTab === 'Investimento' ? 'Data' : 'Vencimento'}
                 </th>
                 <th style={{ padding: '0 0 16px 0', fontWeight: '600' }}>Descrição</th>
                 <th style={{ padding: '0 0 16px 0', fontWeight: '600' }}>{activeTab === 'Investimento' ? 'Ativo' : 'Fonte / Categoria'}</th>
                 <th style={{ padding: '0 0 16px 0', textAlign: 'right', fontWeight: '600' }}>Valor</th>
                 <th style={{ padding: '0 0 16px 0', textAlign: 'right', fontWeight: '600' }}>Ação</th>
               </tr>
            </thead>
            <tbody>
              {transacoesFiltradas.map(t => (
                <tr key={t.id} className="table-row">
                  <td style={{ padding: '1.2rem 0', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', color: colors.textSecondary }}>
                    {t.date.split('-').reverse().join('/')}
                  </td>
                  <td style={{ fontWeight: '500' }}>{t.description}</td>
                  <td>
                    <span style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#E2E8F0', border: `1px solid ${colors.border}` }}>
                      {t.subCategory}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', color: t.type === 'income' ? colors.green : colors.red, fontWeight: '700' }}>
                    {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2).replace('.', ',')}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => deleteDoc(doc(db, 'transactions', t.id))} 
                      style={{ background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s', opacity: 0.6 }} 
                      onMouseOver={e => { e.target.style.opacity = 1; e.target.style.color = colors.red; }} 
                      onMouseOut={e => { e.target.style.opacity = 0.6; e.target.style.color = colors.textSecondary; }} 
                      title="Excluir"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transactions;
import React from 'react';
import DatePicker from 'react-datepicker';

const TransactionModal = ({ modalAberto, setModalAberto, handleSave, activeTab, form, setForm, colors, categorias, isEditing }) => {
  if (!modalAberto) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px', width: '100%', maxWidth: '420px', animation: 'slideUp 0.3s ease-out', borderTop: `1px solid ${colors.accent}` }}>
        
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.6rem', fontWeight: '800' }}>{isEditing ? 'Editar' : 'Nova'} {activeTab}</h2>
        <p style={{ color: colors.textSecondary, fontSize: '0.9rem', marginBottom: '28px' }}>
          {activeTab === 'Receita' ? 'Registre uma entrada de recursos.' : activeTab === 'Investimento' ? 'Registre um aporte de investimento.' : 'Registre uma saída ou vencimento.'}
        </p>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: colors.textSecondary, letterSpacing: '1px' }}>VALOR</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '15px', color: colors.textSecondary, fontWeight: '600' }}>R$</span>
              <input type="number" step="0.01" required placeholder="0.00" value={form.valor} onChange={(e) => setForm({...form, valor: e.target.value})} className="input-premium" style={{ paddingLeft: '50px', fontSize: '1.2rem', fontWeight: '700', color: colors.accent }} />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: colors.textSecondary, letterSpacing: '1px' }}>DESCRIÇÃO</label>
            <input placeholder="Ex: Salário, Internet..." value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} className="input-premium" />
          </div>

          <div>
            {/* Lógica atualizada para a categoria/ativo */}
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: colors.textSecondary, letterSpacing: '1px' }} htmlFor="category-select">
              {activeTab === 'Receita' ? 'FONTE' : activeTab === 'Investimento' ? 'ATIVO' : 'CATEGORIA'}
            </label>
            <select
              id="category-select"
              required
              value={form.categoria} 
              onChange={(e) => setForm({...form, categoria: e.target.value})} 
              className="input-premium"
            >
              <option value="" disabled>Selecione uma opção</option>
              {categorias[activeTab]?.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: colors.textSecondary, letterSpacing: '1px' }}>DATA</label>
            <DatePicker
              required
              selected={form.data ? new Date(form.data + 'T12:00:00') : null}
              onChange={(date) => {
                if(date){
                  const y = date.getFullYear();
                  const m = String(date.getMonth() + 1).padStart(2, '0');
                  const d = String(date.getDate()).padStart(2, '0');
                  setForm({...form, data: `${y}-${m}-${d}`});
                }
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/AAAA"
              customInput={<input className="input-premium" />}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <button 
              type="button" 
              onClick={() => setModalAberto(false)} 
              style={{ 
                flex: 1, 
                padding: '14px', 
                borderRadius: '10px', 
                border: `1px solid rgba(255,255,255,0.1)`, 
                background: 'rgba(255,255,255,0.05)', 
                color: colors.textPrimary, 
                cursor: 'pointer', 
                fontWeight: '600', 
                transition: '0.2s' 
              }} 
              onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.1)'} 
              onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              {isEditing ? 'Salvar Alterações' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
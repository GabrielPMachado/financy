import React, { useState } from 'react';

const CategoryModal = ({ isOpen, onClose, onSave, colors }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('Despesa variável');
  const [selectedColor, setSelectedColor] = useState('#F43F5E');

  const colorPalette = [
    // Vermelhos / Rosas
    '#F43F5E', '#E11D48', '#BE185D', '#EC4899', '#DB2777',
    // Laranjas / Amarelos
    '#F97316', '#EA580C', '#D97706', '#F59E0B', '#EAB308',
    // Verdes
    '#84CC16', '#22C55E', '#10B981', '#14B8A6', '#06B6D4',
    // Azuis / Roxo
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  ];

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (categoryName && categoryType && selectedColor) {
      onSave({
        name: categoryName,
        type: categoryType,
        color: selectedColor,
      });
      setCategoryName('');
      onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px', width: '100%', maxWidth: '420px', animation: 'slideUp 0.3s ease-out' }}>
        <h2 style={{ margin: '0 0 28px 0', fontSize: '1.6rem', fontWeight: '800' }}>Criar Nova Categoria</h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: colors.textSecondary, letterSpacing: '1px' }}>NOME DA CATEGORIA</label>
            <input required placeholder="Ex: Academia" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="input-premium" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: colors.textSecondary, letterSpacing: '1px' }}>TIPO PRINCIPAL</label>
            <select required value={categoryType} onChange={(e) => setCategoryType(e.target.value)} className="input-premium">
              <option value="Receita">Receita</option>
              <option value="Investimento">Investimento</option>
              <option value="Despesa fixa">Despesa fixa</option>
              <option value="Despesa variável">Despesa variável</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: colors.textSecondary, letterSpacing: '1px' }}>COR</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {colorPalette.map(color => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    border: selectedColor === color ? '3px solid #FFFFFF' : '3px solid transparent',
                    transition: 'border 0.2s ease',
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: `1px solid rgba(255,255,255,0.1)`, background: 'rgba(255,255,255,0.05)', color: colors.textPrimary, cursor: 'pointer', fontWeight: '600' }}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Salvar Categoria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
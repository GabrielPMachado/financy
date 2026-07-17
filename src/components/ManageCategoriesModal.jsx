import React from 'react';

const ManageCategoriesModal = ({ isOpen, onClose, colors, categorias, initialCategorias, onDeleteCategory }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px', width: '100%', maxWidth: '480px', animation: 'slideUp 0.3s ease-out' }}>
        <h2 style={{ margin: '0 0 28px 0', fontSize: '1.6rem', fontWeight: '800' }}>Gerenciar Categorias</h2>

        <div style={{ maxHeight: '350px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingRight: '20px' }}>
          <style>{`.glass-panel ::-webkit-scrollbar { display: none; }`}</style>
          {Object.entries(categorias).map(([type, cats]) => (
            <div key={type} style={{ marginBottom: '8px' }}>
              <h3 style={{ color: colors.accent, paddingBottom: '8px', marginBottom: '4px' }}>{type}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {cats.map(cat => {
                  const isDefault = initialCategorias[type]?.includes(cat);
                  return (
                    <li key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                      <span style={{ color: colors.textPrimary }}>{cat}</span>
                      <button
                        onClick={() => onDeleteCategory(cat, type)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: colors.textSecondary,
                          cursor: 'pointer', 
                          fontSize: '1.1rem', 
                          transition: 'all 0.2s', 
                          opacity: 0.6,
                          padding: '5px' // Adiciona área de clique
                        }}
                        onMouseOver={e => { e.target.style.opacity = 1; e.target.style.color = colors.red; }}
                        onMouseOut={e => { e.target.style.opacity = 0.6; e.target.style.color = colors.textSecondary; }}
                        title="Excluir Categoria"
                      >
                        ✕
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageCategoriesModal;
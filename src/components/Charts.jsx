import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Charts = ({ receitaData, investimentoData, despesaData, getCategoryStyle, onSliceClick }) => {

  const chartData = [
    { title: 'Distribuição de Receitas', data: receitaData },
    { title: 'Distribuição de Investimentos', data: investimentoData },
    { title: 'Distribuição de Despesas', data: despesaData },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '10px 15px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ margin: 0, fontWeight: '600' }}>{`${payload[0].name}`}</p>
          <p style={{ margin: '4px 0 0 0', color: payload[0].fill }}>
            {`Valor: R$ ${payload[0].value.toFixed(2).replace('.', ',')}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '85%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
      {chartData.map((chart, index) => (
        chart.data.length > 0 && (
          <div key={index} className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', fontWeight: '600', color: '#E2E8F0' }}>
              {chart.title}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <Pie
                  data={chart.data}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  onClick={(data) => onSliceClick(data, chart.title)}
                >
                  {chart.data.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={getCategoryStyle(entry.name).color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                <Legend 
                  formatter={(value) => (
                    <span style={{ color: '#94A3B8' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )
      ))}
    </div>
  );
};

export default Charts;
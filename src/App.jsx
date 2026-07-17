import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

import Header from './components/Header'; 
import TotalBalanceCard from './components/TotalBalanceCard';
import Transactions from './components/Transactions';
import SummaryCards from './components/SummaryCards';
import Charts from './components/Charts';
import CategoryModal from './components/CategoryModal';
import ManageCategoriesModal from './components/ManageCategoriesModal';
import TransactionModal from './components/TransactionModal';

const initialCategorias = {
  'Receita': ['Salário', 'Freelance', 'Vendas', 'Aluguel', 'Outros'],
  'Investimento': ['Ações BR', 'Ações EUA', 'Fundos Imobiliários', 'Renda Fixa', 'Criptomoedas', 'Outro'],
  'Despesa fixa': ['Aluguel', 'Condomínio', 'Internet', 'Plano de Saúde', 'Educação', 'Outra'],
  'Despesa variável': ['Supermercado', 'Transporte', 'Lazer', 'Restaurantes', 'Saúde', 'Compras', 'Outra'],
};

const App = () => {
  const [activeTab, setActiveTab] = useState('Receita');
  const [modalAberto, setModalAberto] = useState(false);
  const [categoryModalAberto, setCategoryModalAberto] = useState(false);
  const [manageCategoriesModalAberto, setManageCategoriesModalAberto] = useState(false);
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState(initialCategorias);
  const transactionsRef = useRef(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [mesFiltro, setMesFiltro] = useState(new Date().toISOString().slice(0, 7)); 
  const [form, setForm] = useState({ descricao: '', valor: '', data: '', categoria: '', novaCategoria: '' });
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  
  const colors = {
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8', 
    accent: '#818CF8', 
    accentHover: '#6366F1',
    green: '#34D399', 
    greenBg: 'rgba(52, 211, 153, 0.1)',
    red: '#F87171', 
    redBg: 'rgba(248, 113, 113, 0.1)',
    border: 'rgba(255, 255, 255, 0.1)', 
  };

  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        description: doc.data().description || 'Sem descrição',
        amount: Number(doc.data().amount) || 0,
        date: doc.data().date || new Date().toISOString().split('T')[0],
        type: doc.data().type || 'expense', 
        category: doc.data().category || 'Geral',
        subCategory: doc.data().subCategory || 'Outros'
      }));
      setTransacoes(lista);
    });
  }, []);

  // Reseta o filtro de categoria ao mudar de aba
  useEffect(() => {
    setCategoriaFiltro('Todos');
  }, [activeTab]);

  // Filtra transações apenas pela aba ativa, para popular o dropdown de categorias
  const transacoesDaAba = transacoes.filter(t => {
    const matchesMonth = t.date.startsWith(mesFiltro);
    let matchesTab;
    if (activeTab === 'Receita') matchesTab = t.type === 'income';
    else matchesTab = t.category === activeTab;
    return matchesMonth && matchesTab;
  });

  // Lógica de filtragem atualizada para incluir investimentos
  const transacoesFiltradas = transacoes.filter(t => {
    const matchesMonth = t.date.startsWith(mesFiltro);
    const matchesCategoryFilter = categoriaFiltro === 'Todos' || t.subCategory === categoriaFiltro;

    let matchesTab;
    if (activeTab === 'Receita') matchesTab = t.type === 'income';
    else matchesTab = t.category === activeTab;

    return matchesMonth && matchesTab && matchesCategoryFilter;
  });

  // Lógica corrigida de cálculo do resumo
  const resumo = transacoes.filter(t => t.date.startsWith(mesFiltro)).reduce((acc, t) => {
    if (t.type === 'income') {
      acc.receita += t.amount;
    } else if (t.category === 'Investimento') { // Identifica investimentos pela categoria
      acc.investimentos += t.amount;
    } else {
      acc.despesa += t.amount;
    }
    return acc;
  }, { receita: 0, despesa: 0, investimentos: 0 });
  
  const handleOpenNewTransactionModal = () => {
    setEditingTransaction(null);
    setForm({ descricao: '', valor: '', data: '', categoria: '', novaCategoria: '' });
    setModalAberto(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setForm({
      descricao: transaction.description,
      valor: transaction.amount,
      data: transaction.date,
      categoria: transaction.subCategory,
      novaCategoria: ''
    });
    setActiveTab(transaction.category);
    setModalAberto(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const transactionData = {
      description: form.descricao || 'Sem descrição',
      amount: parseFloat(form.valor) || 0,
      date: form.data,
      type: activeTab === 'Receita' ? 'income' : 'expense', 
      category: activeTab,
      subCategory: form.categoria
    };

    if (editingTransaction) {
      await updateDoc(doc(db, 'transactions', editingTransaction.id), transactionData);
    } else {
      await addDoc(collection(db, 'transactions'), transactionData);
    }

    setModalAberto(false);
    setForm({ descricao: '', valor: '', data: '', categoria: '', novaCategoria: '' });
    setEditingTransaction(null);
  };

  const dataFiltroConvertida = mesFiltro ? new Date(`${mesFiltro}-01T12:00:00`) : new Date();

  // Função para processar dados para os gráficos
  const getChartData = (type) => {
    const monthlyTransactions = transacoes.filter(t => t.date.startsWith(mesFiltro));
    let targetTransactions;

    if (type === 'Receita') {
      targetTransactions = monthlyTransactions.filter(t => t.type === 'income');
    } else if (type === 'Despesa') {
      targetTransactions = monthlyTransactions.filter(t => t.type === 'expense' && t.category !== 'Investimento');
    } else { // Investimento
      targetTransactions = monthlyTransactions.filter(t => t.category === 'Investimento');
    }

    const groupedData = targetTransactions.reduce((acc, transaction) => {
      const { subCategory, amount } = transaction;
      if (!acc[subCategory]) {
        acc[subCategory] = 0;
      }
      acc[subCategory] += amount;
      return acc;
    }, {});

    return Object.entries(groupedData).map(([name, value]) => ({ name, value }));
  };

  const receitaChartData = getChartData('Receita');
  const investimentoChartData = getChartData('Investimento');
  const despesaChartData = getChartData('Despesa');

  const [colorMap, setColorMap] = useState({
    'Salário': { background: 'rgba(74, 222, 128, 0.15)', color: '#4ADE80', border: 'rgba(74, 222, 128, 0.2)' },
    'Freelance': { background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', border: 'rgba(52, 211, 153, 0.2)' },
    'Vendas': { background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: 'rgba(16, 185, 129, 0.2)' },
    'Ações BR': { background: 'rgba(96, 165, 250, 0.15)', color: '#60A5FA', border: 'rgba(96, 165, 250, 0.2)' },
    'Ações EUA': { background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.2)' },
    'Fundos Imobiliários': { background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', border: 'rgba(139, 92, 246, 0.2)' },
    'Renda Fixa': { background: 'rgba(124, 58, 237, 0.15)', color: '#7C3AED', border: 'rgba(124, 58, 237, 0.2)' },
    'Criptomoedas': { background: 'rgba(249, 115, 22, 0.15)', color: '#F97316', border: 'rgba(249, 115, 22, 0.2)' },
    'Aluguel': { background: 'rgba(252, 211, 77, 0.15)', color: '#FBBF24', border: 'rgba(252, 211, 77, 0.2)' },
    'Condomínio': { background: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24', border: 'rgba(251, 191, 36, 0.2)' },
    'Internet': { background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.2)' },
    'Plano de Saúde': { background: 'rgba(234, 179, 8, 0.15)', color: '#EAB308', border: 'rgba(234, 179, 8, 0.2)' },
    'Educação': { background: 'rgba(217, 119, 6, 0.15)', color: '#D97706', border: 'rgba(217, 119, 6, 0.2)' },
    'Supermercado': { background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.2)' },
    'Transporte': { background: 'rgba(236, 72, 153, 0.15)', color: '#EC4899', border: 'rgba(236, 72, 153, 0.2)' },
    'Lazer': { background: 'rgba(219, 39, 119, 0.15)', color: '#DB2777', border: 'rgba(219, 39, 119, 0.2)' },
    'Restaurantes': { background: 'rgba(225, 29, 72, 0.15)', color: '#E11D48', border: 'rgba(225, 29, 72, 0.2)' },
    'Saúde': { background: 'rgba(244, 63, 94, 0.15)', color: '#F43F5E', border: 'rgba(244, 63, 94, 0.2)' },
    'Compras': { background: 'rgba(190, 24, 93, 0.15)', color: '#BE185D', border: 'rgba(190, 24, 93, 0.2)' },
  });

  // A função de estilo de categoria precisa ser acessível para os gráficos
  const getCategoryStyle = (category) => {
    return colorMap[category] || { background: 'rgba(100, 116, 139, 0.15)', color: '#64748B', border: 'rgba(100, 116, 139, 0.2)' };
  };

  const handleSaveCategory = ({ name, type, color }) => {
    // Adiciona a nova categoria à lista de categorias
    setCategorias(prev => ({ ...prev, [type]: [...prev[type], name] }));
    // Adiciona a cor da nova categoria ao mapa de cores
    const newColorStyle = { background: `${color}26`, color: color, border: `${color}33` }; // 15% opacity
    setColorMap(prev => ({ ...prev, [name]: newColorStyle }));
  };

  const handleDeleteCategory = (categoryName, categoryType) => {
    // Impede a exclusão se for a última categoria do tipo
    if (categorias[categoryType].length <= 1) {
      alert('Não é possível excluir a última categoria.');
      return;
    }
    setCategorias(prev => ({
      ...prev,
      [categoryType]: prev[categoryType].filter(cat => cat !== categoryName)
    }));
  };

  const handleChartClick = (data, chartType) => {
    if (chartType === 'Distribuição de Receitas') {
      setActiveTab('Receita');
    } else if (chartType === 'Distribuição de Investimentos') {
      setActiveTab('Investimento');
    } else if (chartType === 'Distribuição de Despesas') {
      // Encontra a aba de despesa correta (fixa ou variável) para a categoria clicada
      const transaction = transacoes.find(t => t.subCategory === data.name && t.date.startsWith(mesFiltro));
      if (transaction) {
        setActiveTab(transaction.category);
      }
    }
    setCategoriaFiltro(data.name);
    if (transactionsRef.current) {
      transactionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="galaxy-bg" style={{ minHeight: '100vh', padding: '2rem', color: colors.textPrimary, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      <div style={{ width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Header 
          colors={colors} 
          dataFiltroConvertida={dataFiltroConvertida} 
          mesFiltro={mesFiltro}
          setMesFiltro={setMesFiltro}
          saldo={resumo.receita - resumo.despesa - resumo.investimentos}
        />
        <Charts 
          receitaData={receitaChartData}
          investimentoData={investimentoChartData}
          despesaData={despesaChartData}
          getCategoryStyle={getCategoryStyle}
          onSliceClick={handleChartClick}
        />
        <SummaryCards 
          resumo={resumo} 
          colors={colors} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <Transactions 
          ref={transactionsRef}
          colors={colors}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleOpenNewTransactionModal={handleOpenNewTransactionModal}
          handleEdit={handleEdit}
          openManageCategories={() => setManageCategoriesModalAberto(true)}
          setCategoryModalAberto={setCategoryModalAberto}
          transacoesFiltradas={transacoesFiltradas}
          transacoesDaAba={transacoesDaAba}
          categoriaFiltro={categoriaFiltro}
          setCategoriaFiltro={setCategoriaFiltro}
          getCategoryStyle={getCategoryStyle}
        />
      </div>

      <TransactionModal 
        modalAberto={modalAberto}
        setModalAberto={setModalAberto}
        handleSave={handleSave}
        activeTab={activeTab}
        form={form}
        setForm={setForm}
        colors={colors}
        categorias={categorias}
        isEditing={!!editingTransaction}
      />

      <CategoryModal
        isOpen={categoryModalAberto}
        onClose={() => setCategoryModalAberto(false)}
        onSave={handleSaveCategory}
        colors={colors}
      />

      <ManageCategoriesModal
        isOpen={manageCategoriesModalAberto}
        onClose={() => setManageCategoriesModalAberto(false)}
        colors={colors}
        categorias={categorias}
        initialCategorias={initialCategorias}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
};

export default App;
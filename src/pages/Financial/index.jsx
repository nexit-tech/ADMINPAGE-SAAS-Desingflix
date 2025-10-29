import { useState, useMemo } from 'react';
import styles from './style.module.css';
import { MOCKED_TRANSACTIONS, MOCKED_CUSTOMERS } from '../../services/mockData';
import { DollarSign, Users, CreditCard } from 'lucide-react';

import SummaryCard from './components/SummaryCard';
import RevenueChart from './components/RevenueChart';
import TransactionsTable from './components/TransactionsTable';

// Função para formatar o valor monetário
const formatCurrency = (amount) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);

export default function Financial() {
  const [transactions] = useState(MOCKED_TRANSACTIONS);
  const [customers] = useState(MOCKED_CUSTOMERS);

  // useMemo para calcular os totais apenas quando os dados mudarem
  const summaryData = useMemo(() => {
    const totalRevenue = transactions.reduce((sum, tr) => sum + tr.amount, 0);
    const activeSubscriptions = customers.filter(c => c.subscription === 'premium').length;
    const averageRevenue = totalRevenue / customers.length;
    
    return { totalRevenue, activeSubscriptions, averageRevenue };
  }, [transactions, customers]);

  // useMemo para processar os dados do gráfico
  const chartData = useMemo(() => {
    const monthlyRevenue = {};
    transactions.forEach(tr => {
      const month = new Date(tr.date).toLocaleString('pt-BR', { month: 'short', timeZone: 'UTC' });
      const year = new Date(tr.date).getFullYear();
      const key = `${month}/${year}`;
      
      if (!monthlyRevenue[key]) {
        monthlyRevenue[key] = 0;
      }
      monthlyRevenue[key] += tr.amount;
    });
    
    // Converte para o formato que o gráfico espera e ordena
    return Object.entries(monthlyRevenue)
      .map(([name, total]) => ({ name, total }))
      .reverse(); // ou ordenar por data se preferir
  }, [transactions]);

  return (
    <div className={styles.container}>
      <h1>Financeiro</h1>
      
      <div className={styles.summaryGrid}>
        <SummaryCard 
          title="Faturamento Total"
          value={formatCurrency(summaryData.totalRevenue)}
          icon={<DollarSign size={24} />}
        />
        <SummaryCard 
          title="Assinaturas Ativas"
          value={summaryData.activeSubscriptions}
          icon={<Users size={24} />}
        />
        <SummaryCard 
          title="Receita Média / Cliente"
          value={formatCurrency(summaryData.averageRevenue)}
          icon={<CreditCard size={24} />}
        />
      </div>

      <div className={styles.mainContentGrid}>
        <RevenueChart data={chartData} />
        <TransactionsTable transactions={transactions.slice(0, 5)} /> 
      </div>
    </div>
  );
}
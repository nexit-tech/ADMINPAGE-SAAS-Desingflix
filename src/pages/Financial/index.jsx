// src/pages/Financial/index.jsx

import { useState, useEffect, useMemo } from 'react';
import styles from './style.module.css';
import { supabase } from '../../supabaseClient';
import { DollarSign, Users, CreditCard, TrendingUp } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import SummaryCard from './components/SummaryCard';
import RevenueChart from './components/RevenueChart';
import TransactionsTable from './components/TransactionsTable';

// Taxa de conversão USD para BRL
const USD_TO_BRL = 5.80;

// Função para formatar o valor monetário (converte USD para BRL)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(amount);
};

export default function Financial() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);

      try {
        // Calcular início e fim do mês selecionado
        const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59);

        // Buscar estatísticas financeiras do mês selecionado
        const { data: statsData, error: statsError } = await supabase
          .rpc('get_financial_stats_by_month', { 
            start_date: startOfMonth.toISOString(),
            end_date: endOfMonth.toISOString()
          });

        if (statsError) {
          console.error('Erro ao buscar estatísticas:', statsError);
        } else if (statsData && statsData.length > 0) {
          // Converter valores de USD para BRL
          setStats({
            total_revenue: parseFloat(statsData[0].total_revenue || 0) * USD_TO_BRL,
            monthly_revenue: parseFloat(statsData[0].monthly_revenue || 0) * USD_TO_BRL,
            transaction_count: statsData[0].transaction_count,
            active_subscriptions: statsData[0].active_subscriptions
          });
        }

        // Buscar transações recentes (últimas 10) do mês selecionado
        const { data: transactionsData, error: transactionsError } = await supabase
          .rpc('get_transactions_by_month', {
            start_date: startOfMonth.toISOString(),
            end_date: endOfMonth.toISOString(),
            limit_count: 10
          });

        if (transactionsError) {
          console.error('Erro ao buscar transações:', transactionsError);
        } else {
          // Converter valores de USD para BRL
          const formattedTransactions = transactionsData.map(t => ({
            id: t.id,
            date: t.date,
            description: t.description,
            amount: parseFloat(t.amount) * USD_TO_BRL, // Converter USD para BRL
            status: t.status,
            customerName: t.customer_name,
            customerEmail: t.customer_email
          }));
          setTransactions(formattedTransactions);
        }

        // Buscar dados do gráfico de receita mensal (últimos 12 meses)
        const { data: chartDataResponse, error: chartError } = await supabase
          .rpc('get_monthly_revenue_real');

        if (chartError) {
          console.error('Erro ao buscar dados do gráfico:', chartError);
        } else {
          // Converter valores de USD para BRL
          const formattedChartData = chartDataResponse.map(item => ({
            name: item.name,
            total: parseFloat(item.total) * USD_TO_BRL
          }));
          setChartData(formattedChartData);
        }

      } catch (err) {
        console.error('Erro geral ao buscar dados financeiros:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [selectedDate]);

  // Calcular receita média por cliente
  const averageRevenue = useMemo(() => {
    if (!stats || !stats.active_subscriptions || stats.active_subscriptions === 0) {
      return 0;
    }
    return stats.total_revenue / stats.active_subscriptions;
  }, [stats]);

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Financeiro</h1>
        <p>Carregando dados financeiros...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Financeiro</h1>
        <div className={styles.datePickerWrapper}>
          <label>Filtrar por mês:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className={styles.datePicker}
          />
        </div>
      </div>
      
      <div className={styles.summaryGrid}>
        <SummaryCard 
          title="Faturamento Total"
          value={stats ? formatCurrency(stats.total_revenue) : 'R$ 0,00'}
          icon={<DollarSign size={24} />}
          variant="blue"
        />
        <SummaryCard 
          title="Faturamento Mensal"
          value={stats ? formatCurrency(stats.monthly_revenue) : 'R$ 0,00'}
          icon={<TrendingUp size={24} />}
          variant="green"
        />
        <SummaryCard 
          title="Assinaturas Ativas"
          value={stats ? stats.active_subscriptions : 0}
          icon={<Users size={24} />}
          variant="purple"
        />
        <SummaryCard 
          title="Receita Média / Cliente"
          value={formatCurrency(averageRevenue)}
          icon={<CreditCard size={24} />}
          variant="yellow"
        />
      </div>

      <div className={styles.mainContentGrid}>
        {chartData.length > 0 ? (
          <RevenueChart data={chartData} />
        ) : (
          <div className={styles.noDataMessage}>
            <p>Nenhum dado de receita disponível ainda.</p>
            <p>As transações aparecerão aqui conforme forem processadas.</p>
          </div>
        )}
        
        {transactions.length > 0 ? (
          <TransactionsTable transactions={transactions} />
        ) : (
          <div className={styles.noDataMessage}>
            <p>Nenhuma transação encontrada para este mês.</p>
          </div>
        )}
      </div>
    </div>
  );
}
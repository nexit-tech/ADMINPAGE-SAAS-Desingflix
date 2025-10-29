// src/pages/Dashboard/index.jsx

import { useState, useEffect } from 'react';
import styles from './style.module.css';
import { supabase } from '../../supabaseClient';
import { Shirt, Users, UserPlus, Star, ShieldOff, DollarSign } from 'lucide-react';
import SummaryCard from '../Financial/components/SummaryCard';
import RevenueChart from '../Financial/components/RevenueChart';

// Taxa de conversão USD para BRL
const USD_TO_BRL = 5.80;

// Função para formatar o valor monetário
const formatCurrency = (amount) => 
  new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(amount);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      // Calcular início e fim do mês atual
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // Buscar dados dos cards, gráfico e receita mensal em paralelo
      const [statsResponse, chartResponse, financialResponse] = await Promise.all([
        supabase.rpc('get_dashboard_stats'),
        supabase.rpc('get_monthly_revenue_real'),
        supabase.rpc('get_financial_stats_by_month', {
          start_date: startOfMonth.toISOString(),
          end_date: endOfMonth.toISOString()
        })
      ]);

      // Processar dados dos cards
      if (statsResponse.error) {
        console.error('Erro ao buscar estatísticas:', statsResponse.error);
      } else {
        setStats(statsResponse.data);
      }
      
      // Processar dados do gráfico (converter USD para BRL)
      if (chartResponse.error) {
        console.error('Erro ao buscar dados do gráfico:', chartResponse.error);
      } else {
        const convertedChartData = chartResponse.data.map(item => ({
          name: item.name,
          total: parseFloat(item.total) * USD_TO_BRL
        }));
        setChartData(convertedChartData);
      }

      // Processar receita mensal (converter USD para BRL)
      if (financialResponse.error) {
        console.error('Erro ao buscar receita mensal:', financialResponse.error);
      } else if (financialResponse.data && financialResponse.data.length > 0) {
        const revenueUSD = financialResponse.data[0].monthly_revenue || 0;
        setMonthlyRevenue(revenueUSD * USD_TO_BRL);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1>Dashboard</h1>
        <p>Visão geral e estatísticas da plataforma.</p>
      </div>

      {loading ? (
        <p>Carregando estatísticas...</p>
      ) : stats ? (
        <>
          <div className={styles.summaryGrid}>
            <SummaryCard 
              title="Faturamento do Mês"
              value={formatCurrency(monthlyRevenue)}
              icon={<DollarSign size={24} />}
              variant="blue"
            />
            <SummaryCard 
              title="Total de Estampas"
              value={stats.total_products}
              icon={<Shirt size={24} />}
              variant="purple"
            />
            <SummaryCard 
              title="Total de Clientes"
              value={stats.total_clients}
              icon={<Users size={24} />}
              variant="green"
            />
            <SummaryCard 
              title="Novos Clientes (Semana)"
              value={stats.new_clients_week}
              icon={<UserPlus size={24} />}
              variant="yellow"
            />
            <SummaryCard 
              title="Clientes Ativos (Premium)"
              value={stats.active_clients}
              icon={<Star size={24} />}
              variant="blue"
            />
            <SummaryCard 
              title="Clientes (Plano Básico)"
              value={stats.basic_clients}
              icon={<ShieldOff size={24} />}
              variant="gray"
            />
          </div>

          <div className={styles.chartContainer}>
            <h2 className={styles.chartTitle}>Receita por Mês</h2>
            <RevenueChart data={chartData} />
          </div>
        </>
      ) : (
        <p>Não foi possível carregar as estatísticas.</p>
      )}
    </div>
  );
}
// src/pages/Dashboard/index.jsx

import { useState, useEffect } from 'react';
import styles from './style.module.css';
import { supabase } from '../../supabaseClient';
import { Shirt, Users, UserPlus, Star, ShieldOff } from 'lucide-react';
import SummaryCard from '../Financial/components/SummaryCard';
import RevenueChart from '../Financial/components/RevenueChart'; // 1. Importar o gráfico

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]); // 2. Estado para os dados do gráfico
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      // 3. Buscar dados dos cards e do gráfico em paralelo
      const [statsResponse, chartResponse] = await Promise.all([
        supabase.rpc('get_dashboard_stats'),
        supabase.rpc('get_monthly_revenue')
      ]);

      // Processa os dados dos cards
      if (statsResponse.error) {
        console.error('Erro ao buscar estatísticas:', statsResponse.error);
      } else {
        setStats(statsResponse.data);
      }
      
      // Processa os dados do gráfico
      if (chartResponse.error) {
        console.error('Erro ao buscar dados do gráfico:', chartResponse.error);
      } else {
        setChartData(chartResponse.data);
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
              title="Total de Estampas"
              value={stats.total_products}
              icon={<Shirt size={24} />}
              variant="blue"
            />
            <SummaryCard 
              title="Total de Clientes"
              value={stats.total_clients}
              icon={<Users size={24} />}
              variant="purple"
            />
            <SummaryCard 
              title="Novos Clientes (Semana)"
              value={stats.new_clients_week}
              icon={<UserPlus size={24} />}
              variant="green"
            />
            <SummaryCard 
              title="Clientes Ativos (Premium)"
              value={stats.active_clients}
              icon={<Star size={24} />}
              variant="yellow"
            />
            <SummaryCard 
              title="Clientes (Plano Básico)"
              value={stats.basic_clients}
              icon={<ShieldOff size={24} />}
              variant="gray"
            />
          </div>

          {/* 4. Adicionar o gráfico na tela */}
          <div className={styles.chartContainer}>
            <RevenueChart data={chartData} />
          </div>
        </>
      ) : (
        <p>Não foi possível carregar as estatísticas.</p>
      )}
    </div>
  );
}
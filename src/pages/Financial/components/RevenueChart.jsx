import styles from './RevenueChart.module.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Função para formatar o valor no eixo Y (ex: 10000 -> R$ 10k)
const formatYAxis = (tick) => {
  return `R$ ${(tick / 1000).toLocaleString('pt-BR')}k`;
}

export default function RevenueChart({ data }) {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Receita por Mês</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickFormatter={formatYAxis} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{fill: 'rgba(239, 246, 255, 0.6)'}}
            formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
          />
          <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
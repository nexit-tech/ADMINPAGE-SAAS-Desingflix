// src/pages/Financial/components/SummaryCard.jsx

import styles from './SummaryCard.module.css';

// O componente agora aceita a prop 'variant' para mudar a cor
export default function SummaryCard({ title, value, icon, variant = 'blue' }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <p className={styles.title}>{title}</p>
        <h3 className={styles.value}>{value}</h3>
      </div>
      {/* Aplicamos a classe da variante de cor dinamicamente */}
      <div className={`${styles.iconWrapper} ${styles[variant]}`}>
        {icon}
      </div>
    </div>
  );
}
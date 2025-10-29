import styles from './TransactionsTable.module.css';

// Função para formatar a data
const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('pt-BR', { 
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  }).format(new Date(dateString));
};

// Função para formatar o valor monetário
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(amount);
};

// Badge de status
const StatusBadge = ({ status }) => {
  const statusStyles = {
    completed: { bg: '#dcfce7', color: '#166534', text: 'Completo' },
    pending: { bg: '#fef3c7', color: '#92400e', text: 'Pendente' },
    failed: { bg: '#fee2e2', color: '#991b1b', text: 'Falhou' },
    refunded: { bg: '#e0e7ff', color: '#3730a3', text: 'Reembolsado' }
  };

  const style = statusStyles[status] || statusStyles.completed;

  return (
    <span style={{
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      backgroundColor: style.bg,
      color: style.color
    }}>
      {style.text}
    </span>
  );
};

export default function TransactionsTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <h3 className={styles.tableTitle}>Transações Recentes</h3>
        <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
          Nenhuma transação encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.tableTitle}>Transações Recentes</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Cliente</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.customerName || transaction.customerEmail || 'N/A'}</td>
              <td>{transaction.description}</td>
              <td className={styles.amount}>{formatCurrency(transaction.amount)}</td>
              <td><StatusBadge status={transaction.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
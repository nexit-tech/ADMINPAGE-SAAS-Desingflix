import styles from './TransactionsTable.module.css';

// Função para formatar a data
const formatDate = (dateString) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(dateString));

// Função para formatar o valor monetário
const formatCurrency = (amount) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);

export default function TransactionsTable({ transactions }) {
  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.tableTitle}>Transações Recentes</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.description}</td>
              <td className={styles.amount}>{formatCurrency(transaction.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
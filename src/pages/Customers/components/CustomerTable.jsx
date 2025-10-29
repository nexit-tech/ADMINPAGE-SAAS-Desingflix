import styles from './CustomerTable.module.css';

// Componente para o "badge" de status da assinatura
const SubscriptionBadge = ({ status }) => {
  const statusClass = status === 'premium' ? styles.premium : styles.basic;
  const statusText = status === 'premium' ? 'Premium' : 'Básica';

  return (
    <span className={`${styles.badge} ${statusClass}`}>
      {statusText}
    </span>
  );
};

// Pequena função para formatar a data para o padrão BR
const formatDate = (dateString) => {
  if (!dateString) return '—'; // Retorna um traço se a data for nula
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
};

export default function CustomerTable({ customers }) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Assinatura</th>
            <th>Data de Ingresso</th>
            <th>Expira em</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>
                <SubscriptionBadge status={customer.subscription} />
              </td>
              {/* Novas colunas aqui */}
              <td>{formatDate(customer.joinDate)}</td>
              <td>{formatDate(customer.expirationDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
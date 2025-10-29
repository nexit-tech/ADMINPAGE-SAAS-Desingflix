import styles from './GroupCard.module.css';
import { Pencil, Trash2 } from 'lucide-react';

export default function GroupCard({ group, onEdit, onDelete }) {
  return (
    <div className={styles.card}>
      <div>
        <h3 className={styles.cardTitle}>{group.name}</h3>
        <p className={styles.cardInfo}>{group.productCount} produtos</p>
      </div>
      <div className={styles.cardActions}>
        <button onClick={() => onEdit(group)} className={`${styles.iconButton} ${styles.editButton}`}>
          <Pencil size={18} />
        </button>
        {/* A única mudança é aqui: passar o 'group' inteiro */}
        <button onClick={() => onDelete(group)} className={`${styles.iconButton} ${styles.deleteButton}`}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
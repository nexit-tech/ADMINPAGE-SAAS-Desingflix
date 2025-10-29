import styles from './ConfirmDeleteModal.module.css';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>{title || 'Confirmar Exclusão'}</h2>
        <p className={styles.message}>
          {message || 'Você tem certeza que deseja realizar esta ação? Ela não poderá ser desfeita.'}
        </p>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.buttonSecondary}>
            Cancelar
          </button>
          <button onClick={onConfirm} className={styles.buttonDanger}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
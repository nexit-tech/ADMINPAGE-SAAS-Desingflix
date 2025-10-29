import { useState, useEffect } from 'react';
import styles from './GroupModal.module.css'; // <-- MUDANÇA AQUI

export default function GroupModal({ isOpen, onClose, onSave, group }) {
  // ...o resto do código do componente continua exatamente o mesmo
  const [name, setName] = useState('');

  useEffect(() => {
    if (group) {
      setName(group.name);
    } else {
      setName('');
    }
  }, [group, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ ...group, name });
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{group ? 'Editar Grupo' : 'Criar Novo Grupo'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="group-name">Nome do Grupo</label>
            <input
              id="group-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Eletrônicos"
              autoFocus
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.buttonSecondary}>
              Cancelar
            </button>
            <button type="submit" className={styles.buttonPrimary}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
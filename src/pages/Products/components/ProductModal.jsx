import { useState, useEffect } from 'react';
import styles from './ProductModal.module.css';
import GroupSelector from './GroupSelector';

export default function ProductModal({ isOpen, onClose, onSave, product, groups }) {
  // Removido 'name' do estado inicial
  const [formState, setFormState] = useState({
    imageUrl: '',
    groupId: null,
  });

  useEffect(() => {
    if (product) {
      setFormState({
        imageUrl: product.image_url || '', // Pega o image_url do produto
        groupId: product.group_id,
      });
    } else {
      // Limpa o estado, sem o 'name'
      setFormState({ imageUrl: '', groupId: null });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGroupSelect = (groupId) => {
    setFormState(prev => ({ ...prev, groupId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...product, ...formState });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{product ? 'Editar Produto' : 'Criar Novo Produto'}</h2>
        <form onSubmit={handleSubmit}>
          
          {/* O CAMPO DE NOME FOI COMPLETAMENTE REMOVIDO DAQUI */}

          <div className={styles.formGroup}>
            <label>URL da Imagem</label>
            {/* O nome do input foi ajustado para 'imageUrl' para bater com o estado */}
            <input name="imageUrl" value={formState.imageUrl} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Grupo</label>
            <GroupSelector 
              groups={groups}
              selectedGroupId={formState.groupId}
              onSelect={handleGroupSelect}
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.buttonSecondary}>Cancelar</button>
            <button type="submit" className={styles.buttonPrimary}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
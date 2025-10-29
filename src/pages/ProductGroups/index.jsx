import { useState, useEffect } from 'react';
import styles from './style.module.css';
import { supabase } from '../../supabaseClient';

import GroupCard from './components/GroupCard';
import GroupModal from './components/GroupModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

export default function ProductGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const fetchGroups = async () => {
    setLoading(true);
    
    // =========================================================
    // === MUDANÇA PRINCIPAL AQUI ===
    // Agora chamamos nossa função customizada 'get_groups_with_product_count'
    // =========================================================
    const { data, error } = await supabase.rpc('get_groups_with_product_count');

    if (error) {
      console.error('Erro ao buscar grupos:', error);
    } else {
      // A formatação agora é mais simples, pois os dados já vêm corretos
      const formattedGroups = data.map(group => ({
        id: group.id,
        name: group.name,
        productCount: group.product_count // O nome da coluna já é 'product_count'
      }));
      setGroups(formattedGroups);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleOpenModal = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = async (groupData) => {
    if (groupData.id) {
      const { error } = await supabase
        .from('product_groups')
        .update({ name: groupData.name })
        .eq('id', groupData.id);
      
      if (error) console.error('Erro ao atualizar grupo:', error);
      else fetchGroups(); // Re-busca os dados para atualizar a contagem

    } else {
      const { error } = await supabase
        .from('product_groups')
        .insert({ name: groupData.name });

      if (error) console.error('Erro ao criar grupo:', error);
      else fetchGroups(); // Re-busca os dados para atualizar a contagem
    }
    handleCloseModal();
  };
  
  const handleOpenDeleteModal = (group) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setGroupToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (groupToDelete) {
      const { error } = await supabase
        .from('product_groups')
        .delete()
        .eq('id', groupToDelete.id);

      if (error) console.error('Erro ao deletar grupo:', error);
      else {
        setGroups(groups.filter(g => g.id !== groupToDelete.id));
      }
      handleCloseDeleteModal();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1>Grupos de Produtos</h1>
        <button onClick={handleOpenModal} className={styles.buttonPrimary}>
          Criar Novo Grupo
        </button>
      </div>

      {loading ? <p>Carregando grupos...</p> : (
        <div className={styles.cardGrid}>
          {groups.map(group => (
            <GroupCard 
              key={group.id} 
              group={group}
              onEdit={handleEdit}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}
      
      <GroupModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        group={editingGroup}
      />

      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Excluir Grupo"
        message={`Tem certeza que deseja excluir o grupo "${groupToDelete?.name}"?`}
      />
    </div>
  );
}
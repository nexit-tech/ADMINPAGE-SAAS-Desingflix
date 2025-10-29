import { useState, useEffect, useMemo } from 'react';
import styles from './style.module.css';
import { supabase } from '../../supabaseClient';

import ConfirmDeleteModal from '../ProductGroups/components/ConfirmDeleteModal';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import BulkUploadModal from './components/BulkUploadModal';
import GroupSelector from './components/GroupSelector';
import UploadProgressModal from './components/UploadProgressModal';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { descending: true });
      
      const { data: groupsData, error: groupsError } = await supabase
        .from('product_groups')
        .select('*');

      if (productsError) console.error('Error fetching products:', productsError);
      else setProducts(productsData);

      if (groupsError) console.error('Error fetching groups:', groupsError);
      else setGroups(groupsData);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedGroupFilter === 'all') {
      return products;
    }
    return products.filter(p => p.group_id === selectedGroupFilter);
  }, [products, selectedGroupFilter]);

  const filterOptions = useMemo(() => [
    { id: 'all', name: 'Todos os Grupos' },
    ...groups,
  ], [groups]);

  const isAllSelected = useMemo(() => 
    filteredProducts.length > 0 && selectedProducts.size === filteredProducts.length,
    [selectedProducts, filteredProducts]
  );
  
  const handleProductSelect = (productId) => {
    setSelectedProducts(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };
  
  const handleBulkDelete = async () => {
    const idsToDelete = Array.from(selectedProducts);
    const { error } = await supabase.from('products').delete().in('id', idsToDelete);
    
    if (error) {
      console.error('Erro ao deletar produtos em massa:', error);
      alert('Erro ao deletar produtos.');
    } else {
      setProducts(prev => prev.filter(p => !idsToDelete.includes(p.id)));
      setSelectedProducts(new Set());
    }
    handleCloseDeleteModal();
  };

  const getGroupName = (groupId) => groups.find(g => g.id === groupId)?.name || 'Sem Grupo';
  
  const handleOpenModal = () => { setEditingProduct(null); setIsModalOpen(true); };
  const handleEdit = (product) => { setEditingProduct(product); setIsModalOpen(true); };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenDeleteModal = (product) => {
    if (product) {
      setProductToDelete(product);
    }
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      const deleteSingle = async () => {
        const { error } = await supabase.from('products').delete().eq('id', productToDelete.id);
        if (error) console.error('Error deleting product:', error);
        else setProducts(products.filter(p => p.id !== productToDelete.id));
        handleCloseDeleteModal();
      };
      deleteSingle();
    } else {
      handleBulkDelete();
    }
  };

  const handleSave = async (productData) => {
    const selectedGroup = groups.find(g => g.id === productData.groupId);
    const categoryName = selectedGroup ? selectedGroup.name : null;
    const dataToSave = {
      image_url: productData.imageUrl,
      group_id: productData.groupId,
      category: categoryName,
    };
    if (productData.id) {
      const { data, error } = await supabase.from('products').update(dataToSave).eq('id', productData.id).select().single();
      if (error) console.error('Error updating product:', error);
      else setProducts(products.map(p => p.id === data.id ? data : p));
    } else {
      const { data, error } = await supabase.from('products').insert(dataToSave).select().single();
      if (error) console.error('Error creating product:', error);
      else setProducts([data, ...products]);
    }
    handleCloseModal();
  };
  
  const handleBulkUpload = async (uploadData) => {
    setIsBulkUploadModalOpen(false);
    setIsUploading(true);

    const { newProducts, groupId } = uploadData;
    if (!newProducts || newProducts.length === 0 || !groupId) {
      setIsUploading(false);
      return;
    }

    setUploadProgress({ current: 0, total: newProducts.length });

    try {
      const categoryName = getGroupName(groupId);
      const uploadPromises = newProducts.map(product => {
        const file = product.file;
        const fileName = `${Date.now()}-${product.originalFilename.replace(/\s+/g, '-')}`;
        return supabase.storage.from('products').upload(fileName, file)
          .then(result => {
            setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }));
            return result;
          });
      });

      const uploadResults = await Promise.all(uploadPromises);

      const productsForDatabase = uploadResults.map((result) => {
        if (result.error) throw result.error;
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(result.data.path);
        return {
          image_url: publicUrl,
          group_id: groupId,
          category: categoryName,
        };
      });

      const { data: insertedProducts, error: insertError } = await supabase
        .from('products')
        .insert(productsForDatabase)
        .select();

      if (insertError) throw insertError;

      setProducts(prevProducts => [...insertedProducts, ...prevProducts]);
      
      setTimeout(() => setIsUploading(false), 1000);

    } catch (error) {
      console.error('Erro no upload em massa:', error);
      alert('Ocorreu um erro durante o upload. Verifique o console.');
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <UploadProgressModal 
        isOpen={isUploading} 
        progress={uploadProgress.current} 
        total={uploadProgress.total} 
      />
      
      <div className={styles.pageHeader}>
        <h1>Produtos</h1>
        <div className={styles.headerContent}>
          {selectedProducts.size === 0 ? (
            <>
              <div className={styles.filterContainer}>
                <label htmlFor="group-filter">Filtrar por:</label>
                <div id="group-filter" className={styles.filterWrapper}>
                  <GroupSelector 
                    groups={filterOptions}
                    selectedGroupId={selectedGroupFilter}
                    onSelect={setSelectedGroupFilter}
                  />
                </div>
              </div>
              <div className={styles.headerActions}>
                <button onClick={() => setIsBulkUploadModalOpen(true)} className={styles.buttonSecondary}>Upload em Massa</button>
                <button onClick={handleOpenModal} className={styles.buttonPrimary}>Criar Novo Produto</button>
              </div>
            </>
          ) : (
            <div className={styles.bulkActionsContainer}>
              <button onClick={handleSelectAll} className={styles.buttonSecondary}>
                {isAllSelected ? 'Desselecionar Todos' : 'Selecionar Todos'}
              </button>
              <span className={styles.selectionCount}>
                {selectedProducts.size} selecionado(s)
              </span>
              <button onClick={() => handleOpenDeleteModal(null)} className={styles.buttonDanger}>
                Excluir Selecionados
              </button>
            </div>
          )}
        </div>
      </div>
      
      {loading ? <p>Carregando produtos...</p> : (
        <div className={styles.cardGrid}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              groupName={getGroupName(product.group_id)}
              onEdit={handleEdit}
              onDelete={() => handleOpenDeleteModal(product)}
              isSelected={selectedProducts.has(product.id)}
              onSelectProduct={handleProductSelect}
            />
          ))}
        </div>
      )}
      
      <ProductModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} product={editingProduct} groups={groups} />
      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={handleCloseDeleteModal} 
        onConfirm={handleConfirmDelete} 
        title={productToDelete ? "Excluir Produto" : "Excluir Produtos Selecionados"}
        message={
          productToDelete 
            ? `Tem certeza que deseja excluir o produto ID: "${productToDelete?.id}"?`
            : `Tem certeza que deseja excluir os ${selectedProducts.size} produtos selecionados?`
        }
      />
      <BulkUploadModal 
        isOpen={isBulkUploadModalOpen} 
        onClose={() => setIsBulkUploadModalOpen(false)} 
        onUpload={handleBulkUpload} 
        groups={groups}
      />
    </div>
  );
}
import styles from './ProductCard.module.css';
import { supabase } from '../../../supabaseClient';
import { Pencil, Trash2, Download, Check } from 'lucide-react';

export default function ProductCard({ product, onEdit, onDelete, groupName, isSelected, onSelectProduct }) {

  const getOptimizedImageUrl = (originalUrl) => {
    if (!originalUrl) return '';

    try {
      const urlObject = new URL(originalUrl);
      const path = urlObject.pathname.split('/products/')[1];

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(path, {
          transform: {
            width: 400,
            height: 400,
            resize: 'contain',
          },
        });
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error generating optimized URL:', error);
      return originalUrl;
    }
  };

  const thumbnailUrl = getOptimizedImageUrl(product.image_url);

  const getDownloadFilename = () => {
    const safeId = `product-${product.id}`;
    const urlParts = product.image_url.split('?')[0].split('.');
    const extension = urlParts[urlParts.length - 1];
    return `${safeId}.${extension}`;
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`${styles.card} ${isSelected ? styles.selected : ''}`} onClick={() => onSelectProduct(product.id)}>
      
      <div className={styles.checkboxOverlay}>
        {isSelected && <Check size={16} />}
      </div>
      
      <img src={thumbnailUrl} alt={`Product ID: ${product.id}`} className={styles.productImage} />
      <div className={styles.cardContent}>
        <span className={styles.groupName}>{groupName}</span>
        <h3 className={styles.cardTitle}>Product ID: {product.id}</h3>
      </div>

      <div className={styles.cardActions} onClick={handleActionClick}>
        <a 
          href={product.image_url} 
          download={getDownloadFilename()}
          className={`${styles.iconButton} ${styles.downloadButton}`}
          title="Baixar Imagem"
        >
          <Download size={18} />
        </a>
        <button onClick={() => onEdit(product)} className={`${styles.iconButton} ${styles.editButton}`}>
          <Pencil size={18} />
        </button>
        <button onClick={() => onDelete(product)} className={`${styles.iconButton} ${styles.deleteButton}`}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
// src/pages/Products/components/UploadProgressModal.jsx

import styles from './UploadProgressModal.module.css';
import { Loader2 } from 'lucide-react';

export default function UploadProgressModal({ isOpen, progress, total }) {
  if (!isOpen) {
    return null;
  }

  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;
  const isComplete = progress === total && total > 0;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.iconWrapper}>
          <Loader2 className={styles.spinner} size={32} />
        </div>
        <h2>{isComplete ? 'Upload Concluído!' : 'Enviando Imagens...'}</h2>
        <p className={styles.description}>
          Por favor, aguarde enquanto processamos os arquivos. Isso pode levar alguns instantes.
        </p>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressInfo}>
            <span>{percentage}%</span>
            <span>{progress} / {total} arquivos</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressBarFill} 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
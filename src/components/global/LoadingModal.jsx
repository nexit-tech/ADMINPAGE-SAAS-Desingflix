// src/components/global/LoadingModal.jsx

import styles from './LoadingModal.module.css';
import { Loader2 } from 'lucide-react';

export default function LoadingModal({ message }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <Loader2 className={styles.spinner} size={48} />
        <p>{message || 'Processando, por favor aguarde...'}</p>
      </div>
    </div>
  );
}
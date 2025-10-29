import { useState } from 'react';
import styles from './BulkUploadModal.module.css';
import GroupSelector from './GroupSelector';
import JSZip from 'jszip';
import { UploadCloud, Loader2 } from 'lucide-react';

export default function BulkUploadModal({ isOpen, onClose, onUpload, groups }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError('');
  };

  const handleProcessZip = async () => {
    if (!selectedFile || !selectedGroupId) {
      setError('Por favor, selecione um arquivo ZIP e um grupo.');
      return;
    }
    setIsProcessing(true);
    setError('');

    try {
      const zip = await JSZip.loadAsync(selectedFile);
      const newProducts = [];
      const imagePromises = [];

      zip.forEach((relativePath, zipEntry) => {
        const isImage = /\.(jpg|jpeg|png|gif)$/i.test(zipEntry.name);
        if (!zipEntry.dir && isImage) {
          const promise = zipEntry.async('blob').then(blob => {
            newProducts.push({
              file: blob,
              originalFilename: zipEntry.name,
            });
          });
          imagePromises.push(promise);
        }
      });

      await Promise.all(imagePromises);
      
      // A função onUpload agora é responsável por fechar este modal
      // e abrir o modal de loading.
      onUpload({ newProducts, groupId: selectedGroupId }); 
      
      // A linha que fechava o modal foi removida daqui.

    } catch (err) {
      setError('Erro ao processar o arquivo. Verifique se é um ZIP válido.');
      console.error(err);
      setIsProcessing(false); // Libera o botão em caso de erro
    }
  };
  
  const handleClose = () => {
    setSelectedFile(null);
    setSelectedGroupId(null);
    setError('');
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Upload de Produtos em Massa</h2>
        <p className={styles.description}>
          Selecione um grupo e envie um arquivo <strong>.zip</strong> com as imagens. Um produto será criado para cada imagem encontrada.
        </p>
        <div className={styles.formGroup}>
          <label>1. Selecione o Grupo de Destino</label>
          <GroupSelector groups={groups} selectedGroupId={selectedGroupId} onSelect={setSelectedGroupId} />
        </div>
        <div className={styles.formGroup}>
          <label>2. Envie o Arquivo .zip</label>
          <label htmlFor="zip-upload" className={styles.uploadBox}>
            <UploadCloud size={32} />
            <span>{selectedFile ? selectedFile.name : 'Clique para selecionar o arquivo'}</span>
          </label>
          <input id="zip-upload" type="file" accept=".zip" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.modalActions}>
          <button onClick={handleClose} className={styles.buttonSecondary} disabled={isProcessing}>
            Cancelar
          </button>
          <button onClick={handleProcessZip} className={styles.buttonPrimary} disabled={!selectedFile || !selectedGroupId || isProcessing}>
            {isProcessing ? <Loader2 className={styles.spinner} size={20} /> : 'Processar e Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useRef } from 'react';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  onFileSelect: (file: File, isVideo: boolean) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const isVideo = file.type.startsWith('video/');
      onFileSelect(file, isVideo);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const isVideo = file.type.startsWith('video/');
      onFileSelect(file, isVideo);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.controlPanel}>
      <div 
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
          className={styles.fileInput}
        />
        <div className={styles.dropZoneContent}>
          <svg className={styles.uploadIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p className={styles.dropZoneText}>
            Select File
          </p>
          <p className={styles.dropZoneSubtext}>
            360° JPG, PNG, MP4
          </p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel; 
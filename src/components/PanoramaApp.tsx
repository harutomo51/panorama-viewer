import React, { useState, useEffect } from 'react';
import PanoramaViewer from './PanoramaViewer';
import ControlPanel from './ControlPanel';
import styles from './PanoramaApp.module.css';

const PanoramaApp: React.FC = () => {
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File, fileIsVideo: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      // ファイルからURLを作成
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setIsVideo(fileIsVideo);
      setIsLoading(false);
    } catch (err) {
      setError('An error occurred while loading the file.');
      setIsLoading(false);
      console.error('File loading error:', err);
    }
  };

  // コンポーネントのアンマウント時にオブジェクトURLを解放
  useEffect(() => {
    return () => {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [mediaUrl]);

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Panorama Image/Video Viewer</h1>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.viewerSection}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Loading...</p>
            </div>
          ) : mediaUrl ? (
            <div className={styles.viewerWrapper}>
              <PanoramaViewer 
                imageUrl={!isVideo ? mediaUrl : undefined} 
                videoUrl={isVideo ? mediaUrl : undefined} 
                isVideo={isVideo} 
              />
            </div>
          ) : (
            <div className={styles.placeholderContainer}>
              <div className={styles.placeholderIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="21.17" y1="8" x2="12" y2="8"></line>
                  <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                  <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                </svg>
              </div>
              <p className={styles.placeholderText}>
                Please upload your panorama image or video.
              </p>
            </div>
          )}

          {error && (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          )}
        </section>

        <section className={styles.controlSection}>
          <ControlPanel onFileSelect={handleFileSelect} />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 Panorama Viewer</p>
      </footer>
    </div>
  );
};

export default PanoramaApp; 
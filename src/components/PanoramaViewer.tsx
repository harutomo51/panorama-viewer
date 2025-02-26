import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import styles from './PanoramaViewer.module.css';

interface PanoramaViewerProps {
  imageUrl?: string;
  videoUrl?: string;
  isVideo?: boolean;
}

// 球体の内側にテクスチャをマッピングするためのマテリアル
const PanoramaSphere: React.FC<{ imageUrl?: string; videoUrl?: string; isVideo?: boolean }> = ({ 
  imageUrl, 
  videoUrl,
  isVideo = false 
}) => {
  const { gl } = useThree();
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isVideo && videoUrl) {
      // 動画テクスチャの作成
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.play().catch(e => console.error('Failed to play the video.:', e));
      
      const texture = new THREE.VideoTexture(video);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      
      if (materialRef.current) {
        materialRef.current.map = texture;
        materialRef.current.needsUpdate = true;
      }
      
      videoRef.current = video;
    } else if (imageUrl) {
      // 画像テクスチャの作成
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(imageUrl, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        
        if (materialRef.current) {
          materialRef.current.map = texture;
          materialRef.current.needsUpdate = true;
        }
      });
    }

    // クリーンアップ関数
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current = null;
      }
    };
  }, [imageUrl, videoUrl, isVideo]);

  // 動画テクスチャの更新
  useFrame(() => {
    if (isVideo && materialRef.current && materialRef.current.map) {
      (materialRef.current.map as THREE.VideoTexture).needsUpdate = true;
    }
  });

  return (
    <Sphere args={[500, 64, 44]} scale={[-1, 1, 1]}>
      <meshBasicMaterial ref={materialRef} side={THREE.BackSide} />
    </Sphere>
  );
};

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ imageUrl, videoUrl, isVideo = false }) => {
  return (
    <div className={styles.viewerContainer}>
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <PanoramaSphere imageUrl={imageUrl} videoUrl={videoUrl} isVideo={isVideo} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          enableDamping={true}
          dampingFactor={0.1}
          rotateSpeed={0.5}
          minDistance={0.1}
          maxDistance={100}
        />
      </Canvas>
    </div>
  );
};

export default PanoramaViewer; 
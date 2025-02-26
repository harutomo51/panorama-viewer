'use client'

import dynamic from 'next/dynamic';

// クライアントサイドでのみレンダリングするためにdynamicインポートを使用
const PanoramaApp = dynamic(() => import('../components/PanoramaApp'), {
  ssr: false,
});

export default function Home() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <PanoramaApp />
    </div>
  );
}

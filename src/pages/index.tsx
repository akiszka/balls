import { runSimulation } from '@/util/simulation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [rect, setRect] = useState<DOMRect>();

  useEffect(() => {
    setRect(document.querySelector('main')!.getBoundingClientRect());
    return runSimulation();
  }, []);

  return (
    <main
      className="flex relative min-w-full min-h-screen flex-col items-center justify-between"
    >
      <canvas
        className="absolute top-0 left-0"
        width={rect?.width || 100}
        height={rect?.height || 100}
      />
    </main>
  );
}
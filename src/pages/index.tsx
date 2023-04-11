import { runSimulation } from '@/util/simulation';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    return runSimulation();
  }, []);

  return (
    <main
      className="flex relative min-w-full min-h-screen flex-col items-center justify-between"
    >
      <canvas
        className="absolute top-0 left-0"
        width={100}
        height={100}
      />
    </main>
  );
}
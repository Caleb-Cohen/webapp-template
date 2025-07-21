'use client';
import { useState } from 'react';
import { Button } from '../atoms/Button';

export function ApiDbTester() {
  const [result, setResult] = useState<string | null>(null);

  const handleClick = async () => {
    setResult('Loading...');
    try {
      const res = await fetch('/api/hello');
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`Error fetching API: ${err}`);
    }
  };

  return (
    <div className='flex flex-col items-center gap-2'>
      <Button onClick={handleClick}>Test API</Button>
      {result && (
        <div className='rounded-lg bg-zinc-900/80 border border-zinc-700 shadow-lg p-4 mt-2 w-full max-w-md overflow-x-auto'>
          <pre className='text-xs text-blue-200 font-mono whitespace-pre-wrap break-words'>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

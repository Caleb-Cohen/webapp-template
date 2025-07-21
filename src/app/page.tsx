import { ApiDbTester } from '@/components/organisms/SampleButton';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-8 p-8'>
      <h1 className='text-3xl font-bold text-center'>
        Welcome to your webapp template! 🚀
      </h1>
      <p className='text-lg text-gray-600 text-center max-w-xl'>
        This is a modern Next.js 15 template with TypeScript, Tailwind CSS,
        Prisma, Redis, and atomic design structure. Start building your app
        fast!
      </p>
      <ApiDbTester />
      <div className='mt-8'>
        <Image
          className='dark:invert'
          src='/next.svg'
          alt='Next.js logo'
          width={180}
          height={38}
          priority
        />
      </div>
    </div>
  );
}

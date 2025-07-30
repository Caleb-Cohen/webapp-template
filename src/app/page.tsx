import { ApiDbTester } from '@/components/organisms/SampleButton';
import { validateSessionToken } from '@/lib/session';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const session = sessionToken
    ? await validateSessionToken(sessionToken)
    : null;

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-8 p-8'>
      <h1 className='text-3xl font-bold text-center'>
        Welcome to your webapp template! 🚀
      </h1>

      {session ? (
        <div className='text-center'>
          <p className='text-lg text-green-600 mb-4'>✅ You are logged in!</p>
          <div className='flex gap-4 justify-center'>
            <Link
              href='/profile'
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              View Profile
            </Link>
            <Link
              href='/api/auth/logout'
              className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
            >
              Logout
            </Link>
          </div>
        </div>
      ) : (
        <div className='text-center'>
          <p className='text-lg text-gray-600 mb-4'>You are not logged in</p>
          <Link
            href='/login'
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Sign In
          </Link>
        </div>
      )}

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

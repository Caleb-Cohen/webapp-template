import { validateSessionToken } from '@/lib/session';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    redirect('/login');
  }

  const session = await validateSessionToken(sessionToken);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-8 p-8'>
      <h1 className='text-3xl font-bold'>Profile Page</h1>
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
        <h2 className='text-xl font-semibold mb-4'>Session Info</h2>
        <p>
          <strong>Session ID:</strong> {session.id}
        </p>
        <p>
          <strong>Created:</strong> {session.createdAt.toLocaleString()}
        </p>
        <p>
          <strong>Expires:</strong> {session.expiresAt.toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong>{' '}
          <span className='text-green-600'>✅ Active</span>
        </p>
      </div>
      <Link
        href='/'
        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
      >
        Back to Home
      </Link>
    </div>
  );
}

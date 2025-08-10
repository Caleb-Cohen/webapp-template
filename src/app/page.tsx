import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { validateSessionToken } from '@/lib/session';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const isAuthenticated = sessionToken
    ? await validateSessionToken(sessionToken)
    : false;

  return (
    <main className='min-h-dvh flex items-center justify-center p-6'>
      <Card className='w-full max-w-xl'>
        <CardHeader>
          <CardTitle>Welcome to your webapp template</CardTitle>
          <CardDescription>
            Next.js 15 + React 19 + Tailwind + Prisma + Redis
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <p className='text-sm text-muted-foreground'>
            This starter ships with sensible defaults. Use the buttons below to
            explore or start building.
          </p>
        </CardContent>
        <CardFooter className='gap-2'>
          {isAuthenticated ? (
            <>
              <Button variant='destructive' asChild>
                <a href='/api/auth/logout'>Sign Out</a>
              </Button>
              <Button variant='secondary' asChild>
                <a href='/profile'>View Profile</a>
              </Button>
            </>
          ) : (
            <>
              <Button asChild>
                <a href='/login'>Sign In</a>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}

'use server';

import { signIn, signOut } from '@/lib/auth';

export async function handleSignOut() {
  await signOut({ redirectTo: '/' });
}

export async function handleSignIn() {
  await signIn('github', { redirectTo: '/feed' });
}

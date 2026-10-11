import { Suspense } from 'react';
import AuthForm from '@/components/bazar/auth-form';
export const metadata = { title: 'সাইন ইন' };
export default function SignIn() { return <Suspense fallback={<div className="auth-page"><div className="skeleton h-96"/></div>}><AuthForm mode="signin"/></Suspense>; }

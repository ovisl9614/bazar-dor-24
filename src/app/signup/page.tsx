import { Suspense } from 'react';
import AuthForm from '@/components/bazar/auth-form';
export const metadata = { title: 'সাইন আপ' };
export default function SignUp() { return <Suspense fallback={<div className="auth-page"><div className="skeleton h-96"/></div>}><AuthForm mode="signup"/></Suspense>; }

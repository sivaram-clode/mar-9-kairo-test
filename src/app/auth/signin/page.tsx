"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);
    if (res?.error) {
      setError(
        res.error === "CredentialsSignin"
          ? "Invalid email or password"
          : res.error
      );
    } else if (res?.ok) {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-linkedin-bg flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[44px] h-[44px]" fill="#0a66c2">
          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
        </svg>
      </div>

      <div className="w-full max-w-[400px] bg-white rounded-lg shadow-card p-8">
        <h1 className="text-3xl font-semibold text-linkedin-text mb-1">Sign in</h1>
        <p className="text-sm text-linkedin-text-secondary mb-6">Stay updated on your professional world</p>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm text-linkedin-text-secondary mb-1">Email</label>
            <input id="email" name="email" type="email" required className="w-full px-3 py-2.5 border border-linkedin-border rounded focus:outline-none focus:ring-2 focus:ring-linkedin-blue focus:border-transparent text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-linkedin-text-secondary mb-1">Password</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2.5 border border-linkedin-border rounded focus:outline-none focus:ring-2 focus:ring-linkedin-blue focus:border-transparent text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-linkedin-blue text-white rounded-full text-base font-semibold hover:bg-linkedin-blue-hover disabled:opacity-50 transition">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-linkedin-text-secondary">
            New to LinkedIn?{" "}
            <Link href="/auth/signup" className="text-linkedin-blue font-semibold hover:underline">Join now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-linkedin-bg flex items-center justify-center"><div className="skeleton h-8 w-32" /></div>}>
      <SignInForm />
    </Suspense>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); setLoading(false); return; }
      router.push("/auth/signin?registered=true");
    } catch {
      setError("Something went wrong");
      setLoading(false);
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
        <h1 className="text-3xl font-semibold text-linkedin-text mb-1">Join LinkedIn</h1>
        <p className="text-sm text-linkedin-text-secondary mb-6">Make the most of your professional life</p>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm text-linkedin-text-secondary mb-1">Name</label>
            <input id="name" name="name" type="text" required className="w-full px-3 py-2.5 border border-linkedin-border rounded focus:outline-none focus:ring-2 focus:ring-linkedin-blue focus:border-transparent text-sm" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-linkedin-text-secondary mb-1">Email</label>
            <input id="email" name="email" type="email" required className="w-full px-3 py-2.5 border border-linkedin-border rounded focus:outline-none focus:ring-2 focus:ring-linkedin-blue focus:border-transparent text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-linkedin-text-secondary mb-1">Password (8+ characters)</label>
            <input id="password" name="password" type="password" required minLength={8} className="w-full px-3 py-2.5 border border-linkedin-border rounded focus:outline-none focus:ring-2 focus:ring-linkedin-blue focus:border-transparent text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-linkedin-blue text-white rounded-full text-base font-semibold hover:bg-linkedin-blue-hover disabled:opacity-50 transition">
            {loading ? "Creating account..." : "Agree & Join"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-linkedin-text-secondary">
            Already on LinkedIn?{" "}
            <Link href="/auth/signin" className="text-linkedin-blue font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

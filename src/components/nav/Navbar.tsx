"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { FormEvent, useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as { id?: string; name?: string | null; image?: string | null } | undefined;
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-linkedin-border">
      <div className="max-w-[1128px] mx-auto px-4 h-[52px] flex items-center gap-2">
        {/* LinkedIn Logo */}
        <Link href="/" className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[34px] h-[34px]" fill="#0a66c2">
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
          </svg>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[280px]">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-linkedin-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#eef3f8] rounded text-sm focus:outline-none focus:ring-2 focus:ring-linkedin-blue focus:bg-white focus:shadow-md placeholder-linkedin-text-tertiary"
            />
          </div>
        </form>

        <div className="flex-1" />

        {/* Nav Links */}
        <div className="hidden md:flex items-center">
          <NavLink href="/" icon={<HomeIcon />} label="Home" active={isActive("/")} />
          <NavLink href="/network" icon={<NetworkIcon />} label="My Network" active={isActive("/network")} />
        </div>

        {/* Avatar Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center px-3 py-1 hover:opacity-80"
          >
            <div className="w-6 h-6 rounded-full bg-linkedin-blue flex items-center justify-center text-white text-[10px] font-semibold overflow-hidden">
              {user.image ? (
                <img src={user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                (user.name?.[0] ?? "U").toUpperCase()
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-xs text-linkedin-text-secondary hidden md:inline">Me</span>
              <svg className="w-3 h-3 text-linkedin-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-[280px] bg-white rounded-lg shadow-card-hover border border-linkedin-border py-2">
              <div className="px-4 py-3 flex items-center gap-3 border-b border-linkedin-border">
                <div className="w-14 h-14 rounded-full bg-linkedin-blue flex items-center justify-center text-white text-xl font-semibold overflow-hidden flex-shrink-0">
                  {user.image ? (
                    <img src={user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (user.name?.[0] ?? "U").toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-linkedin-text truncate">{user.name}</p>
                </div>
              </div>
              <Link
                href={`/profile/${user.id}`}
                className="block px-4 py-2 text-sm text-linkedin-blue font-semibold border-b border-linkedin-border mx-3 mb-1 text-center rounded-full border hover:bg-linkedin-blue-light"
                onClick={() => setMenuOpen(false)}
              >
                View Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-sm text-linkedin-text-secondary hover:bg-linkedin-bg"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-1">
          <Link href="/" className={`p-2 rounded ${isActive("/") ? "text-linkedin-text" : "text-linkedin-text-tertiary"}`}>
            <HomeIcon />
          </Link>
          <Link href="/network" className={`p-2 rounded ${isActive("/network") ? "text-linkedin-text" : "text-linkedin-text-tertiary"}`}>
            <NetworkIcon />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center px-4 py-1.5 text-xs gap-0.5 border-b-2 transition-colors ${
        active
          ? "text-linkedin-text border-linkedin-text"
          : "text-linkedin-text-tertiary border-transparent hover:text-linkedin-text"
      }`}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
}

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

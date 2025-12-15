"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, MapPin, Menu, X, User, PlusCircle } from "lucide-react";
import { useState } from "react";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600">
                Northbound Gather
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/events" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Discover
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                  Dashboard
                </Link>
                <Link href="/create" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-primary/20 hover:scale-105">
                  <PlusCircle size={16} />
                  Host Event
                </Link>
                
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border/50">
                  <Link href="/account" className="relative group">
                     <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                       {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                       ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                       )}
                     </div>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors p-2 hover:bg-muted/50 rounded-full"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-primary/25 flex items-center gap-2">
                  <User size={18} />
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/events" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>
              Discover
            </Link>
            {user ? (
              <>
                 <Link href="/create" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>
                  Host Event
                </Link>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/account" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-muted text-red-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
               <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted text-primary" onClick={() => setIsOpen(false)}>
                  Log In / Sign Up
                </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

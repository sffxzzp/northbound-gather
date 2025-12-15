"use client";

import { useState, useEffect } from "react";
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { Github } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Create user doc if not exists (merge: true)
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      }, { merge: true });
      
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-2">
          Welcome to NorthBound
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Sign in to manage your events and adventures
        </p>

        {error && (
          <div className="mb-6 text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-200">
            {error}
          </div>
        )}

        <button
          onClick={handleGithubLogin}
          className="w-full flex items-center justify-center gap-2 bg-[#24292F] hover:bg-[#24292F]/90 text-white py-4 rounded-lg font-bold transition-all shadow-md transform hover:scale-[1.02]"
        >
          <Github size={20} />
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}

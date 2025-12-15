"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { getUserProfile, saveUserProfile } from "@/lib/firestore";
import { updateProfile } from "firebase/auth";
import { Loader2, User, Save } from "lucide-react";

export default function AccountPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    photoURL: "",
  });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const data = await getUserProfile(user.uid);
        if (data) {
          setFormData({
            displayName: data.displayName || user.displayName || "",
            bio: data.bio || "",
            photoURL: data.photoURL || user.photoURL || "",
          });
        } else {
           setFormData({
            displayName: user.displayName || "",
            bio: "",
            photoURL: user.photoURL || "",
          });
        }
      };
      
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // Update Auth Profile
      if (formData.displayName !== user.displayName || formData.photoURL !== user.photoURL) {
         await updateProfile(auth.currentUser, {
           displayName: formData.displayName,
           photoURL: formData.photoURL
         });
      }

      // Update Firestore Profile
      await saveUserProfile(user.uid, {
        uid: user.uid,
        email: user.email,
        displayName: formData.displayName,
        bio: formData.bio,
        photoURL: formData.photoURL,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-8">
         <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center mb-8">
               <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary mb-4">
                  {formData.photoURL ? (
                    <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
               </div>
               
               <div className="w-full max-w-sm">
                  <label className="block text-sm font-medium mb-1 text-center">Avatar URL</label>
                  <input 
                    name="photoURL"
                    placeholder="https://example.com/me.jpg"
                    className="w-full text-center px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none text-sm"
                    value={formData.photoURL}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    Paste an image URL to update your avatar.
                  </p>
               </div>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input 
                    name="displayName"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                    value={formData.displayName}
                    onChange={handleChange}
                  />
               </div>
               
               <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea 
                    name="bio"
                    rows={4}
                    placeholder="Tell us about your outdoor experience..."
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
                    value={formData.bio}
                    onChange={handleChange}
                  />
               </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
               <button 
                type="submit" 
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-bold transition-all shadow-md flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
         </form>
      </div>
    </div>
  );
}

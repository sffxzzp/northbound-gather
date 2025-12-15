"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createEvent } from "@/lib/firestore";
import { CATEGORIES } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("@/components/EventMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-64 bg-muted animate-pulse rounded-xl" />
});

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Hiking",
    date: "",
    time: "",
    location: "",
    capacity: 10,
    cost: "Free",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const eventData = {
      ...formData,
      capacity: parseInt(formData.capacity), // Ensure capacity is an integer
      createdBy: user.uid,
      hostName: user.displayName,
      hostPhoto: user.photoURL,
      attendees: [], 
      spotsRemaining: parseInt(formData.capacity), // Initialize spotsRemaining
    };

    try {
      const id = await createEvent(eventData);
      router.push(`/events/${id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Create New Adventure</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8 rounded-xl shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Title</label>
            <input 
              name="title" 
              required
              placeholder="e.g., Sunset Hike at Grouse Mountain"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium mb-1">Category</label>
               <select 
                 name="category"
                 className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                 value={formData.category}
                 onChange={handleChange}
               >
                 {CATEGORIES.map(category => (
                   <option key={category} value={category}>{category}</option>
                 ))}
               </select>
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Cost</label>
                <input 
                  name="cost" 
                  placeholder="e.g., Free, $20/person"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                  value={formData.cost}
                  onChange={handleChange}
                />
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium mb-1">Location</label>
             <LocationPicker 
               value={formData.location}
               onChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
             />
             {formData.location && (
               <div className="mt-4">
                 <p className="text-xs text-muted-foreground mb-2">Location Preview</p>
                 <EventMap location={formData.location} />
               </div>
             )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
               <label className="block text-sm font-medium mb-1">Date</label>
               <input 
                 type="date"
                 name="date" 
                 required
                 className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                 value={formData.date}
                 onChange={handleChange}
               />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Time</label>
               <input 
                 type="time"
                 name="time" 
                 required
                 className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                 value={formData.time}
                 onChange={handleChange}
               />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Max Capacity</label>
               <input 
                 type="number"
                 name="capacity" 
                 min="1"
                 required
                 className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                 value={formData.capacity}
                 onChange={handleChange}
               />
            </div>
          </div>

           <div>
             <label className="block text-sm font-medium mb-1">Description</label>
             <textarea 
               name="description" 
               required
               rows={6}
               placeholder="Describe the plan, what to bring, difficulty level, etc."
               className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
               value={formData.description}
               onChange={handleChange}
             />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? "Creating..." : "Publish Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

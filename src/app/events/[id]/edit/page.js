"use client";

import { use, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getEvent, updateEvent, deleteEvent } from "@/lib/firestore";
import { CATEGORIES } from "@/lib/constants";
import { Loader2, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import LocationPicker from "@/components/LocationPicker";
import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("@/components/EventMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-64 bg-muted animate-pulse rounded-xl" />
});

export default function EditEventPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
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

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchEvent = async () => {
      try {
        const data = await getEvent(id);
        
        if (data) {
          if (data.createdBy !== user.uid) {
            alert("You are not authorized to edit this event.");
            router.push(`/events/${id}`);
            return;
          }
          setFormData({
            title: data.title,
            description: data.description,
            category: data.category,
            date: data.date,
            time: data.time,
            location: data.location,
            capacity: data.capacity,
            cost: data.cost,
          });
        } else {
          router.push("/events");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateEvent(id, formData);
      router.push(`/events/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to cancel this event? This cannot be undone.")) return;
    setSaving(true);
    try {
      await deleteEvent(id);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
      setSaving(false);
    }
  };

  if (loading || authLoading) return <div className="p-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href={`/events/${id}`} className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 mb-8">
        <ArrowLeft size={16} /> Cancel Editing
      </Link>
      
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold">Edit Event</h1>
         <button 
           onClick={handleDelete}
           type="button"
           className="text-red-500 hover:text-red-600 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
         >
           <Trash2 size={18} /> Cancel Event
         </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8 rounded-xl shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Title</label>
            <input 
              name="title" 
              required
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
               className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
               value={formData.description}
               onChange={handleChange}
             />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            {saving && <Loader2 className="animate-spin" size={20} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

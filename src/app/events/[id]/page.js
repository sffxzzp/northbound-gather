"use client";

import { use, useEffect, useState } from "react";
import { subscribeToEvent, toggleRSVP } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCategoryStyle } from "@/lib/constants";
import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("@/components/EventMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-64 bg-muted animate-pulse rounded-xl" />
});

export default function EventDetailPage({ params }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToEvent(id, (data) => {
      setEvent(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${id}`);
      return;
    }
    setRsvpLoading(true);

    try {
      await toggleRSVP(id, user);
    } catch (e) {
      console.error("Transaction failed: ", e);
      // Simple error handling
      const msg = e.toString().includes("Validation") || e.toString().includes("full") 
        ? "Sorry, this event is full." 
        : "Failed to update RSVP";
      alert(msg);
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading adventure details...</div>;
  if (!event) return <div className="p-12 text-center text-muted-foreground">Event not found.</div>;

  const isJoined = event.attendees?.some(a => a.uid === user?.uid);
  const isFull = event.spotsRemaining <= 0;
  const styles = getCategoryStyle(event.category);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header Image / Pattern */}
      {/* Back Button & Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <Link href="/events" className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors w-fit">
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row relative">
           
           {/* Color Strip */}
           <div className={`absolute top-0 left-0 right-0 h-2 z-20 ${styles.solid}`} />
           
           {/* Main Content */}
           <div className="flex-1 p-8">
             <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {event.category || "Adventure"}
                </span>
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                   <Users size={14} /> {event.attendees?.length || 0} / {event.capacity} Going
                </span>
             </div>

             <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">{event.title}</h1>
             
             <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center text-foreground">
                   <Calendar className="w-5 h-5 mr-3 text-primary" />
                   <span className="font-medium">{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center text-foreground">
                   <MapPin className="w-5 h-5 mr-3 text-primary" />
                   <span className="font-medium">{event.location}</span>
                </div>
                 <div className="flex items-center text-foreground">
                   <div className="w-5 h-5 mr-3 flex items-center justify-center font-bold text-primary">$</div>
                   <span className="font-medium">{event.cost}</span>
                </div>
             </div>

             <div className="prose prose-stone dark:prose-invert max-w-none">
               <h3 className="text-lg font-bold">About this trip</h3>
               <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                 {event.description}
               </p>
             </div>

             <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Location</h3>
                <div className="flex items-center text-muted-foreground mb-4">
                   <MapPin className="w-5 h-5 mr-2 text-primary" />
                   <span><Link className="underline" href={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}`} target="_blank">{event.location}</Link></span>
                </div>
                <EventMap location={event.location} disableDebounce={true} />
             </div>
             
             <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-lg font-bold mb-4">Attendees ({event.attendees?.length || 0})</h3>
                <div className="flex flex-wrap gap-3">
                   {event.attendees?.length > 0 ? event.attendees.map((attendee, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                         <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                            {attendee.photoURL ? <img src={attendee.photoURL} className="w-full h-full object-cover" /> : null}
                         </div>
                         <span className="text-sm font-medium">{attendee.displayName?.split(" ")[0]}</span>
                      </div>
                   )) : (
                     <p className="text-muted-foreground text-sm italic">Be the first to join!</p>
                   )}
                </div>
             </div>
           </div>

           {/* Sidebar Action */}
           <div className="md:w-80 bg-muted/30 p-8 border-l border-border flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gray-300 mb-4 overflow-hidden border-2 border-white shadow-md">
                 {event.hostPhoto ? <img src={event.hostPhoto} className="w-full h-full object-cover" /> : null}
              </div>
              <p className="text-sm text-muted-foreground mb-1">Hosted by</p>
              <h3 className="text-lg font-bold text-foreground mb-6">{event.hostName}</h3>
              
              <div className="w-full space-y-3">
                <button
                  onClick={handleJoin}
                  disabled={rsvpLoading || (isFull && !isJoined)}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${
                    isJoined 
                      ? "bg-red-500 hover:bg-red-600 text-white" 
                      : isFull 
                        ? "bg-gray-400 cursor-not-allowed text-gray-100"
                        : "bg-primary hover:bg-primary/90 text-white"
                  }`}
                >
                  {rsvpLoading 
                    ? "Updating..." 
                    : isJoined 
                      ? "Leave Event" 
                      : isFull 
                        ? "Full"
                        : "Join Event"
                  }
                </button>
                
                 {isFull && !isJoined && (
                   <p className="text-xs text-red-500 font-medium">This event has reached capacity.</p>
                 )}

                 {user && user.uid === event.createdBy && (
                   <Link 
                     href={`/events/${event.id}/edit`}
                     className="w-full py-3 flex items-center justify-center gap-2 border border-border rounded-xl font-bold text-foreground hover:bg-muted transition-colors mt-2"
                   >
                      Manage Event
                   </Link>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

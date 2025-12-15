"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Calendar } from "lucide-react";
import { getHostedEvents, getJoinedEvents } from "@/lib/firestore";
import { getCategoryStyle } from "@/lib/constants";
import EventCard from "@/components/EventCard";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hostedEvents, setHostedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);
  
  // Fetch user events and joined events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      try {
        const [hosted, joined] = await Promise.all([
          getHostedEvents(user.uid),
          getJoinedEvents(user.uid)
        ]);
        setHostedEvents(hosted);
        setJoinedEvents(joined);

      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    
    fetchEvents();
  }, [user]);

  if (loading || !user) return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
           <h1 className="text-3xl font-bold text-foreground">Welcome, {user.displayName}</h1>
           <p className="text-muted-foreground mt-1">Manage your adventures and rsvps.</p>
        </div>
        <Link 
          href="/create" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <PlusCircle size={20} />
          Create Event
        </Link>
      </div>

      <div className="space-y-12">
        {/* Joined Events */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Adventures</h2>
          {joinedEvents.length === 0 ? (
           <div className="bg-card border border-border rounded-xl p-8 text-center shadow-sm">
              <p className="text-muted-foreground">You haven't joined any upcoming events.</p>
              <Link href="/events" className="text-primary font-bold hover:underline mt-2 inline-block">
                Browse Events &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedEvents.map(event => (
                 <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Hosted Events */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Events You're Hosting</h2>
          {hostedEvents.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Calendar className="text-muted-foreground" size={32} />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No events hosted yet</h3>
              <p className="text-muted-foreground mb-6">Get started by planning your first outing.</p>
              <Link href="/create" className="text-primary font-bold hover:underline">
                Create an Event &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostedEvents.map(event => (
                 <EventCard key={event.id} event={event} isHost />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}



"use client";

import { useState, useEffect } from "react";
import { getTrendingEvents } from "@/lib/firestore";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { getCategoryStyle } from "@/lib/constants";


export default function TrendingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const eventsData = await getTrendingEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching trending events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) return null;
  if (events.length === 0) return null;

  return (
    <section className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Trending Adventures</h2>
            <p className="mt-2 text-muted-foreground">Join upcoming events across Canada</p>
          </div>
          <Link href="/events" className="text-primary font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => {
            const styles = getCategoryStyle(event.category);
            return (
              <Link key={event.id} href={`/events/${event.id}`} className="group block bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer">
              {/* Color Strip */}
              <div className={`h-2 w-full ${styles.solid}`} />
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${styles.bg} ${styles.label}`}>
                    {event.category || "Adventure"}
                  </div>
                  <div className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                     {event.spotsRemaining} Spots
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {event.title}
                </h3>
                <div className="flex flex-col gap-1 text-muted-foreground text-sm mb-4">
                  <div className="flex items-center">
                     <Calendar size={14} className="mr-2" />
                     <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center">
                     <MapPin size={14} className="mr-2" />
                     <span className="truncate">{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                       {event.hostPhoto ? <img src={event.hostPhoto} className="w-full h-full object-cover" /> : null}
                     </div>
                     <span className="text-xs text-muted-foreground truncate max-w-[100px]">{event.hostName}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{event.cost === "Free" ? "Free" : event.cost}</span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

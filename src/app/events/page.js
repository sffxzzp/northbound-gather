"use client";

import { useState, useEffect } from "react";
import { subscribeToEvents } from "@/lib/firestore";
import Link from "next/link";
import { Calendar, MapPin, Search, Filter } from "lucide-react";

import { getCategoryStyle, CATEGORIES } from "@/lib/constants";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const unsubscribe = subscribeToEvents((data) => {
      setEvents(data);
      setFilteredEvents(data); // Also update filteredEvents initially
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Client side filtering
    let result = events;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(e => 
        e.title?.toLowerCase().includes(lowerTerm) || 
        e.location?.toLowerCase().includes(lowerTerm)
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter(e => e.category === categoryFilter);
    }

    setFilteredEvents(result);
  }, [searchTerm, categoryFilter, events]);

  const categories = ["All", ...CATEGORIES];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-foreground">Explore Adventures</h1>
           <p className="text-muted-foreground">Find existing groups and join the fun</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <input 
              placeholder="Search adventures..." 
              className="pl-10 pr-4 py-2 border border-border rounded-lg bg-card w-full sm:w-64 focus:ring-2 focus:ring-primary outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
             <Filter className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
             <select
               className="pl-10 pr-8 py-2 border border-border rounded-lg bg-card appearance-none focus:ring-2 focus:ring-primary outline-none"
               value={categoryFilter}
               onChange={(e) => setCategoryFilter(e.target.value)}
             >
               {categories.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
           <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
           <p className="text-muted-foreground">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl">
           <p className="text-muted-foreground mb-4">No events found matching your criteria.</p>
           {events.length === 0 && (
             <Link href="/create" className="text-primary font-bold hover:underline">
               Be the first to host an event!
             </Link>
           )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const styles = getCategoryStyle(event.category);
            return (
            <Link key={event.id} href={`/events/${event.id}`} className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
              <div className={`h-2 w-full ${styles.solid}`} />
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                   <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${styles.bg} ${styles.label}`}>
                      {event.category || "Adventure"}
                   </span>
                   <div className="text-xs font-bold px-2 py-1 rounded-full shadow-sm text-slate-600 bg-muted">
                     {event.spotsRemaining} Spots
                   </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">{event.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar size={16} className="mr-2 text-primary/80" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin size={16} className="mr-2 text-primary/80" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                       {event.hostPhoto ? <img src={event.hostPhoto} className="w-full h-full object-cover" /> : null}
                     </div>
                     <span className="text-xs text-muted-foreground">By {event.hostName?.split(" ")[0]}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{event.cost === "Free" ? "Free" : event.cost}</span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

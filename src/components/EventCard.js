"use client";

import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { getCategoryStyle } from "@/lib/constants";

export default function EventCard({ event, isHost }) {
  const styles = getCategoryStyle(event.category);
  
  return (
    <div className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
       <Link href={`/events/${event.id}`} className="flex-1 block">
         {/* Color Strip */}
         <div className={`h-2 w-full ${styles.solid}`} />
         
         <div className="p-5 pb-0">
           <div className="flex justify-between items-start mb-3">
              <div className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${styles.bg} ${styles.label}`}>
                  {event.category || "Adventure"}
              </div>
           </div>
           
           <h3 className="text-lg font-bold text-foreground group-hover:text-primary line-clamp-1 mb-4">{event.title}</h3>
           
           <div className="space-y-2 mb-4">
             <div className="flex items-center text-muted-foreground text-sm">
               <Calendar size={14} className="mr-2" />
               <span>{event.date} • {event.time}</span>
             </div>
             <div className="flex items-center text-muted-foreground text-sm">
               <MapPin size={14} className="mr-2" />
               <span className="truncate">{event.location}</span>
             </div>
           </div>
         </div>
       </Link>

       {isHost && (
          <div className="p-4 pt-2 mt-auto">
             <Link 
               href={`/events/${event.id}/edit`} 
               className="w-full block text-center bg-secondary/50 hover:bg-secondary text-secondary-foreground py-2 rounded-lg text-sm font-bold transition-colors"
             >
               Manage Event &rarr;
             </Link>
          </div>
       )}
    </div>
  );
}

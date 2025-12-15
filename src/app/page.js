import Link from "next/link";
import { ArrowRight, Calendar, Users, Map } from "lucide-react";
import TrendingEvents from "@/components/TrendingEvents";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.jpg"
            alt="Moraine Lake pic from Unsplash"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Find Your <span className="text-primary-foreground">Wild</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto drop-shadow-md">
            The dedicated event platform for Canada's outdoor community. 
            Organize hikes, coordinate camping trips, and gather with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link 
              href="/events" 
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
            >
              Explore Events <ArrowRight size={20} />
            </Link>
            <Link 
              href="/create" 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Organize a Trip
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">Why NorthBound?</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Stop relying on messy group chats. We handle the logistics so you can focus on the adventure.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Streamlined Logistics"
              description="Set times, locations, and gear lists in one clear, beautifully designed event page."
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-secondary" />}
              title="Smart RSVPs"
              description="Automated waitlists and headcount tracking. No more 'copy-paste' lists in chat."
            />
            <FeatureCard 
              icon={<Map className="h-10 w-10 text-blue-500" />}
              title="Discover Local"
              description="Find open groups and events happening in your area. Connect with fellow explorers."
            />
          </div>
        </div>
      </section>

      {/* Trending Events */}
      <TrendingEvents />
    </div>
  );
}


import { Calendar, Users, Map } from "lucide-react";

export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-card p-8 rounded-2xl shadow-sm border border-border hover:border-primary/50 transition-colors">
      <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

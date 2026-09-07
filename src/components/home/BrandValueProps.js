import { Globe, Flame, Diamond } from 'lucide-react';

export default function BrandValueProps() {
  const values = [
    {
      title: "Worldwide Delivery",
      description: "No borders. We bring the Reckless Era directly to your doorstep, anywhere in the world.",
      icon: Globe,
    },
    {
      title: "OFF COURSE. ON PURPOSE",
      description: "Confidence, passion, and dreams stitched into every piece. Designed for the bold.",
      icon: Flame,
    },
    {
      title: "Premium Quality",
      description: "Uncompromising craftsmanship and top-tier materials for those who refuse to blend in.",
      icon: Diamond,
    }
  ];

  return (
    <div className="w-full bg-app-bg py-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-center pt-8 md:pt-0 md:px-8 first:pt-0 group">
                {/* Icon Container */}
                <div className="bg-white p-5 rounded-full shadow-sm mb-6 text-brand-accent group-hover:scale-110 group-hover:text-brand-primary group-hover:shadow-md transition-all duration-300">
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                
                {/* Text Content */}
                <h3 className="text-lg font-bold uppercase tracking-widest text-brand-black mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
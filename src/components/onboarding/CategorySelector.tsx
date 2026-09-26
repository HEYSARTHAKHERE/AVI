import React from 'react';
import { CreatorCategory } from '../../types';
import { 
  Shirt, 
  Sparkles, 
  Heart, 
  Dumbbell, 
  Gamepad2, 
  Camera, 
  Video, 
  Music as MusicIcon, 
  Compass, 
  Laptop, 
  Utensils, 
  GraduationCap, 
  MoreHorizontal,
  Check
} from 'lucide-react';

interface CategorySelectorProps {
  selectedCategories: CreatorCategory[];
  onChange: (categories: CreatorCategory[]) => void;
  onValidChange: (isValid: boolean) => void;
}

interface CategoryOption {
  id: CreatorCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'Fashion', label: 'Fashion', icon: Shirt, description: 'Editorial styling, lookbooks, apparel' },
  { id: 'Beauty', label: 'Beauty', icon: Sparkles, description: 'Skincare, makeup, grooming' },
  { id: 'Lifestyle', label: 'Lifestyle', icon: Heart, description: 'Daily routines, interiors, aesthetics' },
  { id: 'Photography', label: 'Photography', icon: Camera, description: 'Commercial stills, creative direction' },
  { id: 'UGC', label: 'UGC & Content', icon: Video, description: 'Product ads, authentic brand videos' },
  { id: 'Travel', label: 'Travel', icon: Compass, description: 'Destinations, luxury hospitality' },
  { id: 'Technology', label: 'Technology', icon: Laptop, description: 'Hardware reviews, apps, workflow' },
  { id: 'Fitness', label: 'Fitness & Health', icon: Dumbbell, description: 'Workouts, athletics, wellness' },
  { id: 'Gaming', label: 'Gaming', icon: Gamepad2, description: 'Streaming, esports, commentary' },
  { id: 'Music', label: 'Music & Audio', icon: MusicIcon, description: 'Original tracks, instruments, production' },
  { id: 'Food', label: 'Food & Culinary', icon: Utensils, description: 'Recipes, fine dining, mixology' },
  { id: 'Education', label: 'Education', icon: GraduationCap, description: 'Tutorials, career insights, guides' },
  { id: 'Other', label: 'Other Disciplines', icon: MoreHorizontal, description: 'Specialized niche creations' },
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onChange,
  onValidChange,
}) => {
  React.useEffect(() => {
    onValidChange(selectedCategories.length > 0);
  }, [selectedCategories.length, onValidChange]);

  const toggleCategory = (cat: CreatorCategory) => {
    let next: CreatorCategory[];
    if (selectedCategories.includes(cat)) {
      next = selectedCategories.filter((c) => c !== cat);
    } else {
      next = [...selectedCategories, cat];
    }
    onChange(next);
    onValidChange(next.length > 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
          What kind of creator are you?
        </h2>
        <p className="mt-2 text-sm text-[#575762] leading-relaxed">
          Choose the categories that best describe your work. You can select more than one.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORIES.map((item) => {
          const isSelected = selectedCategories.includes(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleCategory(item.id)}
              className={`p-3.5 sm:p-4 rounded-xl text-left border transition-all duration-150 flex flex-col justify-between min-h-[96px] group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8EA633] cursor-pointer ${
                isSelected
                  ? 'bg-[#141416] text-[#FAF9F5] border-[#141416] shadow-sm'
                  : 'bg-white/80 backdrop-blur-xs text-[#141416] border-[rgba(20,20,22,0.08)] hover:border-[rgba(20,20,22,0.2)] hover:bg-[#FFFFFF]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#252529] text-[#8EA633]'
                      : 'bg-[#F3F1EC] text-[#575762] group-hover:text-[#141416]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Animated check state */}
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#8EA633] text-[#141416] scale-100'
                      : 'border border-[rgba(20,20,22,0.14)] opacity-0 scale-75 group-hover:opacity-60'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>

              <div className="mt-2">
                <span className="text-xs font-bold block">{item.label}</span>
                <span
                  className={`text-[10px] line-clamp-1 mt-0.5 ${
                    isSelected ? 'text-[#888894]' : 'text-[#575762]'
                  }`}
                >
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-[#575762] flex items-center justify-between pt-1">
        <span>
          Selected: <strong className="text-[#141416]">{selectedCategories.length} categories</strong>
        </span>
        {selectedCategories.length === 0 && (
          <span className="text-amber-600 font-medium">Please select at least 1 category</span>
        )}
      </div>
    </div>
  );
};

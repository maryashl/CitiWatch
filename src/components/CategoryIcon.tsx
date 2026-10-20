import React from 'react';
import { 
  Lightbulb, 
  Droplets, 
  Trash2, 
  Construction, 
  Trees, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { ServiceCategory } from '../types';

interface CategoryIconProps {
  category: ServiceCategory;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-5 h-5' }) => {
  switch (category) {
    case 'streetlights':
      return <Lightbulb className={className} />;
    case 'water':
      return <Droplets className={className} />;
    case 'garbage':
      return <Trash2 className={className} />;
    case 'roads':
      return <Construction className={className} />;
    case 'parks':
      return <Trees className={className} />;
    case 'health':
      return <ShieldAlert className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

import { CategoryInfo, ServiceCategory } from '../types';

export const SERVICE_CATEGORIES: Record<ServiceCategory, CategoryInfo> = {
  streetlights: {
    id: 'streetlights',
    name: 'Streetlights & Electrical',
    department: 'Directorate of Public Works & Energy',
    description: 'Broken lamp posts, flickering street lights, hanging live wires, damaged feeder pillars.',
    iconName: 'Lightbulb',
    slaHours: 48,
    color: 'text-[#F59E0B]',
    accentBg: 'bg-[#FFFBEB] text-[#B45309] border-[#F59E0B]/30',
    badgeBorder: 'border-[#F59E0B]/40'
  },
  water: {
    id: 'water',
    name: 'Water Supply & Sewerage',
    department: 'Municipal Water & Sewerage Company',
    description: 'Burst distribution mains, low pressure, blocked sewer lines, open manholes, contaminated supply.',
    iconName: 'Droplets',
    slaHours: 24,
    color: 'text-[#005EA8]',
    accentBg: 'bg-[#F0F7FC] text-[#005EA8] border-[#005EA8]/30',
    badgeBorder: 'border-[#005EA8]/40'
  },
  garbage: {
    id: 'garbage',
    name: 'Garbage & Waste Collection',
    department: 'Department of Environment & Waste Management',
    description: 'Uncollected residential garbage, illegal dumping, overflowing commercial skips, dead animals.',
    iconName: 'Trash2',
    slaHours: 36,
    color: 'text-[#16A34A]',
    accentBg: 'bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/30',
    badgeBorder: 'border-[#16A34A]/40'
  },
  roads: {
    id: 'roads',
    name: 'Roads, Potholes & Drainage',
    department: 'Urban Roads & Infrastructure Authority',
    description: 'Dangerous potholes, collapsed culverts, missing guardrails, eroded road shoulders, blocked storm drains.',
    iconName: 'Construction',
    slaHours: 72,
    color: 'text-[#F59E0B]',
    accentBg: 'bg-[#FFFBEB] text-[#D97706] border-[#F59E0B]/30',
    badgeBorder: 'border-[#F59E0B]/40'
  },
  parks: {
    id: 'parks',
    name: 'Parks & Public Amenities',
    department: 'Department of Parks, Recreation & Green Spaces',
    description: 'Fallen trees blocking pathways, broken playground equipment, overgrown grass in public spaces.',
    iconName: 'Trees',
    slaHours: 48,
    color: 'text-[#005EA8]',
    accentBg: 'bg-[#F0F7FC] text-[#005EA8] border-[#005EA8]/30',
    badgeBorder: 'border-[#005EA8]/40'
  },
  health: {
    id: 'health',
    name: 'Public Health & Safety',
    department: 'Directorate of Public Health & Sanitation',
    description: 'Stagnant water breeding mosquitoes, food safety violations, chemical runoff, noise pollution.',
    iconName: 'ShieldAlert',
    slaHours: 24,
    color: 'text-[#DC2626]',
    accentBg: 'bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/30',
    badgeBorder: 'border-[#DC2626]/40'
  }
};

export const MUNICIPAL_WARDS = [
  'Central Business District (CBD)',
  'Westlands / Parklands',
  'Kilimani / Kileleshwa',
  'Eastleigh / Kamukunji',
  'Langata / Karen',
  'Ruaraka / Kasarani',
  'Embakasi Central',
  'Dagoretti North'
];

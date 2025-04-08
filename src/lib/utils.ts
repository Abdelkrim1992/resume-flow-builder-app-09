
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, format: 'short' | 'medium' | 'long' = 'medium') {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    case 'long':
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
    case 'medium':
    default:
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
  }
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function calculateCompletionPercentage(requiredFields: Record<string, any>, totalFields: number): number {
  const filledFields = Object.values(requiredFields).filter(Boolean).length;
  return Math.round((filledFields / totalFields) * 100);
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

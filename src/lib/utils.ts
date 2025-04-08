
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, format: 'short' | 'medium' | 'long' = 'medium') {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      // Try to handle YYYY-MM format
      if (dateString.match(/^\d{4}-\d{2}$/)) {
        const [year, month] = dateString.split('-').map(Number);
        const newDate = new Date(year, month - 1);
        
        switch (format) {
          case 'short':
            return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(newDate);
          case 'long':
            return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(newDate);
          case 'medium':
          default:
            return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(newDate);
        }
      }
      return dateString; // Return original string if parsing fails
    }
    
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
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return the original string on error
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

export function getFormattedDateRange(startDate: string, endDate?: string, current?: boolean): string {
  const start = formatDate(startDate, 'short');
  
  if (current) {
    return `${start} - Present`;
  }
  
  if (endDate) {
    const end = formatDate(endDate, 'short');
    return `${start} - ${end}`;
  }
  
  return start;
}

export function generateResumeTemplateColor(templateId: number): string {
  const colors = [
    '#003366', // 1: Classic Professional
    '#1a4d80', // 2: Modern Executive
    '#6c757d', // 3: Minimal Elegant
    '#8e44ad', // 4: Creative Portfolio
    '#2c3e50', // 5: Technical Specialist
    '#3498db', // 6: Simple Graduate
    '#16a085', // 7: Modern Digital
    '#e74c3c', // 8: Startup Innovator
  ];
  
  const index = (templateId - 1) % colors.length;
  return colors[index];
}

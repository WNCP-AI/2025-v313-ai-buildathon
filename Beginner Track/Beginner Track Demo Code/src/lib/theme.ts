// Theme constants for consistent styling across the application

export const THEME_CONSTANTS = {
  // Spacing scale (based on 8pt grid)
  spacing: {
    xs: "4px",
    sm: "8px", 
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "40px",
    "3xl": "48px"
  },
  
  // Card spacing
  card: {
    padding: "16px",
    gap: "24px"
  },
  
  // Animation durations
  animations: {
    fast: "0.15s",
    normal: "0.3s", 
    slow: "0.5s"
  },
  
  // Border radius scale
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px"
  },
  
  // Shadow scales
  shadows: {
    card: "0 2px 8px rgba(0,0,0,0.04)",
    hover: "0 4px 12px rgba(0,0,0,0.08)", 
    focus: "0 0 0 2px hsl(var(--ring))"
  },
  
  // Typography scales
  typography: {
    sizes: {
      xs: "12px",
      sm: "14px", 
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "28px"
    },
    lineHeights: {
      tight: "1.2",
      normal: "1.5", 
      relaxed: "1.75"
    }
  }
} as const;

// Service category mapping
export const SERVICE_CATEGORIES = {
  food_delivery: "Food Delivery",
  courier_parcel: "Courier & Parcel", 
  aerial_imaging: "Aerial Imaging",
  site_mapping: "Site Mapping"
} as const;

// Status color mappings
export const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200", 
  cancelled: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200"
} as const;
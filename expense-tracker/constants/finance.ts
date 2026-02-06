export const CATEGORIES = {
  income: [
    { id: 'kuber', label: 'KUBER Revenue', gradient: ['#22C55E', '#16A34A'] as const },
    { id: 'nutrify', label: 'Nutrify Revenue', gradient: ['#22C55E', '#16A34A'] as const },
    { id: 'salary', label: 'Salary', gradient: ['#3B82F6', '#2563EB'] as const },
    { id: 'other', label: 'Other', gradient: ['#8B5CF6', '#7C3AED'] as const }
  ],
  expense: [
    { id: 'food', label: 'Food', gradient: ['#F87171', '#EF4444'] as const },
    { id: 'transport', label: 'Transport', gradient: ['#FB923C', '#F97316'] as const },
    { id: 'bills', label: 'Bills', gradient: ['#A78BFA', '#8B5CF6'] as const },
    { id: 'misc', label: 'Misc', gradient: ['#6B7280', '#4B5563'] as const }
  ]
};

export const THEME = {
  // Background - Pure OLED Black with subtle depth
  background: '#000000',
  backgroundSecondary: '#050505', // Slightly lighter for contrast

  // Advanced Glassmorphism
  glass: {
    background: 'rgba(255, 255, 255, 0.03)', // More subtle
    border: 'rgba(255, 255, 255, 0.08)', // Thinner, crisper border
    backdrop: 'blur(30px)', // Heavier blur for depth
    backgroundLight: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.12)',
    input: 'rgba(255, 255, 255, 0.03)', // For input fields
  },

  // Vibrant Neon Accents
  primary: '#00E676', // Electric Emerald
  primaryLight: '#69F0AE',
  primaryDark: '#00C853',
  primaryGlow: 'rgba(0, 230, 118, 0.4)', // For glow effects

  danger: '#FF5252', // Electric Coral
  dangerLight: '#FF8A80',
  dangerDark: '#D50000',
  dangerGlow: 'rgba(255, 82, 82, 0.4)',

  // Gradients (typed as tuples for expo-linear-gradient)
  gradients: {
    // Subtle, rich gradients
    primary: ['#00C853', '#00E676'] as const,
    danger: ['#D50000', '#FF5252'] as const,
    glass: ['rgba(255, 255, 255, 0.07)', 'rgba(255, 255, 255, 0.02)'] as const,
    glassActive: ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.05)'] as const,
    // Accent gradients
    income: ['#00C853', '#69F0AE'] as const,
    expense: ['#D50000', '#FF8A80'] as const,
    card: ['#1A1A1A', '#000000'] as const, // Subtle card gradient
  },

  // Text & Typography
  text: '#FFFFFF',
  textSecondary: '#888888', // More neutral grey
  textMuted: '#555555',

  // Borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.15)',

  // Shadows - handled by Platform.select in individual components
  shadow: {
    small: {},
    medium: {},
    large: {},
  },

  // Refined Animation durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 450,
    spring: {
      damping: 15,
      mass: 1,
      stiffness: 100,
    }
  },

  // Platform specific
  touchTarget: 48, // Larger for easier tapping

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  }
};
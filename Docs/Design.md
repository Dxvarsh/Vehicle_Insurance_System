# 🎨 Vehicle Insurance Management System - Design Guide

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Layout & Grid System](#layout--grid-system)
5. [Components Library](#components-library)
6. [Dashboard Design Principles](#dashboard-design-principles)
7. [Page-Specific Design Guidelines](#page-specific-design-guidelines)
8. [Responsive Design Strategy](#responsive-design-strategy)
9. [Animations & Micro-interactions](#animations--micro-interactions)
10. [Accessibility Guidelines](#accessibility-guidelines)
11. [Design Best Practices](#design-best-practices)

---

## Design Philosophy

### Core Principles
**Trust-First Design**: Insurance is built on trust. Every design decision should reinforce credibility, transparency, and reliability.

**Clarity Over Complexity**: Simplify insurance jargon and complex processes through intuitive visual hierarchies and clear communication.

**Modern Professionalism**: Balance contemporary aesthetics with professional reliability - avoid looking overly playful while maintaining approachability.

**User-Centric Approach**: Design for three distinct user types (Admin, Staff, Customer) with role-appropriate interfaces.

### Design Values
- **Transparency**: Clear pricing, straightforward information
- **Efficiency**: Reduce clicks, streamline workflows
- **Accessibility**: Inclusive design for all users
- **Responsiveness**: Mobile-first approach
- **Trust**: Consistent, professional, secure-feeling interfaces

---

## Color System

### Primary Palette

```javascript
primary: {
  50: '#e8edf7',   // Very light - backgrounds, hover states
  100: '#c5d0ec',  // Light - subtle backgrounds
  200: '#9fb1df',  // Medium-light - borders, dividers
  300: '#7992d2',  // Medium - secondary buttons
  400: '#5c7ac8',  // Medium-dark - active states
  500: '#325bb5',  // Main Brand Color - primary buttons, headers
  600: '#2c51a3',  // Dark - hover on primary
  700: '#24438a',  // Darker - pressed states
  800: '#1d3671',  // Very dark - text on light backgrounds
  900: '#142550',  // Deepest - high-contrast elements
}
```

### Semantic Colors

```javascript
colors: {
  // Status Colors
  success: {
    light: '#dcfce7',
    main: '#16a34a',
    dark: '#15803d',
  },
  warning: {
    light: '#fef3c7',
    main: '#f59e0b',
    dark: '#d97706',
  },
  danger: {
    light: '#fee2e2',
    main: '#dc2626',
    dark: '#b91c1c',
  },
  info: {
    light: '#e0f2fe',
    main: '#0ea5e9',
    dark: '#0284c7',
  },
  
  // Neutral/UI Colors
  background: {
    primary: '#f8fafc',    // Main background
    secondary: '#f1f5f9',  // Card backgrounds
    tertiary: '#e2e8f0',   // Subtle dividers
  },
  surface: {
    primary: '#ffffff',    // Cards, modals
    secondary: '#fafbfc',  // Nested surfaces
    elevated: '#ffffff',   // Elevated cards (with shadow)
  },
  text: {
    primary: '#1e293b',    // Main text
    secondary: '#64748b',  // Supporting text
    tertiary: '#94a3b8',   // Disabled text
    inverse: '#ffffff',    // Text on dark backgrounds
  },
  border: {
    light: '#e2e8f0',
    main: '#cbd5e1',
    dark: '#94a3b8',
  }
}
```

### Color Usage Guidelines

**Primary Blue (#325bb5)**
- Primary action buttons (Purchase Policy, Submit Claim)
- Navigation active states
- Important CTAs
- Progress indicators
- Links

**Success Green (#16a34a)**
- Approved status
- Payment successful
- Claim approved
- Policy active badges
- Positive notifications

**Warning Orange (#f59e0b)**
- Policy expiring soon
- Payment pending
- Under review status
- Important alerts

**Danger Red (#dc2626)**
- Rejected claims
- Failed payments
- Expired policies
- Error messages
- Destructive actions (Delete)

**Info Blue (#0ea5e9)**
- General notifications
- Informational tooltips
- Help text
- Neutral system messages

### Color Combinations

**DO's:**
- Use primary blue with white for high contrast CTAs
- Pair success green with light green backgrounds for status badges
- Use neutral grays for secondary information
- Maintain WCAG AA contrast ratios (4.5:1 for text)

**DON'Ts:**
- Don't use red and green together (colorblind accessibility)
- Avoid using too many bright colors in one view
- Don't use color as the only indicator of status (add icons/text)
- Avoid pure black (#000000) - use text.primary instead

---

## Typography

### Font Families

**Primary: Inter**
- Professional, highly legible
- Excellent for UI elements and body text
- Variable font support for performance

**Alternative: Poppins**
- Slightly more geometric and friendly
- Great for headings and marketing content
- Use if brand needs more warmth

**Recommendation**: Use **Inter** for the entire application for consistency.

### Type Scale

```css
/* Headings */
--text-display: 3.5rem;    /* 56px - Hero headings */
--text-h1: 2.5rem;         /* 40px - Page titles */
--text-h2: 2rem;           /* 32px - Section headers */
--text-h3: 1.5rem;         /* 24px - Card headers */
--text-h4: 1.25rem;        /* 20px - Subsections */
--text-h5: 1.125rem;       /* 18px - Small headings */
--text-h6: 1rem;           /* 16px - Tiny headings */

/* Body Text */
--text-base: 1rem;         /* 16px - Default body */
--text-sm: 0.875rem;       /* 14px - Small text, labels */
--text-xs: 0.75rem;        /* 12px - Captions, helper text */

/* Special */
--text-button: 0.875rem;   /* 14px - Button text */
--text-input: 1rem;        /* 16px - Input fields */
```

### Font Weights

```css
--font-light: 300;      /* Subtle text, large headings */
--font-normal: 400;     /* Body text */
--font-medium: 500;     /* Emphasized text */
--font-semibold: 600;   /* Subheadings, button labels */
--font-bold: 700;       /* Headings, important labels */
```

### Line Heights

```css
--leading-tight: 1.25;    /* Headings */
--leading-normal: 1.5;    /* Body text */
--leading-relaxed: 1.75;  /* Long-form content */
```

### Typography Usage

**Page Titles**: H1 (2.5rem, Bold, Primary Text)
**Section Headers**: H2 (2rem, Semibold, Primary Text)
**Card Titles**: H3 (1.5rem, Semibold, Primary Text)
**Body Text**: Base (1rem, Normal, Primary Text)
**Supporting Text**: Small (0.875rem, Normal, Secondary Text)
**Captions**: XS (0.75rem, Normal, Tertiary Text)

### Example Hierarchy

```jsx
<h1 className="text-h1 font-bold text-primary">My Insurance Dashboard</h1>
<h2 className="text-h2 font-semibold text-primary mt-8">Active Policies</h2>
<h3 className="text-h3 font-semibold text-primary">Policy Details</h3>
<p className="text-base text-secondary leading-normal">
  Your comprehensive insurance coverage details are shown below.
</p>
<span className="text-sm text-tertiary">Last updated: 2 hours ago</span>
```

---

## Layout & Grid System

### Container Widths

```css
--container-sm: 640px;    /* Mobile landscape, small tablets */
--container-md: 768px;    /* Tablets */
--container-lg: 1024px;   /* Desktop */
--container-xl: 1280px;   /* Large desktop */
--container-2xl: 1536px;  /* Extra large desktop */
```

**Recommended Max Width**: 1280px for main content (prevents excessive line lengths)

### Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px - Base unit */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Grid System

**12-Column Grid**
- Use for complex layouts (dashboards, forms)
- Flexible and responsive
- Standard industry practice

**Usage Examples:**

```jsx
/* Two-column layout (Desktop: 8-4, Tablet: Full width) */
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <div className="lg:col-span-8">
    {/* Main content */}
  </div>
  <div className="lg:col-span-4">
    {/* Sidebar */}
  </div>
</div>

/* Three-column card grid */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card />
  <Card />
  <Card />
</div>
```

### White Space Guidelines

**Generous Spacing**: Modern designs breathe - don't cram elements together

- **Between sections**: 48px - 64px
- **Between cards**: 24px - 32px
- **Inside cards**: 24px padding
- **Form fields**: 16px - 20px vertical spacing
- **Button groups**: 12px - 16px gap

### Layout Patterns

**Dashboard Layout**
```
┌─────────────────────────────────────────┐
│            Top Navigation               │
├──────┬──────────────────────────────────┤
│      │                                  │
│ Side │        Main Content              │
│ Nav  │         (Dashboard)              │
│      │                                  │
└──────┴──────────────────────────────────┘
```

**Form Layout**
```
┌───────────────────────────────┐
│      Form Title & Subtitle    │
├───────────────────────────────┤
│                               │
│    Form Fields (2-column)     │
│                               │
│    ┌──────────┐ ┌──────────┐  │
│    │  Field   │ │  Field   │  │
│    └──────────┘ └──────────┘  │
│                               │
│    Action Buttons (Right)     │
└───────────────────────────────┘
```

---

## Components Library

### Buttons

#### Primary Button
- **Use**: Main actions (Purchase, Submit, Save)
- **Style**: Solid primary blue background, white text
- **States**: Default, Hover, Active, Disabled, Loading

```jsx
<button className="
  bg-primary-500 hover:bg-primary-600 active:bg-primary-700
  text-white font-semibold
  px-6 py-3 rounded-lg
  transition-colors duration-200
  disabled:bg-gray-300 disabled:cursor-not-allowed
  shadow-sm hover:shadow-md
">
  Purchase Policy
</button>
```

#### Secondary Button
- **Use**: Alternative actions (Cancel, Go Back)
- **Style**: Outline with primary border, primary text

```jsx
<button className="
  border-2 border-primary-500 text-primary-500
  hover:bg-primary-50 active:bg-primary-100
  font-semibold px-6 py-3 rounded-lg
  transition-all duration-200
">
  Cancel
</button>
```

#### Tertiary/Ghost Button
- **Use**: Less important actions (View Details, Learn More)
- **Style**: Text only, no background

```jsx
<button className="
  text-primary-500 hover:text-primary-600 hover:bg-primary-50
  font-medium px-4 py-2 rounded-lg
  transition-all duration-200
">
  Learn More →
</button>
```

#### Danger Button
- **Use**: Destructive actions (Delete, Remove)
- **Style**: Red background or outline

```jsx
<button className="
  bg-danger-main hover:bg-danger-dark
  text-white font-semibold px-6 py-3 rounded-lg
  transition-colors duration-200
">
  Delete Vehicle
</button>
```

#### Button Sizes

```jsx
/* Small */
<button className="px-4 py-2 text-sm">Small</button>

/* Medium (Default) */
<button className="px-6 py-3 text-base">Medium</button>

/* Large */
<button className="px-8 py-4 text-lg">Large</button>
```

### Cards

#### Basic Card
```jsx
<div className="
  bg-white rounded-xl shadow-sm border border-gray-200
  p-6 hover:shadow-md transition-shadow duration-200
">
  <h3 className="text-h3 font-semibold mb-2">Card Title</h3>
  <p className="text-secondary">Card content goes here</p>
</div>
```

#### Stat Card (Dashboard KPI)
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-secondary font-medium">Total Policies</p>
      <p className="text-3xl font-bold text-primary mt-1">1,247</p>
      <p className="text-sm text-success mt-2 flex items-center">
        <span className="mr-1">↑</span> 12% from last month
      </p>
    </div>
    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
      <svg className="w-6 h-6 text-primary-500">
        {/* Icon */}
      </svg>
    </div>
  </div>
</div>
```

#### Policy Card
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="text-lg font-semibold text-primary">Comprehensive Coverage</h3>
      <p className="text-sm text-secondary">24-month policy</p>
    </div>
    <span className="bg-success-light text-success-dark px-3 py-1 rounded-full text-xs font-medium">
      Active
    </span>
  </div>
  <div className="space-y-2 mb-4">
    <div className="flex justify-between text-sm">
      <span className="text-secondary">Coverage Type:</span>
      <span className="text-primary font-medium">Comprehensive</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-secondary">Premium:</span>
      <span className="text-primary font-semibold">₹15,000/year</span>
    </div>
  </div>
  <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 rounded-lg transition-colors">
    View Details
  </button>
</div>
```

### Form Elements

#### Input Field
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-primary mb-2">
    Vehicle Number
  </label>
  <input
    type="text"
    placeholder="GJ01AB1234"
    className="
      w-full px-4 py-3 rounded-lg border border-gray-300
      focus:border-primary-500 focus:ring-2 focus:ring-primary-100
      transition-all duration-200
      text-base text-primary
      placeholder-gray-400
    "
  />
  <p className="text-xs text-secondary mt-1">Enter your vehicle registration number</p>
</div>
```

#### Select Dropdown
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-primary mb-2">
    Vehicle Type
  </label>
  <select className="
    w-full px-4 py-3 rounded-lg border border-gray-300
    focus:border-primary-500 focus:ring-2 focus:ring-primary-100
    transition-all duration-200
    text-base text-primary
    bg-white cursor-pointer
  ">
    <option>Select vehicle type</option>
    <option>2-Wheeler</option>
    <option>4-Wheeler</option>
    <option>Commercial</option>
  </select>
</div>
```

#### Checkbox
```jsx
<label className="flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="
      w-5 h-5 rounded border-gray-300
      text-primary-500 focus:ring-primary-500
      cursor-pointer
    "
  />
  <span className="ml-3 text-sm text-primary">
    I agree to the terms and conditions
  </span>
</label>
```

#### Radio Button
```jsx
<div className="space-y-3">
  <label className="flex items-center cursor-pointer">
    <input
      type="radio"
      name="coverage"
      className="w-4 h-4 text-primary-500 focus:ring-primary-500"
    />
    <div className="ml-3">
      <span className="text-sm font-medium text-primary">Third-Party</span>
      <span className="text-xs text-secondary block">Basic coverage required by law</span>
    </div>
  </label>
</div>
```

### Status Badges

```jsx
/* Success */
<span className="bg-success-light text-success-dark px-3 py-1 rounded-full text-xs font-semibold">
  Approved
</span>

/* Warning */
<span className="bg-warning-light text-warning-dark px-3 py-1 rounded-full text-xs font-semibold">
  Pending
</span>

/* Danger */
<span className="bg-danger-light text-danger-dark px-3 py-1 rounded-full text-xs font-semibold">
  Rejected
</span>

/* Info */
<span className="bg-info-light text-info-dark px-3 py-1 rounded-full text-xs font-semibold">
  Under Review
</span>

/* Neutral */
<span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
  Expired
</span>
```

### Alerts/Notifications

```jsx
/* Success Alert */
<div className="bg-success-light border-l-4 border-success-main p-4 rounded-r-lg">
  <div className="flex items-start">
    <svg className="w-5 h-5 text-success-main mt-0.5" fill="currentColor">
      {/* Success Icon */}
    </svg>
    <div className="ml-3">
      <h4 className="text-sm font-semibold text-success-dark">Payment Successful</h4>
      <p className="text-sm text-success-dark mt-1">
        Your premium payment has been processed successfully.
      </p>
    </div>
  </div>
</div>

/* Warning Alert */
<div className="bg-warning-light border-l-4 border-warning-main p-4 rounded-r-lg">
  <div className="flex items-start">
    <svg className="w-5 h-5 text-warning-main mt-0.5" fill="currentColor">
      {/* Warning Icon */}
    </svg>
    <div className="ml-3">
      <h4 className="text-sm font-semibold text-warning-dark">Policy Expiring Soon</h4>
      <p className="text-sm text-warning-dark mt-1">
        Your policy will expire in 7 days. Please renew to avoid coverage gap.
      </p>
    </div>
  </div>
</div>

/* Error Alert */
<div className="bg-danger-light border-l-4 border-danger-main p-4 rounded-r-lg">
  <div className="flex items-start">
    <svg className="w-5 h-5 text-danger-main mt-0.5" fill="currentColor">
      {/* Error Icon */}
    </svg>
    <div className="ml-3">
      <h4 className="text-sm font-semibold text-danger-dark">Payment Failed</h4>
      <p className="text-sm text-danger-dark mt-1">
        Unable to process payment. Please try again or contact support.
      </p>
    </div>
  </div>
</div>
```

### Tables

```jsx
<div className="overflow-x-auto rounded-xl border border-gray-200">
  <table className="min-w-full bg-white">
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
          Policy ID
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
          Vehicle
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
          Amount
        </th>
        <th className="px-6 py-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 text-sm text-primary font-medium">
          POL-001234
        </td>
        <td className="px-6 py-4 text-sm text-secondary">
          GJ01AB1234
        </td>
        <td className="px-6 py-4">
          <span className="bg-success-light text-success-dark px-3 py-1 rounded-full text-xs font-semibold">
            Active
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-primary font-semibold">
          ₹15,000
        </td>
        <td className="px-6 py-4 text-right text-sm">
          <button className="text-primary-500 hover:text-primary-600 font-medium">
            View
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Modal/Dialog

```jsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
    {/* Header */}
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-primary">Confirm Purchase</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="currentColor">
            {/* Close Icon */}
          </svg>
        </button>
      </div>
    </div>
    
    {/* Body */}
    <div className="px-6 py-4">
      <p className="text-secondary">
        Are you sure you want to purchase this insurance policy?
      </p>
    </div>
    
    {/* Footer */}
    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
      <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
        Cancel
      </button>
      <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### Loading States

```jsx
/* Skeleton Loader */
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

/* Spinner */
<div className="flex items-center justify-center">
  <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
</div>

/* Button Loading State */
<button className="bg-primary-500 text-white px-6 py-3 rounded-lg flex items-center" disabled>
  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
    {/* Spinner Icon */}
  </svg>
  Processing...
</button>
```

---

## Dashboard Design Principles

### Key Metrics (KPI Cards)

**Layout**: Grid of 2-4 cards at the top of dashboard
**Elements**:
- Large number (primary metric)
- Descriptive label
- Trend indicator (↑ 12% green or ↓ 5% red)
- Icon representing the metric
- Subtle background color

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Total Policies */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-secondary font-medium">Total Policies</p>
        <p className="text-3xl font-bold text-primary mt-1">1,247</p>
        <p className="text-sm text-success mt-2 flex items-center">
          <span className="mr-1">↑</span> 12% vs last month
        </p>
      </div>
      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
        <svg className="w-6 h-6 text-primary-500" fill="currentColor">
          {/* Policy Icon */}
        </svg>
      </div>
    </div>
  </div>

  {/* Active Claims */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-secondary font-medium">Active Claims</p>
        <p className="text-3xl font-bold text-primary mt-1">34</p>
        <p className="text-sm text-warning mt-2 flex items-center">
          <span className="mr-1">↑</span> 3 new today
        </p>
      </div>
      <div className="w-12 h-12 bg-warning-light rounded-lg flex items-center justify-center">
        <svg className="w-6 h-6 text-warning-main" fill="currentColor">
          {/* Claim Icon */}
        </svg>
      </div>
    </div>
  </div>
  
  {/* Monthly Revenue */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-secondary font-medium">Monthly Revenue</p>
        <p className="text-3xl font-bold text-primary mt-1">₹2.4M</p>
        <p className="text-sm text-success mt-2 flex items-center">
          <span className="mr-1">↑</span> 18% vs last month
        </p>
      </div>
      <div className="w-12 h-12 bg-success-light rounded-lg flex items-center justify-center">
        <svg className="w-6 h-6 text-success-main" fill="currentColor">
          {/* Revenue Icon */}
        </svg>
      </div>
    </div>
  </div>

  {/* Pending Renewals */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-secondary font-medium">Pending Renewals</p>
        <p className="text-3xl font-bold text-primary mt-1">89</p>
        <p className="text-sm text-info mt-2 flex items-center">
          <span className="mr-1">→</span> 12 expiring soon
        </p>
      </div>
      <div className="w-12 h-12 bg-info-light rounded-lg flex items-center justify-center">
        <svg className="w-6 h-6 text-info-main" fill="currentColor">
          {/* Renewal Icon */}
        </svg>
      </div>
    </div>
  </div>
</div>
```

### Charts & Data Visualization

**Recommended Library**: Recharts (React-friendly, customizable)

**Chart Types to Use**:

1. **Line Chart**: Premium collection over time, trends
2. **Bar Chart**: Policy comparison by type, monthly claims
3. **Donut/Pie Chart**: Policy distribution by coverage type (use sparingly)
4. **Area Chart**: Revenue growth over time

**Chart Design Guidelines**:
- Use primary blue (#325bb5) as main color
- Add subtle gradients for visual appeal
- Include clear axis labels
- Show tooltips on hover
- Keep it simple - avoid 3D effects
- Use consistent colors across all charts

```jsx
/* Example Line Chart */
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <h3 className="text-lg font-semibold text-primary mb-4">Premium Collection Trend</h3>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
      <XAxis dataKey="month" stroke="#64748b" />
      <YAxis stroke="#64748b" />
      <Tooltip 
        contentStyle={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      />
      <Line 
        type="monotone" 
        dataKey="amount" 
        stroke="#325bb5" 
        strokeWidth={2}
        dot={{ fill: '#325bb5', r: 4 }}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
```

### Dashboard Layout Best Practices

1. **Top Section**: KPI cards showing key metrics
2. **Middle Section**: Charts and graphs (2-column or single column)
3. **Bottom Section**: Recent activities, tables, notifications

**Visual Hierarchy**:
- Most important info at the top
- Use larger cards for critical metrics
- Group related information together
- Maintain consistent spacing

**Interactivity**:
- Make cards clickable for detailed views
- Add hover effects to show more info
- Include quick action buttons
- Show real-time updates with subtle animations

---

## Page-Specific Design Guidelines

### 1. Authentication Pages (Login/Register)

**Layout**: Centered card with split screen on desktop

```
Desktop:                      Mobile:
┌──────────┬──────────┐      ┌──────────┐
│          │          │      │   Logo   │
│  Graphic │   Form   │      │   Form   │
│  or Info │          │      │          │
└──────────┴──────────┘      └──────────┘
```

**Design Elements**:
- Large brand logo at top
- Clean, minimal form
- Social proof (if applicable)
- Clear CTAs
- Link to alternative action (Login ↔ Register)
- Password strength indicator
- Error messages inline with fields

**Example Login Page**:
```jsx
<div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
  <div className="max-w-md w-full">
    {/* Logo */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-primary-900">SecureInsure</h1>
      <p className="text-secondary mt-2">Welcome back! Please login to your account.</p>
    </div>
    
    {/* Form Card */}
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-primary-500 rounded" />
            <span className="ml-2 text-sm text-secondary">Remember me</span>
          </label>
          <a href="#" className="text-sm text-primary-500 hover:text-primary-600">
            Forgot password?
          </a>
        </div>
        
        <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-colors">
          Sign In
        </button>
      </form>
      
      <p className="text-center text-sm text-secondary mt-6">
        Don't have an account? 
        <a href="#" className="text-primary-500 font-medium ml-1 hover:text-primary-600">Sign up</a>
      </p>
    </div>
  </div>
</div>
```

### 2. Customer Dashboard

**Sections**:
1. Welcome header with user name
2. Quick actions (Purchase Policy, File Claim, Add Vehicle)
3. Policy summary cards
4. Upcoming renewals
5. Recent notifications

**Design Pattern**:
```jsx
<div className="min-h-screen bg-background-primary">
  {/* Top Navigation */}
  <nav className="bg-white border-b border-gray-200">
    {/* Nav content */}
  </nav>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Welcome Section */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-primary">Welcome back, Rahul!</h1>
      <p className="text-secondary mt-1">Here's your insurance overview</p>
    </div>
    
    {/* Quick Actions */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button className="bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-xl flex items-center justify-between transition-colors">
        <span className="font-semibold">Purchase New Policy</span>
        <svg className="w-5 h-5" fill="currentColor">{/* Icon */}</svg>
      </button>
      <button className="bg-white hover:bg-gray-50 text-primary border-2 border-gray-200 p-4 rounded-xl flex items-center justify-between transition-colors">
        <span className="font-semibold">File a Claim</span>
        <svg className="w-5 h-5" fill="currentColor">{/* Icon */}</svg>
      </button>
      <button className="bg-white hover:bg-gray-50 text-primary border-2 border-gray-200 p-4 rounded-xl flex items-center justify-between transition-colors">
        <span className="font-semibold">Add Vehicle</span>
        <svg className="w-5 h-5" fill="currentColor">{/* Icon */}</svg>
      </button>
    </div>
    
    {/* Active Policies */}
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-primary mb-4">Your Active Policies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Policy Cards */}
      </div>
    </div>
    
    {/* Notifications & Renewals */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Recent Notifications</h3>
        {/* Notification list */}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Upcoming Renewals</h3>
        {/* Renewal list */}
      </div>
    </div>
  </div>
</div>
```

### 3. Policy Listing Page

**Features**:
- Search bar
- Filters (Coverage Type, Duration, Vehicle Type)
- Sort options
- Grid or list view toggle
- Policy cards with key information

**Card Design**:
- Policy name (prominent)
- Coverage type badge
- Duration
- Base premium (large, bold)
- Key features (bullet points)
- "View Details" or "Purchase" button

### 4. Policy Detail Page

**Layout**:
```
┌─────────────────────────────────┐
│   Policy Header + Purchase CTA  │
├──────────────┬──────────────────┤
│              │                  │
│   Policy     │   Premium        │
│   Details    │   Calculator     │
│              │   (Sticky)       │
│              │                  │
└──────────────┴──────────────────┘
```

**Sections**:
1. Hero section with policy name and CTA
2. Coverage details
3. Premium calculator (sticky sidebar)
4. Terms and conditions (accordion)
5. FAQs

### 5. Premium Calculation & Payment

**Premium Calculator**:
- Visual breakdown of calculation
- Show multipliers clearly
- Real-time updates as inputs change
- Final amount prominently displayed

**Payment Flow**:
1. Review calculated premium
2. Select payment method
3. Enter payment details
4. Confirm and pay
5. Success confirmation with receipt

**Design**:
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <h3 className="text-xl font-semibold text-primary mb-4">Premium Breakdown</h3>
  
  {/* Base Amount */}
  <div className="flex justify-between py-3 border-b border-gray-200">
    <span className="text-secondary">Base Amount</span>
    <span className="font-semibold text-primary">₹10,000</span>
  </div>
  
  {/* Vehicle Type Multiplier */}
  <div className="flex justify-between py-3 border-b border-gray-200">
    <span className="text-secondary">Vehicle Type (4-Wheeler)</span>
    <span className="font-semibold text-primary">× 1.0</span>
  </div>
  
  {/* Coverage Multiplier */}
  <div className="flex justify-between py-3 border-b border-gray-200">
    <span className="text-secondary">Coverage (Comprehensive)</span>
    <span className="font-semibold text-primary">× 1.0</span>
  </div>
  
  {/* Age Depreciation */}
  <div className="flex justify-between py-3 border-b border-gray-200">
    <span className="text-secondary">Age Depreciation (2 years)</span>
    <span className="font-semibold text-danger">− 5%</span>
  </div>
  
  {/* Total */}
  <div className="flex justify-between py-4 mt-4">
    <span className="text-lg font-semibold text-primary">Total Premium</span>
    <span className="text-2xl font-bold text-primary-500">₹9,500</span>
  </div>
  
  <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg mt-4 transition-colors">
    Proceed to Payment
  </button>
</div>
```

### 6. Claim Management

**Claim Submission Form**:
- Step-by-step wizard (multi-step form)
- File upload area with preview
- Clear instructions
- Progress indicator

**Claim Status Tracking**:
- Timeline view showing claim progress
- Status badges
- Admin remarks section
- Document viewer

**Timeline Design**:
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <h3 className="text-xl font-semibold text-primary mb-6">Claim Timeline</h3>
  
  <div className="space-y-6">
    {/* Step 1 - Completed */}
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-success-main rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor">{/* Check Icon */}</svg>
        </div>
      </div>
      <div className="ml-4">
        <h4 className="text-sm font-semibold text-primary">Claim Submitted</h4>
        <p className="text-sm text-secondary">Feb 10, 2026 at 2:30 PM</p>
        <p className="text-sm text-secondary mt-1">Your claim has been received and is under review.</p>
      </div>
    </div>
    
    {/* Connector Line */}
    <div className="ml-5 w-0.5 h-6 bg-gray-300"></div>
    
    {/* Step 2 - In Progress */}
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-info-main rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white animate-spin" fill="currentColor">{/* Loading Icon */}</svg>
        </div>
      </div>
      <div className="ml-4">
        <h4 className="text-sm font-semibold text-primary">Under Review</h4>
        <p className="text-sm text-secondary">In Progress</p>
        <p className="text-sm text-secondary mt-1">Our team is reviewing your claim documents.</p>
      </div>
    </div>
    
    {/* Connector Line */}
    <div className="ml-5 w-0.5 h-6 bg-gray-300"></div>
    
    {/* Step 3 - Pending */}
    <div className="flex items-start opacity-50">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      </div>
      <div className="ml-4">
        <h4 className="text-sm font-semibold text-primary">Approval Decision</h4>
        <p className="text-sm text-secondary">Pending</p>
      </div>
    </div>
  </div>
</div>
```

### 7. Admin Dashboard

**Features**:
- Comprehensive KPI overview
- Multiple charts and graphs
- Data tables with filters
- Quick action buttons
- User management tools

**Layout**:
- Top row: 4-5 KPI cards
- Second row: Charts (line chart, bar chart)
- Third row: Recent activities table
- Sidebar: Quick filters and actions

### 8. Notification Center

**Design**:
- Grouped by type (Renewal, Claim, Payment, General)
- Unread indicator (dot or badge)
- Mark as read/unread action
- Delete option
- Filter by type and read status

```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200">
  {/* Header */}
  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
    <h2 className="text-xl font-semibold text-primary">Notifications</h2>
    <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
      Mark all as read
    </button>
  </div>
  
  {/* Notification List */}
  <div className="divide-y divide-gray-200">
    {/* Unread Notification */}
    <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer bg-primary-50">
      <div className="flex items-start">
        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3"></div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-primary">Policy Expiring Soon</h4>
              <p className="text-sm text-secondary mt-1">
                Your policy GJ01AB1234 will expire in 7 days. Renew now to avoid coverage gap.
              </p>
            </div>
            <span className="text-xs text-secondary ml-4 whitespace-nowrap">2h ago</span>
          </div>
          <div className="mt-2">
            <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
              Renew Now →
            </button>
          </div>
        </div>
      </div>
    </div>
    
    {/* Read Notification */}
    <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer">
      <div className="flex items-start">
        <div className="w-2 h-2 bg-transparent rounded-full mt-2 mr-3"></div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-primary">Payment Successful</h4>
              <p className="text-sm text-secondary mt-1">
                Your premium payment of ₹15,000 has been processed.
              </p>
            </div>
            <span className="text-xs text-secondary ml-4 whitespace-nowrap">1d ago</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## Responsive Design Strategy

### Breakpoints

```css
/* Tailwind default breakpoints */
sm: '640px',   /* Small tablets, large phones */
md: '768px',   /* Tablets */
lg: '1024px',  /* Small laptops */
xl: '1280px',  /* Desktops */
2xl: '1536px', /* Large desktops */
```

### Mobile-First Approach

**Start with mobile design, then enhance for larger screens**

```jsx
/* Mobile: Stack vertically */
<div className="flex flex-col gap-4">
  
/* Tablet: 2 columns */
<div className="flex flex-col md:flex-row gap-4">

/* Desktop: 3 columns */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Responsive Typography

```jsx
/* Mobile: 2rem, Desktop: 3rem */
<h1 className="text-2xl lg:text-3xl font-bold">
  
/* Mobile: 1rem, Desktop: 1.25rem */
<p className="text-base lg:text-lg">
```

### Responsive Navigation

**Desktop**: Horizontal navigation with all links visible
**Mobile**: Hamburger menu with slide-out drawer

```jsx
{/* Desktop Nav */}
<nav className="hidden lg:flex items-center space-x-6">
  <a href="#">Dashboard</a>
  <a href="#">Policies</a>
  <a href="#">Claims</a>
</nav>

{/* Mobile Menu Button */}
<button className="lg:hidden">
  <svg className="w-6 h-6">{/* Menu Icon */}</svg>
</button>
```

### Touch-Friendly Design

- Minimum tap target size: 44x44px
- Increase button padding on mobile
- Use larger form inputs (min height 48px)
- Add more spacing between interactive elements

### Performance Considerations

- Lazy load images
- Use responsive images (srcset)
- Optimize for mobile bandwidth
- Minimize animations on mobile

---

## Animations & Micro-interactions

### Transition Duration

```css
--duration-fast: 150ms;     /* Hover, active states */
--duration-normal: 200ms;   /* Default transitions */
--duration-slow: 300ms;     /* Modals, page transitions */
```

### Easing Functions

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);     /* Default */
--ease-out: cubic-bezier(0, 0, 0.2, 1);          /* Enter */
--ease-in: cubic-bezier(0.4, 0, 1, 1);           /* Exit */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Playful */
```

### Micro-interactions to Include

**Button Hover**:
```jsx
className="transform hover:scale-105 transition-transform duration-200"
```

**Card Hover**:
```jsx
className="hover:shadow-lg transition-shadow duration-300"
```

**Loading Skeleton**:
```jsx
className="animate-pulse bg-gray-200"
```

**Success State**:
```jsx
/* Checkmark animation */
className="animate-bounce"
```

**Notification Badge**:
```jsx
/* Pulse effect for unread count */
className="animate-ping"
```

**Page Transitions**:
- Fade in content when page loads
- Slide in from right for modals
- Slide down for dropdowns

**Form Validation**:
- Shake effect for errors
- Smooth color transition for success

### Animation Best Practices

**DO's**:
- Use subtle animations (don't distract)
- Provide visual feedback for interactions
- Animate meaningful state changes
- Keep animations under 300ms
- Use `prefers-reduced-motion` media query

**DON'Ts**:
- Don't animate everything
- Avoid jarring movements
- Don't use animations that cause layout shifts
- Avoid animations on initial page load (except loading states)

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

**Color Contrast**:
- Text on background: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- UI components: Minimum 3:1 ratio

**Keyboard Navigation**:
- All interactive elements must be keyboard accessible
- Visible focus indicators (outline or ring)
- Logical tab order
- Skip to main content link

**Screen Readers**:
- Semantic HTML (use proper heading hierarchy)
- Alt text for images
- ARIA labels for icon buttons
- ARIA live regions for dynamic content

**Forms**:
- Label every input
- Associate labels with inputs (for attribute)
- Provide clear error messages
- Use fieldset for radio/checkbox groups

### Focus States

```jsx
/* Visible focus indicator */
className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
```

### Semantic HTML

```jsx
/* Use proper heading hierarchy */
<h1>Main Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection</h3>

/* Use semantic elements */
<nav>, <main>, <article>, <aside>, <footer>
```

### ARIA Labels

```jsx
/* Icon button */
<button aria-label="Close modal">
  <svg>{/* X icon */}</svg>
</button>

/* Status indicators */
<div role="status" aria-live="polite">
  Policy updated successfully
</div>
```

### Image Alt Text

```jsx
/* Descriptive alt text */
<img src="policy.jpg" alt="Comprehensive insurance policy document" />

/* Decorative images */
<img src="decoration.svg" alt="" role="presentation" />
```

---

## Design Best Practices

### Visual Hierarchy

1. **Size**: Larger = more important
2. **Weight**: Bolder = more emphasis
3. **Color**: Brighter/darker = more attention
4. **Position**: Top/left = seen first
5. **Spacing**: More white space = more importance

### Consistency

- Use design system components everywhere
- Maintain consistent spacing
- Same interaction patterns across app
- Consistent terminology
- Uniform icon style

### Progressive Disclosure

- Show essential information first
- Hide advanced options behind "More" or accordions
- Use tooltips for additional context
- Multi-step forms for complex processes

### Error Prevention

- Clear labels and placeholders
- Input validation with helpful messages
- Confirmation dialogs for destructive actions
- Undo functionality where possible
- Auto-save for long forms

### Performance

- Optimize images (WebP format)
- Lazy load below-the-fold content
- Use skeleton loaders
- Minimize JavaScript bundle size
- Server-side rendering for initial load

### Trust Signals

- Display security badges
- Show customer testimonials
- Include trust indicators (SSL, certifications)
- Transparent pricing
- Clear privacy policy links

### Empty States

```jsx
/* No policies yet */
<div className="text-center py-12">
  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4">{/* Icon */}</svg>
  <h3 className="text-lg font-semibold text-primary mb-2">No policies yet</h3>
  <p className="text-secondary mb-6">Get started by purchasing your first insurance policy</p>
  <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg">
    Browse Policies
  </button>
</div>
```

### Loading States

```jsx
/* Table skeleton */
<div className="space-y-3">
  {[...Array(5)].map((_, i) => (
    <div key={i} className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  ))}
</div>
```

### Success States

```jsx
/* Payment success */
<div className="text-center py-12">
  <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
    <svg className="w-8 h-8 text-success-main">{/* Check Icon */}</svg>
  </div>
  <h3 className="text-2xl font-bold text-primary mb-2">Payment Successful!</h3>
  <p className="text-secondary mb-6">Your policy has been activated</p>
  <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg">
    View Policy Details
  </button>
</div>
```

---

## Implementation Checklist

### Before You Start
- [ ] Review design system thoroughly
- [ ] Set up Tailwind with custom theme
- [ ] Install required fonts (Inter/Poppins)
- [ ] Set up component library structure
- [ ] Configure color palette in Tailwind config

### During Development
- [ ] Use consistent spacing (4px base unit)
- [ ] Implement all components from design system
- [ ] Test on multiple screen sizes
- [ ] Verify color contrast ratios
- [ ] Add loading and error states
- [ ] Implement keyboard navigation
- [ ] Add ARIA labels where needed

### Before Launch
- [ ] Accessibility audit (WAVE, Lighthouse)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Performance optimization
- [ ] Check all interactions and animations
- [ ] Verify all forms work correctly
- [ ] Test with screen reader

---

## Tools & Resources

### Design Tools
- **Figma**: For mockups and prototypes
- **Coolors.co**: Color palette generator
- **Type Scale**: Typography scale calculator
- **Contrast Checker**: WCAG contrast ratio checker

### Development Tools
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Unstyled accessible components
- **Lucide Icons**: Clean, consistent icon set
- **Recharts**: React charting library

### Testing Tools
- **WAVE**: Accessibility evaluation tool
- **Lighthouse**: Performance and accessibility audit
- **BrowserStack**: Cross-browser testing
- **React DevTools**: Component debugging

---

## Final Notes

This design guide is a living document. As you build the application:

1. **Stay Consistent**: Follow the design system religiously
2. **User First**: Always prioritize user experience over aesthetics
3. **Iterate**: Gather feedback and improve
4. **Test Often**: Don't wait until the end to test
5. **Document Changes**: Update this guide when making design decisions

**Remember**: Great design is invisible. Users shouldn't notice the design - they should just find everything intuitive and easy to use.

---

**Version**: 1.0  
**Last Updated**: February 14, 2026  
**Primary Color**: #325bb5  
**Tech Stack**: MERN (MongoDB, Express.js, React.js, Node.js)  
**UI Framework**: Tailwind CSS
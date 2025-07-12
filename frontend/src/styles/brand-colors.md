# Invoom Brand Colors Guide

This document outlines the official brand colors for the Invoom application and their proper usage.

## Brand Colors

### Primary Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Navy Blue** | `#1a2a5c` | Primary brand color, sidebar, headers, form borders |
| **Yellow** | `#e6b830` | Primary CTA buttons, accents, highlights |
| **Dark** | `#121222` | Text, dark elements, secondary elements |
| **White** | `#ffffff` | Background, contrast text |

### Color Palette

```css
/* Primary Brand Colors */
--invoom-primary: #1a2a5c;     /* Navy Blue */
--invoom-secondary: #e6b830;   /* Yellow */
--invoom-dark: #121222;        /* Dark */
--invoom-white: #ffffff;       /* White */

/* Secondary Shades */
--invoom-secondary-hover: #d4a72c;  /* Darker yellow for hover states */
--invoom-primary-light: rgba(26, 42, 92, 0.1);  /* Light primary for backgrounds */
--invoom-secondary-light: rgba(230, 184, 48, 0.1);  /* Light secondary for backgrounds */
```

## Usage Guidelines

### Buttons

- **Primary Actions**: Use Yellow (`#e6b830`) for main CTAs like "Save", "Submit", "Connect"
- **Secondary Actions**: Use Navy Blue (`#1a2a5c`) for secondary actions like "Edit", "View", "Cancel"
- **Destructive Actions**: Use red for delete/destructive actions

### Typography

- **Headers**: Use Dark (`#121222`) for main headings
- **Body Text**: Use Dark (`#121222`) for body text
- **Secondary Text**: Use `#6c757d` for secondary/meta text
- **Links**: Use Yellow (`#e6b830`) for links and interactive text

### UI Components

- **Sidebar**: Navy Blue (`#1a2a5c`) background
- **Selected/Active States**: Yellow (`#e6b830`) for highlights
- **Form Elements**: Navy Blue (`#1a2a5c`) for focus states
- **Tables**: Light gray headers with Navy Blue hover states

## CSS Classes

### Utility Classes

```css
/* Background Colors */
.invoom-primary-bg { background-color: #1a2a5c !important; }
.invoom-secondary-bg { background-color: #e6b830 !important; }
.invoom-dark-bg { background-color: #121222 !important; }
.invoom-white-bg { background-color: #ffffff !important; }

/* Text Colors */
.invoom-primary-text { color: #1a2a5c !important; }
.invoom-secondary-text { color: #e6b830 !important; }
.invoom-dark-text { color: #121222 !important; }
.invoom-white-text { color: #ffffff !important; }
```

### Tailwind Classes

```css
/* Use these Tailwind classes for brand colors */
bg-invoom-primary     /* Navy Blue background */
bg-invoom-secondary   /* Yellow background */
bg-invoom-dark        /* Dark background */
bg-invoom-white       /* White background */

text-invoom-primary   /* Navy Blue text */
text-invoom-secondary /* Yellow text */
text-invoom-dark      /* Dark text */
text-invoom-white     /* White text */
```

## Components

### Ant Design Overrides

The following Ant Design components are automatically styled with brand colors:

- **Buttons**: Primary buttons use Yellow, Secondary buttons use Navy Blue
- **Form Controls**: Focus states use Navy Blue
- **Tabs**: Active tabs use Yellow
- **Menu**: Sidebar menu uses Navy Blue background with Yellow highlights
- **Tables**: Hover states use Navy Blue
- **Pagination**: Active states use Yellow

### Custom Components

When creating custom components, use the brand colors consistently:

```tsx
// Example usage in React components
<Button type="primary" className="invoom-secondary-bg">
  Primary Action
</Button>

<Button className="invoom-primary-bg invoom-white-text">
  Secondary Action
</Button>
```

## Typography

### Font Family

- **Primary Font**: Montserrat (loaded from Google Fonts)
- **Fallback**: system-ui, sans-serif

### Font Weights

- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Accessibility

- Ensure sufficient contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Navy Blue on White: ✅ Good contrast
- Yellow on White: ⚠️ Check contrast for text usage
- Dark on White: ✅ Excellent contrast
- White on Navy Blue: ✅ Good contrast

## Examples

### Card Component
```tsx
<Card className="border-invoom-primary">
  <Title className="invoom-dark-text">Card Title</Title>
  <Button type="primary">Primary Action</Button>
</Card>
```

### Form Component
```tsx
<Form>
  <Form.Item label="Field Name">
    <Input className="focus:border-invoom-primary" />
  </Form.Item>
  <Button type="primary">Submit</Button>
</Form>
```

## Migration Notes

- All existing blue colors (`#1e2a5c`) have been updated to Navy Blue (`#1a2a5c`)
- All existing yellow colors (`#f6b50a`, `#FFB800`) have been updated to Yellow (`#e6b830`)
- Primary buttons now use Yellow instead of Navy Blue for better CTA visibility
- Secondary buttons use Navy Blue for non-primary actions 
# Example Usage of Images from Public Folder

## In React Components

```jsx
import React from 'react';

const ExampleComponent = () => {
  return (
    <div>
      {/* Basic image usage */}
      <img src="/images/logo.png" alt="Company Logo" />
      
      {/* With CSS classes */}
      <img 
        src="/images/hero-banner.jpg" 
        alt="Hero Banner"
        className="w-full h-64 object-cover"
      />
      
      {/* Background image in CSS */}
      <div 
        style={{ 
          backgroundImage: 'url(/images/background.jpg)',
          backgroundSize: 'cover',
          height: '300px'
        }}
      >
        Content over background
      </div>
    </div>
  );
};

export default ExampleComponent;
```

## In CSS/SCSS Files

```css
.hero-section {
  background-image: url('/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
}

.logo {
  background-image: url('/images/logo.svg');
  background-repeat: no-repeat;
  background-size: contain;
}
```

## In Tailwind CSS

```jsx
<div 
  className="bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: 'url(/images/background.jpg)' }}
>
  Content here
</div>
```

## File Types Supported

- PNG, JPG, JPEG, GIF, WebP
- SVG (vector graphics)
- ICO (favicons)
- Any other image format supported by browsers 
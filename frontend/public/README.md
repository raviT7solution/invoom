# Public Folder

This folder contains static assets that will be served directly by the web server.

## Usage

### Images
Place your images in the `images/` subfolder and reference them in your code like this:

```jsx
// In React components
<img src="/images/your-image.jpg" alt="Description" />

// Or in CSS
background-image: url('/images/your-image.jpg');
```

### Other Static Assets
You can also place other static files like:
- `favicon.ico`
- `robots.txt`
- `manifest.json`
- Font files
- PDF documents
- etc.

## Important Notes

1. **No build processing**: Files in the public folder are copied as-is to the build output
2. **Direct URL access**: Files are accessible directly via their path from the root URL
3. **No import needed**: Unlike files in `src/`, you don't need to import these files
4. **Case sensitive**: File paths are case-sensitive in production

## Example Structure
```
public/
├── images/
│   ├── logo.png
│   ├── hero-banner.jpg
│   └── icons/
│       ├── home.svg
│       └── user.svg
├── favicon.ico
└── robots.txt
``` 
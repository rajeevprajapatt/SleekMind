// Use the standard `tailwindcss` PostCSS plugin. Vercel / PostCSS expects the plugin
// to be referenced as `tailwindcss` (object form) rather than trying to invoke
// a package wrapper directly.
import tailwindPostcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

// Tailwind v4 uses a separate PostCSS plugin package (@tailwindcss/postcss).
// Invoke the plugin function here so PostCSS (and Vercel builds) run it correctly.
export default {
  plugins: [tailwindPostcss(), autoprefixer()],
};

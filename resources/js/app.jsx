import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/Components/ThemeProvider';

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    // Set global Ziggy defaults for organization slug if present
    if (props.initialPage.props.auth?.organization && window.Ziggy) {
      window.Ziggy.defaults = {
        organization: props.initialPage.props.auth.organization.slug
      };
    }

    createRoot(el).render(
      <ThemeProvider defaultTheme="system" storageKey="nexus-ui-theme">
        <App {...props} />
      </ThemeProvider>
    )
  },
})

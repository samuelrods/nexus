import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/Components/ThemeProvider';

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
    return pages[`./Pages/${name}.tsx`] as any;
  },
  setup({ el, App, props }) {
    // Set global Ziggy defaults for organization slug if present
    const auth = props.initialPage.props.auth as any;
    if (auth?.organization && window.Ziggy) {
      window.Ziggy.defaults = {
        organization: auth.organization.slug
      };
    }

    createRoot(el).render(
      <ThemeProvider defaultTheme="system" storageKey="nexus-ui-theme">
        <App {...props} />
      </ThemeProvider>
    );
  },
});

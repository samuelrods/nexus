/// <reference types="vite/client" />

import { AxiosInstance } from 'axios';
import { route as routeFn } from 'ziggy-js';

interface ImportMeta {
  readonly glob: (pattern: string, options?: { eager?: boolean }) => Record<string, any>;
}

declare global {
    var route: typeof routeFn;
    var Ziggy: any;
}

interface Window {
    Ziggy: any;
    axios: AxiosInstance;
}

declare module '@inertiajs/core' {
    interface PageProps {
        auth: {
            user: any;
            organization: any;
        };
        [key: string]: any;
    }
}

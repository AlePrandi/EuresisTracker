import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
    SUPABASE_URL: {
        public: true,
        static: true
    },
    SUPABASE_PUBLISHABLE_KEY: {
        public: true,
        static: true
    }
})
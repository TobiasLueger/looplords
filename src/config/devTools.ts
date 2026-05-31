/** Aktivieren mit VITE_DEV_TOOLS=true in .env oder .env.local */
export const DEV_TOOLS_ENABLED =
  import.meta.env.VITE_DEV_TOOLS === 'true' ||
  import.meta.env.VITE_DEV_TOOLS === '1';

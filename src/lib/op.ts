import { OpenPanel } from '@openpanel/nextjs';
 
export const op = new OpenPanel({
  clientId: process.env.NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID!,
  clientSecret: process.env.OPEN_PANEL_SECRET,
});
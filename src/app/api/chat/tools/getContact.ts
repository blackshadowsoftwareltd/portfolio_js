import { tool } from 'ai';
import { z } from 'zod';

export const getContact = tool({
  description: 'Shows my contact information and social links.',
  parameters: z.object({}),
  execute: async () => {
    return "Here's how to reach me — feel free to get in touch 😉";
  },
});

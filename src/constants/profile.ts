import { RESUME } from '@/constants/resume';

// Identity is single-sourced from the CV in src/constants/resume.ts so the
// landing page, the contact card and the chat persona can never disagree.
export const PROFILE_DATA = {
  name: RESUME.name,
  email: RESUME.email,
  designation: RESUME.title,
  description: RESUME.summary,

  socialMedia: [
    {
      name: 'GitHub',
      command: 'open github',
      url: RESUME.github,
      icon: 'Github'
    },
    {
      name: 'LinkedIn',
      command: 'open linkedin',
      url: RESUME.linkedin,
      icon: 'Linkedin'
    },
    {
      name: 'Telegram',
      command: 'open telegram',
      url: RESUME.telegram,
      icon: 'Send'
    },
    {
      name: 'Email',
      command: 'send email',
      url: `mailto:${RESUME.email}`,
      icon: 'Mail'
    }
  ]
};

export const ANIMATION_SETTINGS = {
  typingSpeed: 150,
  backspaceSpeed: 100,
  pauseTime: 2000,
  cursorBlinkSpeed: 300
};

import { tool } from 'ai';
import { z } from 'zod';

export const getInternship = tool({
  description:
    "Gives a summary of what kind of internship I'm looking for, plus my contact info and how to reach me. Use this tool when the user asks about my internship search or how to contact me for opportunities.",
  parameters: z.object({}),
  execute: async () => {
    return `Here’s what I’m looking for 👇

- 📅 **Duration**: 6-month internship starting **September 2025**
- 🌍 **Location**: Preferably **San Francisco** or anywhere in the **United States**
- 🧑‍💻 **Focus**: AI development, full-stack web apps, SaaS, agentic workflows
- 🛠️ **Stack**: Python, React/Next.js, Tailwind CSS, TypeScript, GPT, RAG, etc.
- 💼 **Visa**: I’m based in Paris 🇫🇷 so I might need **J-1 sponsorship**
- ✅ **What I bring**: Real experience with secure on-prem GPTs (Lighton), deepsearch engines, custom RAG tools, and hackathon wins like **ETH Oxford** & **Paris Blockchain Week**
- 🔥 I move fast, learn faster, and I’m HUNGRYYYYY for big challenges

📬 **Contact me** via:
- Email: raphaelgiraud12@gmail.com
- LinkedIn: [linkedin.com/in/raphael-giraud](https://www.linkedin.com/in/raphael-giraud-ai/)
- GitHub: [github.com/RemonAhammad](https://github.com/RemonAhammad)

Let's build cool shit together ✌️
    `;
  },
});

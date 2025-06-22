### Toast Messages

use `useToast` from `src/hooks/use-toast.ts` for any toast messages.

### UI

- Use shadcn/ui components for UI elements.
- Make sure all UI components are responsive and works well on both desktop and mobile devices.
- Use Tailwind CSS for styling.
- Make sure all components works well with light and dark mode.

### API calls

Where possible, use `useQuery` and `useMutation` from `@tanstack/react-query` for API calls.
Use `axiosInstance` from `src/lib/axios/axios-client.ts` for making API requests to the backend. And use `/src/repo/` folders for API routes and use them in the components and pages and if new routes are needed, create them in the respective folders.

### Session Data

For getting session data, use `useSession` from `next-auth/react`.

### Next.js

- Use Server Components where possible.

### Code Style

- Modularize the code and keep it clean.
- Strictly use TypeScript for type safety.
- Do not add any comments or console logs in the code.
- Use meaningful variable and function names.

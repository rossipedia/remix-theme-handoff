import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { z } from 'zod';

declare global {
  interface Window {
    __ssrTheme: ThemeHandoffData;
  }
}

export const ThemeSchema = z.enum(['light', 'dark', 'system']);

export type ThemeHandoffData = z.infer<typeof ThemeSchema>;

const ThemeContext = createContext<ThemeContextValue>(['system', () => {}]);

export type ThemeContextValue = [
  ThemeHandoffData,
  (theme: ThemeHandoffData) => void
];

export function SSRThemeProvider({
  children,
  theme: themeProp,
}: PropsWithChildren<{ theme?: ThemeHandoffData }>) {
  // If we have a value prop, then it's the server and it's static

  const value = useState(() => {
    if (themeProp) {
      return themeProp;
    }

    if (typeof window !== 'undefined') {
      const result = ThemeSchema.safeParse(window.__ssrTheme);
      if (result.success) {
        return result.data;
      }
    }

    // Defaults to system
    return 'system';
  });

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function SSRThemeHandoff() {
  const [data] = useTheme();
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__ssrTheme=${JSON.stringify(data)};`,
      }}
    />
  );
}

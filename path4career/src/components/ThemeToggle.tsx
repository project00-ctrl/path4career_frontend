import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '../utils/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn("relative inline-flex items-center justify-center rounded-xl p-2","text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border transition-colors cursor-pointer",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun size={20} className="scale-100 dark:scale-0 transition-transform duration-300" />
      <Moon size={20} className="absolute scale-0 dark:scale-100 transition-transform duration-300" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

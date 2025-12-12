import { Menu, Bell, User, LogOut } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  currentPage: string;
  onLogout?: () => void;
}


export function Header({ onMenuToggle, currentPage, onLogout }: HeaderProps) {
    const pageTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);


    return (
    <header className="sticky top-0 z-30 bg-card border-b border-border px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-foreground">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-accent rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>
          <button className="p-2 hover:bg-accent rounded-lg transition-colors">
            <User className="w-5 h-5" />
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 hover:bg-accent rounded-lg transition-colors text-destructive"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
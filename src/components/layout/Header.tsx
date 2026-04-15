import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Menu, Search, LogOut, Settings, User, ChevronDown } from 'lucide-react';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toggleSidebar, globalSearchQuery, setGlobalSearchQuery, unreadNotifications } = useAppStore();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <header className="flex h-16 items-center justify-between rounded-3xl border border-slate-200/80 bg-white/95 px-4 lg:px-6 sticky top-4 z-20 shadow-lg shadow-slate-200/40 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden text-slate-600 hover:bg-slate-100" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search applications, users, or schools..."
            className="w-80 rounded-2xl bg-slate-100/80 py-2 pl-11 pr-4 text-slate-700 ring-1 ring-slate-200 focus:border-transparent focus:ring-primary/50"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-slate-600 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-[10px] font-semibold">
              {unreadNotifications}
            </span>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 rounded-2xl px-3 py-2 text-slate-700 hover:bg-slate-100">
              <Avatar className="h-9 w-9 ring-1 ring-slate-200">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user ? getInitials(user.firstName, user.lastName) : '?'}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">{user ? `${user.firstName} ${user.lastName}` : ''}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/app/settings/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/app/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

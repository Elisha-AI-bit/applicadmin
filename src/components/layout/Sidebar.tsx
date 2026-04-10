import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  School,
  BookOpen,
  Mail,
  BarChart3,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Applications', href: '/applications', icon: FileText, badge: 'pendingReviews' },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Academic Schools', href: '/schools', icon: School },
  { name: 'Programs', href: '/programs', icon: BookOpen },
  { name: 'Communications', href: '/communications', icon: Mail },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: UserCog, adminOnly: true },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const sidebarCollapsed = !sidebarOpen;

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div
      className={cn(
        'group flex flex-col border-r bg-[#0a0a0b] text-slate-300 transition-all duration-300 z-20',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-bold tracking-tight text-white">ApplicAdmin</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex text-slate-400 hover:text-white hover:bg-white/10"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator className="bg-white/10" />

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1.5 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 transition-all duration-200',
                  active 
                    ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  sidebarCollapsed && 'justify-center px-0'
                )}
                onClick={() => navigate(item.href)}
              >
                <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200", active ? "scale-110" : "")} />
                {!sidebarCollapsed && (
                  <span className="truncate font-medium">{item.name}</span>
                )}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-white/10 p-4 bg-black/20">
        <div className={cn('flex items-center gap-3', sidebarCollapsed && 'justify-center')}>
          {!sidebarCollapsed && (
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500">ApplicAdmin OS</p>
              <p className="text-[10px] text-slate-600">v1.2.0-beta</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

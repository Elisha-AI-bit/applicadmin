import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { cn, getInitials } from '@/lib/utils';
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
  const { user } = useAuthStore();
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
        'group flex flex-col border-r border-white/10 bg-[#0d2b4f] text-slate-100 shadow-xl transition-all duration-300 z-40',
        sidebarCollapsed ? 'w-16' : 'w-72',
        'fixed lg:relative h-full',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="flex h-24 items-center justify-between gap-4 px-5 bg-[#102f53]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-secondary to-primary text-white shadow-lg shadow-primary/25">
            <GraduationCap className="h-6 w-6" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="text-lg font-semibold text-white">ApplicAdmin</p>
              <p className="text-xs text-slate-400">Academic dashboard</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex text-slate-300 hover:text-white hover:bg-white/10"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!sidebarCollapsed && (
        <div className="mx-4 mt-4 rounded-3xl border border-white/10 bg-[#0c2947] p-4 shadow-inner shadow-black/10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-slate-950 font-semibold shadow-lg shadow-orange-500/20">
              {user ? getInitials(user.firstName, user.lastName) : 'AD'}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">{user ? `${user.firstName} ${user.lastName}` : 'Dashboard User'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email ?? 'johndon@company.com'}</p>
            </div>
          </div>
        </div>
      )}

      <Separator className="my-4 bg-white/10" />

      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1.5 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 rounded-3xl px-4 py-3 text-left transition-all duration-200',
                  active 
                    ? 'bg-white/10 text-white shadow-sm shadow-white/10' 
                    : 'text-slate-300 hover:bg-white/10 hover:text-white',
                  sidebarCollapsed && 'justify-center px-0'
                )}
                onClick={() => navigate(item.href)}
              >
                <Icon className={cn('h-5 w-5 shrink-0 transition-transform duration-200', active ? 'text-primary scale-110' : 'text-slate-300')} />
                {!sidebarCollapsed && (
                  <span className="truncate font-medium">{item.name}</span>
                )}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-white/10 p-4 bg-[#0c2947]">
        <div className={cn('flex flex-col gap-1', sidebarCollapsed && 'items-center')}>
          {!sidebarCollapsed && (
            <>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Version</p>
              <p className="text-sm font-semibold text-white">v1.2.0-beta</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

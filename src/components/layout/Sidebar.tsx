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
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-card transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 text-[rgba(42,72,192,1)] bg-[rgba(17,24,39,1)]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-semibold">ApplicAdmin</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator />

      <ScrollArea
        className="flex-1 py-4"
        style={{
          position: 'relative',
          '--radix-scroll-area-corner-width': '0px',
          '--radix-scroll-area-corner-height': '0px',
          backgroundColor: 'rgba(17, 24, 39, 1)',
          backgroundImage: 'none',
          backgroundClip: 'unset',
          WebkitBackgroundClip: 'unset',
          color: 'rgba(19, 61, 231, 1)',
          borderWidth: '10px',
          borderColor: 'rgba(17, 24, 39, 1)',
        }}
      >
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Button
                key={item.name}
                variant={active ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  sidebarCollapsed && 'justify-center px-2'
                )}
                onClick={() => navigate(item.href)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <div
        className="border-t p-4"
        style={{
          color: 'rgba(39, 45, 206, 1)',
          backgroundColor: 'rgba(17, 24, 39, 1)',
          borderTopColor: 'rgba(229, 231, 235, 1)',
        }}
      >
        <div className={cn('flex items-center gap-3', sidebarCollapsed && 'justify-center')}>
          {!sidebarCollapsed && (
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Version 1.0.0</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

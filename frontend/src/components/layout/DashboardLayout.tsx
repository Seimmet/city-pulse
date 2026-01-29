import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Globe, Users, Building2, Settings, CreditCard, 
  FileText, BarChart3, Bell, Search, ChevronDown, Menu, X, LogOut,
  BookOpen, Image, Megaphone, UserCircle, Home, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cities } from "@/data/mockData";

interface DashboardLayoutProps {
  role: "admin" | "publisher" | "editor" | "reader";
}

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Cities", href: "/admin/cities", icon: Globe },
  { name: "Publishers", href: "/admin/publishers", icon: Building2 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Licenses", href: "/admin/licenses", icon: CreditCard },
  { name: "Revenue", href: "/admin/revenue", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const publisherNav = [
  { name: "Dashboard", href: "/publisher", icon: LayoutDashboard },
  { name: "Editions", href: "/publisher/editions", icon: BookOpen },
  { name: "Articles", href: "/publisher/articles", icon: FileText },
  { name: "Media", href: "/publisher/media", icon: Image },
  { name: "Contributors", href: "/publisher/contributors", icon: Users },
  { name: "Advertisers", href: "/publisher/advertisers", icon: Megaphone },
  { name: "Analytics", href: "/publisher/analytics", icon: BarChart3 },
  { name: "Plans", href: "/publisher/plans", icon: CreditCard },
  { name: "Branding", href: "/publisher/branding", icon: Settings },
];

const editorNav = [
  { name: "Dashboard", href: "/editor", icon: LayoutDashboard },
  { name: "My Content", href: "/editor/content", icon: FileText },
  { name: "Submissions", href: "/editor/submissions", icon: BookOpen },
  { name: "Media Library", href: "/editor/media", icon: Image },
];

const readerNav = [
  { name: "Home", href: "/reader", icon: Home },
  { name: "My City", href: "/reader/city", icon: Globe },
  { name: "Editions", href: "/reader/editions", icon: BookOpen },
  { name: "Events", href: "/reader/events", icon: Calendar },
  { name: "Favorites", href: "/reader/favorites", icon: BookOpen },
  { name: "Profile", href: "/reader/profile", icon: UserCircle },
];

const navConfig = {
  admin: { items: adminNav, title: "Admin Portal" },
  publisher: { items: publisherNav, title: "Publisher Dashboard" },
  editor: { items: editorNav, title: "Contributor Portal" },
  reader: { items: readerNav, title: "CityPulse" },
};

export function DashboardLayout({ role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const nav = navConfig[role];

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("city_id");
    navigate("/login");
  };

  const isActive = (href: string) => {
    if (href === `/${role}`) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            {sidebarOpen && (
              <span className="font-serif text-lg font-bold text-sidebar-foreground">
                {nav.title}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-sidebar-foreground"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-sidebar-border hidden lg:block">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Menu className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Collapse</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="w-64 pl-9 bg-muted/50 border-0"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* City Selector (for publishers/readers) */}
            {(role === "publisher" || role === "reader") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Globe className="w-4 h-4 mr-2" />
                    New York
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover w-48">
                  {cities.slice(0, 5).map((city) => (
                    <DropdownMenuItem key={city.id}>
                      {city.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Building2,
  FolderTree,
  BookOpen,
  UserCog,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["admin", "staff", "supervisor"],
  },
  {
    title: "Students",
    href: "/students",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin", "staff"],
    children: [
      { title: "All Students", href: "/students", icon: null, roles: ["admin", "staff"] },
      { title: "Add Student", href: "/students/create", icon: null, roles: ["admin", "staff"] },
      { title: "Import Students", href: "/students/import", icon: null, roles: ["admin", "staff"] },
    ],
  },
  {
    title: "Exams",
    href: "/exams",
    icon: <ClipboardList className="h-5 w-5" />,
    roles: ["admin", "staff", "supervisor"],
    children: [
      { title: "All Exams", href: "/exams", icon: null, roles: ["admin", "staff", "supervisor"] },
      { title: "Create Exam", href: "/exams/create", icon: null, roles: ["admin", "staff"] },
    ],
  },
  {
    title: "Halls",
    href: "/halls",
    icon: <Building2 className="h-5 w-5" />,
    roles: ["admin", "staff"],
    children: [
      { title: "All Halls", href: "/halls", icon: null, roles: ["admin", "staff"] },
      { title: "Create Hall", href: "/halls/create", icon: null, roles: ["admin", "staff"] },
    ],
  },
  {
    title: "Departments",
    href: "/departments",
    icon: <FolderTree className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Courses",
    href: "/courses",
    icon: <BookOpen className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <UserCog className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "My Exams",
    href: "/my-exams",
    icon: <ClipboardList className="h-5 w-5" />,
    roles: ["student"],
  },
  {
    title: "Profile",
    href: "/profile",
    icon: <User className="h-5 w-5" />,
    roles: ["admin", "staff", "supervisor", "student"],
  },
];

export function Sidebar() {
  const { role, user, signOut } = useAuth();
  const pathname = usePathname();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(role || "")
  );

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center justify-center border-b border-gray-800 px-6">
        <h1 className="text-xl font-bold">OCEM Seat Planner</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>

              {/* Child items */}
              {item.children && isActive && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children
                    .filter((child) => child.roles.includes(role || ""))
                    .map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm transition-colors",
                          pathname === child.href
                            ? "text-white"
                            : "text-gray-400 hover:text-white"
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-semibold text-primary-foreground">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-gray-400 capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

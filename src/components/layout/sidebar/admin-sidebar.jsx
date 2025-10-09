"use client"
import { Search, Plus, Edit, Trash2, Home, Package, ShoppingCart, Archive, Users, Settings, LogOut, Music } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { logout } from "@/store/slices/authSlice"

const sidebarItems = [
  { icon: Home, label: "Dashboard", active: false, href: "" },
  { icon: Package, label: "Category", active: false, href: "/admin-dashboard/categories" },
  { icon: Music, label: "Music Category", active: false, href: "/admin-dashboard/music-categories" },
  { icon: Archive, label: "Products", active: false, href: "/admin-dashboard/products" },
  { icon: Music, label: "Music", active: false, href: "/admin-dashboard/music" },
  { icon: ShoppingCart, label: "Shopping", active: false, href: "" },
  { icon: Archive, label: "Stock", active: false, href: "" },
  { icon: Users, label: "Supplier", active: false, href: "" },
]

export function AdminSidebar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const pathname = usePathname()

  const isActive = (href) => {
    return pathname === href;
  }

  const handleLogout = () => {
      dispatch(logout({ router }));
    };
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-5">
          {sidebarItems.map((item, index) => {
            const active = isActive(item.href)
            return (
              <ul className="space-y-4" key={index}>
                <li>
                  <Link href={item.href}>
                    <div>
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${active
                          ? "bg-secondary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-secondary hover:text-sidebar-primary-foreground"
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </div>
                  </Link>
                </li>
              </ul>
            )
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </div>
  )
}

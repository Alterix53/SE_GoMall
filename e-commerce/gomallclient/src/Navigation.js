"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/cart", label: "Cart", icon: ShoppingCart },
    { href: "/checkout", label: "Checkout", icon: Package },
    { href: "/user", label: "Profile", icon: User },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            ShopApp
          </Link>

          <div className="flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <Button variant={isActive ? "default" : "ghost"} size="sm" className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

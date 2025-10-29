"use client"

import { useApp } from "@/lib/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShoppingCart, Search, User, LogOut, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { currentUser, userStatus, userRole, selectedLocation, logout, cart } = useApp()
  const router = useRouter()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary">Tinda</div>
          <span className="text-xs text-muted-foreground">Digital Palengke</span>
        </Link>

        {/* Search Bar - Only show when authenticated */}
        {userStatus === "authenticated" && (
          <div className="hidden flex-1 max-w-md md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search vendors or products..." className="pl-10" />
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {userStatus === "authenticated" && selectedLocation && (
            <div className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
              <MapPin className="h-4 w-4" />
              <span>{selectedLocation}</span>
            </div>
          )}

          {userStatus === "visitor" ? (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Icon - Only for buyers */}
              {userRole === "buyer" && (
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <span className="text-sm font-medium">{currentUser?.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

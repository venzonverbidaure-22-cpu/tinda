"use client"

import { useApp } from "@/lib/context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShopStatusCard } from "./shop-status-card"
import { StallProfileCard } from "./stall-profile-card"
import { ProductManagementCard } from "./product-management-card"
import { SetupChecklist } from "./setup-checklist"
import { VendorOrdersTable } from "./vendor-orders-table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { CreateStallModal } from "./CreateStallModal"
import { ProductListings } from "./product-listing" 
import { AddProductModal } from "./add-product-modal"
import { CurrentUser } from "@/lib/utils"
import { getVendorOrders, getVendorOrderStats } from "@/lib/services/orderService"
import { getStallById, updateStallStatus, getStallsByVendor } from "@/lib/services/stallService"

interface UserData {
  email: string,
  full_name: string,
  user_id: number,
  role: string,
}

const salesData = [
  { day: "Mon", sales: 4000 },
  { day: "Tue", sales: 3000 },
  { day: "Wed", sales: 2000 },
  { day: "Thu", sales: 2780 },
  { day: "Fri", sales: 1890 },
  { day: "Sat", sales: 2390 },
  { day: "Sun", sales: 3490 },
]

export function EnhancedVendorDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [weeklyOrders, setWeeklyOrders] = useState(0);
  const [isCreateStallModalOpen, setIsCreateStallModalOpen] = useState(false);
  const [shopStatus, setShopStatus] = useState<"active" | "inactive" | "pending">("pending");
  const [selectedStallIdState, setSelectedStallIdState] = useState<string | null>(null);
  const currentUser = useMemo(() => CurrentUser(), []);


  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (selectedStallIdState) {
        try {
          const ordersResponse = await getVendorOrders({
            sortBy: 'newest',
            limit: '5',
            stallId: selectedStallIdState,
          });
          setRecentOrders(ordersResponse.orders);
        } catch (error) {
          console.error("Error fetching recent orders:", error);
        }
      }
    };
    fetchRecentOrders();
  }, [selectedStallIdState]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (currentUser) {
        try {
          // Fetch user data
          const token = localStorage.getItem('token') || sessionStorage.getItem('token')
          const userResponse = await axios.get(`http://localhost:3001/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserData(userResponse.data);

          // Fetch stall status
          const selectedStallId = localStorage.getItem("selectedStallId");
          if (selectedStallId) {
            setSelectedStallIdState(selectedStallId);
            const stallData = await getStallById(Number(selectedStallId));
            if (stallData && stallData.status) {
              setShopStatus(stallData.status);
            }
          } else {
            const vendorStalls = await getStallsByVendor(currentUser.user_id);
            if (vendorStalls && vendorStalls.length > 0) {
              const firstStallId = vendorStalls[0].stall_id;
              localStorage.setItem("selectedStallId", firstStallId);
              setSelectedStallIdState(String(firstStallId));
              const stallData = await getStallById(firstStallId);
              if (stallData && stallData.status) {
                setShopStatus(stallData.status);
              }
            } else {
              setShopStatus("inactive");
            }
          }

        } catch (error) {
          console.error("Error fetching initial dashboard data:", error);
        }
      }
    };
    fetchInitialData();
  }, [currentUser]);

  useEffect(() => {
    const fetchOrderStats = async () => {
      if (selectedStallIdState) {
        try {
          const stats = await getVendorOrderStats(Number(selectedStallIdState));
          setTotalOrders(stats.totalOrders);
          setWeeklyOrders(stats.weeklyOrders);
        } catch (error) {
          console.error("Error fetching order stats:", error);
          setTotalOrders(0);
          setWeeklyOrders(0);
        }
      }
    };
    fetchOrderStats();
  }, [selectedStallIdState]); // Re-fetch when selectedStallId changes in local storage

  const handleStatusChange = async (status: "active" | "inactive") => {
    if (selectedStallIdState) {
      try {
        await updateStallStatus(Number(selectedStallIdState), status);
        setShopStatus(status);
      } catch (error) {
        console.error("Error updating stall status:", error);
      }
    }
  };


  return (
    <main className="min-h-screen bg-background">
      <div className="space-y-8 px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {userData?.full_name}</h1>
            <p className="text-muted-foreground">Manage your shop and grow your sales</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/vendor/store">View Profile</a>
            </Button>
          </div>
        </div>

        {/* Tabs for Organization */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab - Main Dashboard */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Shop Status - SCRUM-21 */}
              <ShopStatusCard 
                shopStatus={shopStatus} 
                openCreateStallModal={() => setIsCreateStallModalOpen(true)}
                onStatusChange={handleStatusChange}
              />

              {/* Virtual Stall Profile - SCRUM-9 */}
              <div className="lg:col-span-2">
                <StallProfileCard/>
              </div>
            </div>

            {/* Product Listings - SCRUM-22 */}
            <ProductManagementCard />

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold text-foreground">₱52,000</p>
                    <p className="mt-1 text-xs text-green-600">+12% from last month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
                    <p className="mt-1 text-xs text-green-600">+{weeklyOrders} this week</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-accent" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Shop Rating</p>
                    <div className="mt-1 flex items-center gap-1">
                      <p className="text-2xl font-bold text-foreground">4.8</p>
                      <span className="text-lg">⭐</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">245 reviews</p>
                  </div>
                  <Star className="h-8 w-8 text-accent" />
                </div>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
                <Button asChild>
                  <Link href="/vendor/orders">All Orders</Link>
                </Button>
              </div>
              <VendorOrdersTable orders={recentOrders} />
            </Card>
          </TabsContent>

          {/* Setup Tab - Onboarding */}
          <TabsContent value="setup" className="space-y-6">
            <SetupChecklist />
          </TabsContent>

          {/* Analytics Tab - Sales Data */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">Weekly Sales</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <CreateStallModal isOpen={isCreateStallModalOpen} onClose={() => setIsCreateStallModalOpen(false)} />
    </main>
  )
}

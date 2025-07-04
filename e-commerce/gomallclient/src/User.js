"use client"

import { useState } from "react"
import { User, Package, LogOut, Edit, Eye, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Order {
  id: string
  date: string
  total: number
  status: "delivered" | "processing" | "shipped" | "cancelled"
  items: number
}

export default function UserPage() {
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Apt 4B\nNew York, NY 10001",
    avatar: "/placeholder.svg?height=80&width=80",
  })

  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      date: "2024-01-15",
      total: 299.99,
      status: "delivered",
      items: 2,
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      total: 79.99,
      status: "processing",
      items: 1,
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      total: 149.99,
      status: "shipped",
      items: 3,
    },
    {
      id: "ORD-004",
      date: "2023-12-28",
      total: 199.99,
      status: "delivered",
      items: 1,
    },
  ])

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleLogout = () => {
    // Handle logout logic
    console.log("Logging out...")
  }

  const handleEditProfile = () => {
    // Handle edit profile logic
    console.log("Editing profile...")
  }

  const handleViewOrderDetails = (orderId: string) => {
    // Handle view order details
    console.log("Viewing order:", orderId)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleEditProfile}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium whitespace-pre-line">{user.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">Order {order.id}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            {order.items} item{order.items > 1 ? "s" : ""}
                          </span>
                          <span className="text-lg font-semibold text-blue-600">${order.total.toFixed(2)}</span>
                        </div>

                        <Button variant="outline" size="sm" onClick={() => handleViewOrderDetails(order.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders yet</h3>
                    <p className="text-gray-500">Start shopping to see your orders here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
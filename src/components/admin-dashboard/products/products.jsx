"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Home, Package, ShoppingCart, Archive, Users, Settings, LogOut, UserPlus, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const products = [
  { name: "Laptop", code: "E23447", category: "Device", quantity: 1, date: "16/07/2024", status: "active" },
  { name: "Name", code: "E23452", category: "Electronic", quantity: 1, date: "16/07/2024", status: "active" },
  { name: "Apple phone", code: "E23485", category: "Device", quantity: 3, date: "19/07/2024", status: "active" },
  { name: "Smart phone", code: "E23424", category: "Device", quantity: 2, date: "12/07/2024", status: "active" },
  { name: "Smart watch", code: "E23463", category: "Device", quantity: 4, date: "14/07/2024", status: "active" },
  { name: "Laptop", code: "E23442", category: "Device", quantity: 1, date: "10/07/2024", status: "active" },
  { name: "Smart phone", code: "E23417", category: "Device", quantity: 2, date: "10/07/2024", status: "active" },
  { name: "Fry pan", code: "E23436", category: "Cooking", quantity: 1, date: "15/07/2024", status: "active" },
  { name: "Blender machine", code: "E23494", category: "Cooking", quantity: 1, date: "12/07/2024", status: "active" },
  { name: "Digital watch", code: "E23443", category: "Device", quantity: 3, date: "16/07/2024", status: "active" },
  { name: "Fry pan", code: "E23436", category: "Cooking", quantity: 1, date: "16/07/2024", status: "active" },
]

const getCategories = (products) => {
  const categorySet = new Set()
  products.forEach(product => {
    categorySet.add(product.category)
  });

  return Array.from(categorySet)
}

export function Products() {
  const [createProduct, setCreateProduct] = useState(false)
  const [openDate, setOpenDate] = useState(false)
  const [date, setDate] = useState(undefined)
  const [newProduct, setNewProduct] = useState({
    name: "",
    code: "",
    category: "",
    quantity: "",
    date: "",
  })
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    name: "",
  })

  const fileredData = (category, name, status) => {

    const data = products.filter((cat) => {
      const matchesCat = category ? cat.category.toLowerCase() === category.toLowerCase() : true;
      const matchesStatus = status ? cat.status.toLowerCase() === status.toLowerCase() : true;
      const matchesName = name ? cat.name === name : true

      return matchesCat && matchesStatus && matchesName
    })

    setFilteredProducts(data)
  }

  const handleChange = (type, value) => {

    const updatedState = {
      ...filters,
      [type]: value
    }

    setFilters(updatedState)

    fileredData(updatedState.category, updatedState.name, updatedState.status)
  }

  const clearFilters = () => {
    const clearFilters = {
      category: "",
      status: "",
      name: "",
    }

    setFilters(clearFilters)

    fileredData(clearFilters.category, clearFilters.name, clearFilters.status)
  }

  const handleCreateProduct = () => {
    setCreateProduct(false)
    const Product = {
      name: newProduct.name,
      code: newProduct.code,
      category: newProduct.category,
      quantity: newProduct.quantity,
      status: "active",
      date: date ?? new Date().toLocaleString().slice(0,9)
    }

    setFilteredProducts([
      ...filteredProducts,
      Product
    ])

    setNewProduct({
      name: "",
      code: "",
      category: "",
      quantity: "",
      date: ""
    })
  }



  return (
    <div className="flex h-screen bg-background w-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Products</h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 w-64" />
            </div>
            <Avatar className="w-10 h-10">
              <AvatarImage src="/professional-headshot.png" />
              <AvatarFallback>WG</AvatarFallback>
            </Avatar>
            <div className="text-right">
              <div className="font-medium text-foreground">William Gray</div>
              <div className="text-sm text-muted-foreground">Super Admin</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="bg-card rounded-lg border border-border">
            {/* Category List Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">Products List</h2>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setCreateProduct(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-4 gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Product Name</label>
                  <Input placeholder="Enter product name" value={filters.name} onChange={(e) => handleChange("name", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Category</label>
                  <Select value={filters.category} onValueChange={(e) => handleChange("category", e)}>
                    <SelectTrigger className={`w-[100%]`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="device">Device</SelectItem>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="cooking">Cooking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Status</label>
                  <Select value={filters.status} onValueChange={(e) => handleChange("status", e)}>
                    <SelectTrigger className={`w-[100%]`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full mt-7" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">NAME</th>
                    <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">CODE</th>
                    <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">CATEGORY</th>
                    <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">QUANTITY</th>
                    <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">DATE</th>
                    <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                            <Package className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-card-foreground">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-card-foreground">{product.code}</td>
                      <td className="p-4 text-card-foreground">{product.category}</td>
                      <td className="p-4 text-card-foreground">{product.quantity}</td>
                      <td className="p-4 text-card-foreground">{product.date}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-card-foreground"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>


      <Dialog open={createProduct} onOpenChange={setCreateProduct}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Create New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Grandma Rose"
                className="mt-1 rounded-full"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="relationship" className="text-sm font-medium text-gray-700">
                Category
              </Label>
              <Select
                value={newProduct.category}
                onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
              >
                <SelectTrigger className="mt-1 rounded-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {getCategories(products).map((cat, index) => (
                    <SelectItem key={index} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                Code
              </Label>
              <Input
                id="code"
                type="code"
                placeholder="e.g., E23447"
                value={newProduct.code}
                onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                className="mt-1 rounded-full"
              />
            </div>

            <div>
              <Label htmlFor="Date" className="text-sm font-medium text-gray-700">
                Date
              </Label>
              <div className="flex flex-col gap-3 z-40">
                <Popover open={openDate} onOpenChange={setOpenDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date)
                        setOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="quantity"
                placeholder="e.g., 1,2,3..."
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                className="mt-1 rounded-full"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 rounded-full bg-transparent"
                onClick={() => setCreateProduct(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-secondary rounded-full"
                onClick={handleCreateProduct}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

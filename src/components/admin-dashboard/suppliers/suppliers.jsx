"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Plus, Edit, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getAllProducts, createProduct, delProduct, updateProduct } from "@/store/slices/productSlice"
import { createSupplier, getAllSuppliers, updateSupplier, deleteSupplier } from "@/store/slices/supplierSlice"
import { getAllCategories } from "@/store/slices/categorySlice"
import { uploadImage } from "@/store/slices/mediaSlice"
import { useDispatch, useSelector } from "react-redux"
import Loading from "@/components/loading"
import { toast } from "react-toastify"
import { format } from "date-fns/format"

const users = [
    {
        id: "USR-1001",
        fullName: "Ali Raza",
        cnic: "35202-4567891-3",
        country: "Pakistan",
        address: "House 12, Street 7, Johar Town, Lahore",
        status: "Active", // Active | Inactive | Suspended
        subscription: "Premium", // Free | Basic | Premium
        category: "Individual", // Individual | Business
    },
    {
        id: "USR-1002",
        fullName: "Sara Ahmed",
        cnic: "37405-9876542-1",
        country: "Pakistan",
        address: "Plot 24, Block C, North Nazimabad, Karachi",
        status: "Inactive",
        subscription: "Free",
        category: "Individual",
    },
    {
        id: "USR-1003",
        fullName: "Hamza Khan",
        cnic: "61101-2345678-0",
        country: "UAE",
        address: "Apartment 502, Marina Bay Towers, Dubai",
        status: "Active",
        subscription: "Basic",
        category: "Business",
    },
    {
        id: "USR-1004",
        fullName: "Maira Fatima",
        cnic: "42301-9871234-5",
        country: "Canada",
        address: "12 Queen Street, Toronto, Ontario",
        status: "Suspended",
        subscription: "Premium",
        category: "Individual",
    },
    {
        id: "USR-1005",
        fullName: "Usman Siddiqui",
        cnic: "36302-6578432-8",
        country: "Pakistan",
        address: "B-45, Block 6, PECHS, Karachi",
        status: "Active",
        subscription: "Basic",
        category: "Business",
    },
    {
        id: "USR-1006",
        fullName: "Ayesha Tariq",
        cnic: "35201-9854321-6",
        country: "UK",
        address: "221B Baker Street, London",
        status: "Inactive",
        subscription: "Free",
        category: "Individual",
    },
    {
        id: "USR-1007",
        fullName: "Bilal Saeed",
        cnic: "37406-1122334-7",
        country: "Pakistan",
        address: "Flat 8, Gulberg Heights, Islamabad",
        status: "Active",
        subscription: "Premium",
        category: "Business",
    },
];




export function Suppliers() {
    const user = useSelector((state) => state.auth.user);
    const categories = useSelector((state) => state.category.categories);
    console.log("categories", categories);
    const products = useSelector((state) => state.product.products);
    console.log("products", products);
    const suppliers = useSelector((state) => state.supplier.suppliers);
    console.log(suppliers, 'suppliers')
    const [isCreateSupplier, setIsCreateSupplier] = useState(false)
    const [isEditProduct, setIsEditProduct] = useState(false);
    const [isEditSupplier, setIsEditSupplier] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        name: "",
        cnic: "",
        email: "",
        city: "",
        state: "",
        country: "",
        status: "",
    })
    const [editSupplier, setEditSupplier] = useState({
        id: "",
        name: "",
        cnic: "",
        email: "",
        city: "",
        state: "",
        country: "",
        status: "",
    })
    const [editProduct, setEditProduct] = useState({
        id: "",
        name: "",
        slug: "",
        costPrice: "",
        salePrice: "",
        quantity: "",
        taxPercent: "",
    })
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [categoryId, setCategoryId] = useState(undefined);
    const [subCategoryId, setSubCategoryId] = useState(undefined);
    const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers)
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedFilterCategory, setSelectedFilterCategory] = useState(undefined);
    const [selectedFilterStatus, setSelectedFilterStatus] = useState(undefined);
    const [editingIndex, setEditingIndex] = useState(null);
    const dispatch = useDispatch();

    const selectedCategory = categories?.find(cat => cat.id === categoryId);

    const handleCategoryFilter = (categoryId) => {
        if (!categoryId) {
            setFilteredSuppliers(suppliers);
            return;
        }
        if (categoryId === "all") {
            setFilteredSuppliers(suppliers);
            return;
        }
        const filtered = suppliers.filter(supplier => supplier?.category?.id === categoryId);
        setFilteredSuppliers(filtered);
    }

    const handleStatusFilter = (selectedFilterStatus) => {
        if (!selectedFilterStatus) {
            setFilteredSuppliers(suppliers);
            return;
        }
        if (selectedFilterStatus === "all") {
            setFilteredSuppliers(suppliers);
            return;
        }
        const filtered = suppliers.filter(supplier => supplier?.status === selectedFilterStatus);
        setFilteredSuppliers(filtered);
    }

    const clearFilters = () => {
        setFilteredSuppliers(suppliers);
        setSearch("");
        setSelectedFilterCategory("");
        setSelectedFilterStatus("")
    }

    const handleCreateSupplier = async () => {

        if (!categoryId) {
            toast.error("Please select a category");
            return;
        }

        if (!subCategoryId) {
            toast.error("Please select a sub category");
            return;
        }

        console.log(newSupplier, "newSupplier")

        if (!newSupplier.name || !newSupplier.email || !newSupplier.cnic || !newSupplier.city || !newSupplier.state || !newSupplier.country) {
            toast.error("Please fill all the fields");
            return;
        }

        const formData = {
            ...newSupplier,
            categoryId,
            subCategoryId
        }

        dispatch(createSupplier({ setLoading, adminId: user?.id, formData }))
        setIsCreateSupplier(false)
        setNewSupplier({
            name: "",
            email: "",
            cnic: "",
            state: "",
            city: "",
            country: "",
            status: "",
        })
    }

    const handleEditSupplier = async () => {
        if (!categoryId) {
            toast.error("Please select a category");
            return;
        }
        if (!subCategoryId) {
            toast.error("Please select a sub category");
            return;
        }
        // console.log("editSupplier", editSupplier);
        if (!editSupplier.name || !editSupplier.cnic || !editSupplier.email || !editSupplier.city || !editSupplier.state || !editSupplier.country || !editSupplier.status) {
            toast.error("Please fill all the fields");
            return;
        }

        const formData = {
            ...editSupplier,
            categoryId,
            subCategoryId
        }

        dispatch(updateSupplier({ setLoading, adminId: user?.id, formData, supplierId: editSupplier.id }))
        setIsEditSupplier(false)
        setEditSupplier({
            id: "",
            name: "",
            cnic: "",
            email: "",
            state: "",
            city: "",
            country: "",
            status: "",
        })
    }

    const gettingAllSuppliers = () => {
        dispatch(getAllSuppliers({ setLoading, search, adminId: user?.id }))
    }

    const gettingAllCategories = () => {
        dispatch(getAllCategories({ setLoading }))
    }

    useEffect(() => {
        gettingAllSuppliers();
        gettingAllCategories();
    }, [])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            gettingAllSuppliers();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        setFilteredSuppliers(suppliers);
    }, [suppliers])

    const delSupplier = (supplierId) => {
        if (!supplierId) {
            toast.error("Supplier ID are required to delete a product");
            return;
        }
        dispatch(deleteSupplier({ setLoading, supplierId, adminId: user?.id }))
    }

    const formatDate = (date) => {
        return format(date, 'MMM dd, yyyy')
    }

    return (
        <div className="flex h-screen bg-background w-full">
            {loading && <Loading />}
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground">Suppliers</h1>

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
                                <h2 className="text-xl font-semibold text-card-foreground">Suppliers List</h2>
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsCreateSupplier(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Supplier
                                </Button>
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-4 gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-2">Supplier Name</label>
                                    <Input placeholder="Enter supplier name" value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-2">Category</label>
                                    <Select value={selectedFilterCategory} onValueChange={(value) => {
                                        handleCategoryFilter(value);
                                        setSelectedFilterCategory(value);
                                    }}>
                                        <SelectTrigger className={`w-[100%]`}>
                                            <SelectValue placeholder="Select Supplier Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {categories?.map((cat, index) => (
                                                <SelectItem key={index} value={cat?.id}>{cat?.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-2">Status</label>
                                    <Select value={selectedFilterStatus} onValueChange={(value) => {
                                        handleStatusFilter(value);
                                        setSelectedFilterStatus(value);
                                    }}>
                                        <SelectTrigger className={`w-[100%]`}>
                                            <SelectValue placeholder="Select Supplier Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                            <SelectItem value="INACTIVE">INACTIVE</SelectItem>
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
                        {suppliers?.length !== 0 && filteredSuppliers?.length > 0 && !loading && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">FULL NAME</th>
                                            <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">CNIC</th>
                                            <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">COUNTRY</th>
                                            <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">ADDRESS</th>
                                            <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">STATUS</th>
                                            {/* <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">SUBSCRIPTION</th> */}
                                            <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">CATEGORY</th>
                                            <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">SUB CATEGORY</th>
                                            <th className="text-left p-4 font-medium text-muted-foreground uppercase text-sm">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSuppliers?.map((supplier, index) => (
                                            <tr key={index} className="border-b border-border hover:bg-muted/50">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-medium text-card-foreground">{supplier?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-card-foreground">{supplier?.cnic}</td>
                                                <td className="p-4 text-card-foreground">{supplier?.country}</td>
                                                <td
                                                    className="p-4 text-card-foreground max-w-xs truncate"
                                                    title={supplier?.city}
                                                >
                                                    {supplier?.city}, {supplier?.state}
                                                </td>
                                                <td className="p-4 text-card-foreground">
                                                    {editingIndex === index ? (
                                                        <select
                                                            onChange={() => setEditingIndex(null)}
                                                            className="border border-border rounded-md px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                                        >
                                                            <option value="Pending Payment">Pending Payment</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                            <option value="Returned">Returned</option>
                                                        </select>
                                                    ) : (
                                                        <span>{supplier?.status}</span>
                                                    )}
                                                </td>
                                                {/* <td className="p-4 text-card-foreground">{supplier?.subscription}</td> */}
                                                <td className="p-4 text-card-foreground">{supplier?.category?.name}</td>
                                                <td className="p-4 text-card-foreground">{supplier?.subCategory?.name}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-muted-foreground hover:text-card-foreground"
                                                            onClick={() => {
                                                                setIsEditSupplier(true);
                                                                setEditSupplier({
                                                                    id: supplier?.id,
                                                                    name: supplier?.name,
                                                                    email: supplier?.email,
                                                                    cnic: supplier?.cnic,
                                                                    country: supplier?.country,
                                                                    state: supplier?.state,
                                                                    city: supplier?.city,
                                                                    status: supplier?.status,
                                                                });
                                                                setCategoryId(supplier?.category?.id);
                                                                setSubCategoryId(supplier?.subCategory?.id)
                                                            }}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive"
                                                          onClick={() => delSupplier(supplier?.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {filteredSuppliers?.length === 0 && !loading && (
                            <div className="p-6">
                                <p className="text-lg font-medium text-gray-500 text-center">
                                    No Supplier Found
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Dialog open={isEditSupplier} onOpenChange={setIsEditSupplier}>
                <DialogContent className="sm:max-w-md rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-800">Edit New Supplier</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                placeholder="Full Name"
                                className="mt-1 rounded-full"
                                value={editSupplier.name}
                                onChange={(e) => setEditSupplier({ ...editSupplier, name: e.target.value })}
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="Email"
                                className="mt-1 rounded-full"
                                value={editSupplier.email}
                                onChange={(e) => setEditSupplier({ ...editSupplier, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="cnic" className="text-sm font-medium text-gray-700">
                                CNIC
                            </Label>
                            <Input
                                id="cnic"
                                placeholder="CNIC"
                                className="mt-1 rounded-full"
                                value={editSupplier.cnic}
                                onChange={(e) => setEditSupplier({ ...editSupplier, cnic: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                                Category
                            </Label>
                            <Select
                                value={categoryId}
                                onValueChange={(value) => setCategoryId(value)}
                                className="w-full"
                            >
                                <SelectTrigger className="mt-1 rounded-full w-full">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map((cat, index) => (
                                        <SelectItem key={index} value={cat?.id}>{cat?.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="subCategory" className="text-sm font-medium text-gray-700">
                                Sub Category
                            </Label>
                            <Select
                                value={subCategoryId}
                                onValueChange={(value) => setSubCategoryId(value)}
                                disabled={!categoryId || !selectedCategory?.subCategories?.length}
                                className="w-full"
                            >
                                <SelectTrigger className="mt-1 rounded-full w-full">
                                    <SelectValue
                                        placeholder={
                                            !categoryId
                                                ? "Select Category first"
                                                : selectedCategory?.subCategories?.length
                                                    ? "Select Sub Category"
                                                    : "No Sub Categories Found"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedCategory?.subCategories?.length > 0 ? (
                                        selectedCategory.subCategories.map((sub) => (
                                            <SelectItem key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                            No subcategories available
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                                Country
                            </Label>
                            <Input
                                id="country"
                                type="text"
                                placeholder="Country"
                                value={editSupplier.country}
                                onChange={(e) => setEditSupplier({ ...editSupplier, country: e.target.value })}
                                className="mt-1 rounded-full"
                            />
                        </div>

                        <div>
                            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                                State
                            </Label>
                            <Input
                                id="state"
                                type="text"
                                placeholder="State"
                                value={editSupplier.state}
                                onChange={(e) => setEditSupplier({ ...editSupplier, state: e.target.value })}
                                className="mt-1 rounded-full"
                            />
                        </div>

                        <div>
                            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                                City
                            </Label>
                            <Input
                                id="city"
                                type="text"
                                placeholder="City"
                                value={editSupplier.city}
                                onChange={(e) => setEditSupplier({ ...editSupplier, city: e.target.value })}
                                className="mt-1 rounded-full"
                            />
                        </div>

                        <div>
                            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                Status
                            </Label>
                            <Select
                                value={editSupplier.status}
                                onValueChange={(value) => setEditSupplier({ ...editSupplier, status: value })}
                                className="w-full"
                            >
                                <SelectTrigger className="mt-1 rounded-full w-full">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-full bg-transparent"
                                onClick={() => setIsEditSupplier(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-secondary rounded-full"
                                onClick={handleEditSupplier}
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Update Supplier
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isCreateSupplier} onOpenChange={setIsCreateSupplier}>
                <DialogContent className="sm:max-w-md rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-800">Create New Supplier</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                placeholder="Full Name"
                                className="mt-1 rounded-full"
                                value={newSupplier.name}
                                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="Email"
                                className="mt-1 rounded-full"
                                value={newSupplier.email}
                                onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="cnic" className="text-sm font-medium text-gray-700">
                                CNIC
                            </Label>
                            <Input
                                id="cnic"
                                placeholder="CNIC"
                                className="mt-1 rounded-full"
                                value={newSupplier.cnic}
                                onChange={(e) => setNewSupplier({ ...newSupplier, cnic: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                                Category
                            </Label>
                            <Select
                                value={categoryId}
                                onValueChange={(value) => setCategoryId(value)}
                                className="w-full"
                            >
                                <SelectTrigger className="mt-1 rounded-full w-full">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map((cat, index) => (
                                        <SelectItem key={index} value={cat?.id}>{cat?.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="subCategory" className="text-sm font-medium text-gray-700">
                                Sub Category
                            </Label>
                            <Select
                                value={subCategoryId}
                                onValueChange={(value) => setSubCategoryId(value)}
                                disabled={!categoryId || !selectedCategory?.subCategories?.length}
                                className="w-full"
                            >
                                <SelectTrigger className="mt-1 rounded-full w-full">
                                    <SelectValue
                                        placeholder={
                                            !categoryId
                                                ? "Select Category first"
                                                : selectedCategory?.subCategories?.length
                                                    ? "Select Sub Category"
                                                    : "No Sub Categories Found"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedCategory?.subCategories?.length > 0 ? (
                                        selectedCategory.subCategories.map((sub) => (
                                            <SelectItem key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                            No subcategories available
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                                Country
                            </Label>
                            <Input
                                id="country"
                                type="text"
                                placeholder="Country"
                                value={newSupplier.country}
                                onChange={(e) => setNewSupplier({ ...newSupplier, country: e.target.value })}
                                className="mt-1 rounded-full"
                            />
                        </div>

                        <div>
                            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                                State
                            </Label>
                            <Input
                                id="state"
                                type="text"
                                placeholder="State"
                                value={newSupplier.state}
                                onChange={(e) => setNewSupplier({ ...newSupplier, state: e.target.value })}
                                className="mt-1 rounded-full"
                            />
                        </div>

                        <div>
                            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                                City
                            </Label>
                            <Input
                                id="city"
                                type="text"
                                placeholder="City"
                                value={newSupplier.city}
                                onChange={(e) => setNewSupplier({ ...newSupplier, city: e.target.value })}
                                className="mt-1 rounded-full"
                            />
                        </div>

                        <div>
                            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                Status
                            </Label>
                            <Select
                                value={newSupplier.status}
                                onValueChange={(value) => setNewSupplier({ ...newSupplier, status: value })}
                                className="w-full"
                            >
                                <SelectTrigger className="mt-1 rounded-full w-full">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-full bg-transparent"
                                onClick={() => setIsCreateSupplier(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-secondary rounded-full"
                                onClick={handleCreateSupplier}
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create Supplier
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

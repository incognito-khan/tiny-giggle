"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Plus, Edit, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createSupplier, getAllSuppliers, updateSupplier, deleteSupplier } from "@/store/slices/supplierSlice"
import { createArtist, getAllArtists, updateArtist, deleteArtist } from "@/store/slices/artistSlice"
import { getAllMusicCategories } from "@/store/slices/categorySlice"
import { useDispatch, useSelector } from "react-redux"
import Loading from "@/components/loading"
import { toast } from "react-toastify"
import { format } from "date-fns/format"

export function Artists() {
    const user = useSelector((state) => state.auth.user);
    const categories = useSelector((state) => state.category.categories);
    console.log("categories", categories);
    const suppliers = useSelector((state) => state.supplier.suppliers);
    console.log(suppliers, 'suppliers')
    const artists = useSelector((state) => state.artist.artists);
    console.log(artists, 'artists');
    const [isCreateArtist, setIsCreateArtist] = useState(false)
    const [isEditSupplier, setIsEditSupplier] = useState(false);
    const [isEditArtist, setIsEditArtist] = useState(false);
    const [newArtist, setNewArtist] = useState({
        name: "",
        cnic: "",
        email: "",
        city: "",
        state: "",
        country: "",
        status: "",
    })
    const [editArtist, setEditArtist] = useState({
        id: "",
        name: "",
        cnic: "",
        email: "",
        city: "",
        state: "",
        country: "",
        status: "",
    })
    const [categoryId, setCategoryId] = useState(undefined);
    const [subCategoryId, setSubCategoryId] = useState(undefined);
    const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers)
    const [filteredArtists, setFilteredArtists] = useState(artists);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedFilterCategory, setSelectedFilterCategory] = useState(undefined);
    const [selectedFilterStatus, setSelectedFilterStatus] = useState(undefined);
    const [editingIndex, setEditingIndex] = useState(null);
    const dispatch = useDispatch();

    const selectedCategory = categories?.find(cat => cat.id === categoryId);

    const handleCategoryFilter = (categoryId) => {
        if (!categoryId) {
            setFilteredArtists(artists);
            return;
        }
        if (categoryId === "all") {
            setFilteredArtists(artists);
            return;
        }
        const filtered = artists.filter(artist => artist?.category?.id === categoryId);
        setFilteredArtists(filtered);
    }

    const handleStatusFilter = (selectedFilterStatus) => {
        if (!selectedFilterStatus) {
            setFilteredArtists(artists);
            return;
        }
        if (selectedFilterStatus === "all") {
            setFilteredArtists(artists);
            return;
        }
        const filtered = artists.filter(artist => artist?.status === selectedFilterStatus);
        setFilteredArtists(filtered);
    }

    const clearFilters = () => {
        setFilteredArtists(artists);
        setSearch("");
        setSelectedFilterCategory("");
        setSelectedFilterStatus("")
    }

    const handleCreateArtist = async () => {

        if (!categoryId) {
            toast.error("Please select a category");
            return;
        }

        if (!subCategoryId) {
            toast.error("Please select a sub category");
            return;
        }

        console.log(newArtist, "newArtist")

        if (!newArtist.name || !newArtist.email || !newArtist.cnic || !newArtist.city || !newArtist.state || !newArtist.country) {
            toast.error("Please fill all the fields");
            return;
        }

        const formData = {
            ...newArtist,
            categoryId,
            subCategoryId
        }

        dispatch(createArtist({ setLoading, adminId: user?.id, formData }))
        setIsCreateArtist(false)
        setNewArtist({
            name: "",
            email: "",
            cnic: "",
            state: "",
            city: "",
            country: "",
            status: "",
        })
    }

    const handleEditArtist = async () => {
        if (!categoryId) {
            toast.error("Please select a category");
            return;
        }
        if (!subCategoryId) {
            toast.error("Please select a sub category");
            return;
        }
        // console.log("editSupplier", editSupplier);
        if (!editArtist.name || !editArtist.cnic || !editArtist.email || !editArtist.city || !editArtist.state || !editArtist.country || !editArtist.status) {
            toast.error("Please fill all the fields");
            return;
        }

        const formData = {
            ...editArtist,
            categoryId,
            subCategoryId
        }

        dispatch(updateArtist({ setLoading, adminId: user?.id, formData, artistId: editArtist.id }))
        setIsEditArtist(false)
        setEditArtist({
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

    const gettingAllArtists = () => {
        dispatch(getAllArtists({ setLoading, search, adminId: user?.id }))
    }

    const gettingAllCategories = () => {
        dispatch(getAllMusicCategories({ setLoading }))
    }

    useEffect(() => {
        gettingAllArtists();
        gettingAllCategories();
    }, [])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            gettingAllArtists();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        setFilteredArtists(artists);
    }, [artists])

    const delArtist = (artistId) => {
        if (!artistId) {
            toast.error("Artist ID are required to delete a product");
            return;
        }
        dispatch(deleteArtist({ setLoading, artistId, adminId: user?.id }))
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
                    <h1 className="text-2xl font-bold text-foreground">Artist</h1>

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
                                <h2 className="text-xl font-semibold text-card-foreground">Artists List</h2>
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsCreateArtist(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Artist
                                </Button>
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-4 gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-2">Artist Name</label>
                                    <Input placeholder="Enter artist name" value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-2">Category</label>
                                    <Select value={selectedFilterCategory} onValueChange={(value) => {
                                        handleCategoryFilter(value);
                                        setSelectedFilterCategory(value);
                                    }}>
                                        <SelectTrigger className={`w-[100%]`}>
                                            <SelectValue placeholder="Select Artist Category" />
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
                                            <SelectValue placeholder="Select Artist Status" />
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
                        {artists?.length !== 0 && filteredArtists?.length > 0 && !loading && (
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
                                        {filteredArtists?.map((artist, index) => (
                                            <tr key={index} className="border-b border-border hover:bg-muted/50">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-medium text-card-foreground">{artist?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-card-foreground">{artist?.cnic}</td>
                                                <td className="p-4 text-card-foreground">{artist?.country}</td>
                                                <td
                                                    className="p-4 text-card-foreground max-w-xs truncate"
                                                    title={artist?.city}
                                                >
                                                    {artist?.city}, {artist?.state}
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
                                                        <span>{artist?.status}</span>
                                                    )}
                                                </td>
                                                {/* <td className="p-4 text-card-foreground">{supplier?.subscription}</td> */}
                                                <td className="p-4 text-card-foreground">{artist?.category?.name}</td>
                                                <td className="p-4 text-card-foreground">{artist?.subCategory?.name}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-muted-foreground hover:text-card-foreground"
                                                            onClick={() => {
                                                                setIsEditArtist(true);
                                                                setEditArtist({
                                                                    id: artist?.id,
                                                                    name: artist?.name,
                                                                    email: artist?.email,
                                                                    cnic: artist?.cnic,
                                                                    country: artist?.country,
                                                                    state: artist?.state,
                                                                    city: artist?.city,
                                                                    status: artist?.status,
                                                                });
                                                                setCategoryId(artist?.category?.id);
                                                                setSubCategoryId(artist?.subCategory?.id)
                                                            }}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive"
                                                            onClick={() => delArtist(artist?.id)}
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
                        {filteredArtists?.length === 0 && !loading && (
                            <div className="p-6">
                                <p className="text-lg font-medium text-gray-500 text-center">
                                    No Artist Found
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Dialog open={isEditArtist} onOpenChange={setIsEditArtist}>
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
                                value={editArtist.name}
                                onChange={(e) => setEditArtist({ ...editArtist, name: e.target.value })}
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
                                value={editArtist.email}
                                onChange={(e) => setEditArtist({ ...editArtist, email: e.target.value })}
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
                                value={editArtist.cnic}
                                onChange={(e) => setEditArtist({ ...editArtist, cnic: e.target.value })}
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
                                value={editArtist.country}
                                onChange={(e) => setEditArtist({ ...editArtist, country: e.target.value })}
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
                                value={editArtist.state}
                                onChange={(e) => setEditArtist({ ...editArtist, state: e.target.value })}
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
                                value={editArtist.city}
                                onChange={(e) => setEditArtist({ ...editArtist, city: e.target.value })}
                                className="mt-1 rounded-full"
                            />
                        </div>

                        <div>
                            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                Status
                            </Label>
                            <Select
                                value={editArtist.status}
                                onValueChange={(value) => setEditArtist({ ...editArtist, status: value })}
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
                                onClick={() => setIsEditArtist(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-secondary rounded-full"
                                onClick={handleEditArtist}
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Update Artist
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isCreateArtist} onOpenChange={setIsCreateArtist}>
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
                                value={newArtist.name}
                                onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
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
                                value={newArtist.email}
                                onChange={(e) => setNewArtist({ ...newArtist, email: e.target.value })}
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
                                value={newArtist.cnic}
                                onChange={(e) => setNewArtist({ ...newArtist, cnic: e.target.value })}
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
                                value={newArtist.country}
                                onChange={(e) => setNewArtist({ ...newArtist, country: e.target.value })}
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
                                value={newArtist.state}
                                onChange={(e) => setNewArtist({ ...newArtist, state: e.target.value })}
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
                                value={newArtist.city}
                                onChange={(e) => setNewArtist({ ...newArtist, city: e.target.value })}
                                className="mt-1 rounded-full"
                            />
                        </div>

                        <div>
                            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                Status
                            </Label>
                            <Select
                                value={newArtist.status}
                                onValueChange={(value) => setNewArtist({ ...newArtist, status: value })}
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
                                onClick={() => setIsCreateArtist(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-secondary rounded-full"
                                onClick={handleCreateArtist}
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create Artist
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

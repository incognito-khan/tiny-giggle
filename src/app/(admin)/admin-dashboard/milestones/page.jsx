"use client"

import React, { useMemo, useState, useEffect } from "react"
import { MoreHorizontal, Plus, Eye, Pencil, Trash2, ListPlus, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useDispatch, useSelector } from "react-redux"
import { createMilestone, getAllMilestonesWithSub, createSubMilestone, updateMilestone, deleteMilestone, updateSubMilestone, deleteSubMilestone } from "@/store/slices/milestoneSlice"
import { uploadImage } from "@/store/slices/mediaSlice"
import Loading from "@/components/loading";
import { toast } from "react-toastify"

// Reusable form for adding/editing a Milestone
function MilestoneForm({ initialValues, onSubmit, onCancel, mode }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(initialValues?.imageUrl || null);
    const [form, setForm] = useState({
        month: initialValues?.month || "",
        title: initialValues?.title || "",
        description: initialValues?.description || "",
    })

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
    };

    function handleChange(e) {
        const { name, value } = e.target
        setForm((f) => ({ ...f, [name]: value }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        onSubmit(form, file, initialValues?.id)
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
                <Label className="mb-2">Milestone Image</Label>
                <div className="flex items-center justify-between w-full border rounded-lg px-3 py-2">
                    <label
                        htmlFor="file-upload"
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm px-4 py-2 rounded cursor-pointer"
                    >
                        Choose File
                    </label>
                    <span className="text-gray-500 text-sm truncate">
                        {file ? file.name : "No file chosen"}
                    </span>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
                {preview && (
                    <div className="mt-2">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border"
                        />
                    </div>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="month">Month</Label>
                <Input id="month" name="month" value={form.month} onChange={handleChange} placeholder="e.g., Jan 2026" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Milestone title" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Brief milestone description"
                    rows={4}
                />
            </div>
            <DialogFooter className="mt-2">
                <Button type="button" className="bg-pink-600 hover:bg-pink-500" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">{mode === "edit" ? "Save Changes" : "Add Milestone"}</Button>
            </DialogFooter>
        </form>
    )
}

// Reusable form for adding/editing a Sub-Milestone
function SubMilestoneForm({ initialValues, onSubmit, onCancel, mode = "add" }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(initialValues?.imageUrl);
    const [form, setForm] = useState({
        title: initialValues?.title || "",
        description: initialValues?.description || ""
    })

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
    };

    function handleChange(e) {
        const { name, value } = e.target
        setForm((f) => ({ ...f, [name]: value }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        onSubmit(form, file, initialValues?.id)
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
                <Label className="mb-2">Sub Milestone Image</Label>
                <div className="flex items-center justify-between w-full border rounded-lg px-3 py-2">
                    <label
                        htmlFor="file-upload"
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm px-4 py-2 rounded cursor-pointer"
                    >
                        Choose File
                    </label>
                    <span className="text-gray-500 text-sm truncate">
                        {file ? file.name : "No file chosen"}
                    </span>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
                {preview && (
                    <div className="mt-2">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border"
                        />
                    </div>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="subTitle">Title</Label>
                <Input
                    id="subTitle"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Sub-milestone title"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="subDescription">Description</Label>
                <Textarea
                    id="subDescription"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Short description"
                    rows={3}
                />
            </div>
            <DialogFooter className="mt-2">
                <Button type="button" className="bg-pink-600 hover:bg-pink-500" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">{mode === "edit" ? "Save Changes" : "Add Sub-Milestone"}</Button>
            </DialogFooter>
        </form>
    )
}

export default function Page() {
    const user = useSelector((state) => state.auth.user);
    const miles = useSelector((state) => state.milestone.milestones);
    console.log(miles, 'milestones')
    const initialData = useMemo(
        () => [
            {
                id: "m1",
                month: "Jan 2026",
                title: "MVP Launch",
                description: "Ship the MVP to our first 100 users and collect feedback.",
                imageUrl: "/mvp-launch-milestone.jpg",
                subMilestones: [
                    {
                        id: "s1",
                        title: "Beta Invitations",
                        description: "Invite the first 100 beta users and onboard them.",
                        imageUrl: "/beta-invites.jpg",
                    },
                    {
                        id: "s2",
                        title: "Bug Bash",
                        description: "Run a 2-day bug bash with the team.",
                        imageUrl: "/bug-bash.jpg",
                    },
                ],
            },
            {
                id: "m2",
                month: "Feb 2026",
                title: "Payments Integration",
                description: "Enable Stripe payments and subscriptions for early customers.",
                imageUrl: "/payments-integration.jpg",
                subMilestones: [
                    {
                        id: "s3",
                        title: "Checkout Flow",
                        description: "Implement checkout and receipt emails.",
                        imageUrl: "/checkout-flow.jpg",
                    },
                ],
            },
        ],
        [],
    )

    const [milestones, setMilestones] = useState(initialData)
    const [expanded, setExpanded] = useState(() => new Set())
    const [loading, setLoading] = useState(false);;

    // Dialog state for milestone add/edit
    const [milestoneDialog, setMilestoneDialog] = useState({
        open: false,
        mode: "add", // 'add' | 'edit'
        milestone: null,
    })

    // Dialog state for sub-milestone add/edit
    const [subDialog, setSubDialog] = useState({
        open: false,
        parentId: null,
        mode: "add", // 'add' | 'edit'
        subMilestone: null,
    })

    // Dialog state for viewing sub-milestone details
    const [viewDialog, setViewDialog] = useState({
        open: false,
        sub: null,
    })

    const dispatch = useDispatch();

    const gettingAllMilestones = () => {
        dispatch(getAllMilestonesWithSub({ adminId: user?.id, setLoading }))
    }

    useEffect(() => {
        gettingAllMilestones()
    }, [])

    function toggleExpand(id) {
        setExpanded((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    function handleAddMilestoneClick() {
        setMilestoneDialog({ open: true, mode: "add", milestone: null })
    }

    function handleEditMilestone(milestone, e) {
        if (e) e.stopPropagation()
        setMilestoneDialog({ open: true, mode: "edit", milestone })
    }

    function handleViewMilestone(id, e) {
        if (e) e.stopPropagation()
        toggleExpand(id)
    }

    function handleDeleteMilestone(id, e) {
        if (e) e.stopPropagation()
        // setMilestones((list) => list.filter((m) => m.id !== id))
        dispatch(deleteMilestone({ setLoading, milestoneId: id, adminId: user?.id }))
    }

    function handleAddSubMilestone(parentId, e) {
        if (e) e.stopPropagation()
        setSubDialog({ open: true, parentId, mode: "add", subMilestone: null })
    }

    function handleEditSubMilestone(parentId, sub, e) {
        if (e) e.stopPropagation()
        setSubDialog({ open: true, parentId, mode: "edit", subMilestone: sub })
    }

    function handleDeleteSubMilestone(parentId, subId, e) {
        if (e) e.stopPropagation()
        dispatch(deleteSubMilestone({ setLoading, milestoneId: parentId, subId, adminId: user?.id }))
    }

    function handleViewSubMilestone(sub, e) {
        if (e) e.stopPropagation()
        setViewDialog({ open: true, sub })
    }

    // Milestone form submit handler (add or edit)
    async function submitMilestone(form, file, milestoneId) {
        if (milestoneDialog.mode === "add") {
            console.log(form, file, 'form from submit milestone')

            if (!file) {
                toast.error("Select an Image")
                return;
            }

            const imageUrl = await dispatch(uploadImage({ setLoading, parentId: user?.id, file })).unwrap();

            const formData = {
                ...form,
                month: parseInt(form.month),
                imageUrl
            }

            dispatch(createMilestone({ setLoading, formData, adminId: user?.id }))

        } else if (milestoneDialog.mode === "edit" && milestoneDialog.milestone) {
            if (file) {
                const url = await dispatch(uploadImage({ file, parentId: user?.id, setLoading })).unwrap();
                form.imageUrl = url
            }
            dispatch(updateMilestone({ setLoading, adminId: user?.id, body: form, milestoneId }))
        }
        setMilestoneDialog({ open: false, mode: "add", milestone: null })
    }

    // Sub-milestone form submit handler (add or edit)
    async function submitSubMilestone(form, file, subId) {
        const pid = subDialog.parentId
        if (!pid) return

        if (subDialog.mode === "edit" && subDialog.subMilestone) {
            if (file) {
                const url = await dispatch(uploadImage({ setLoading, parentId: user?.id, file })).unwrap();
                form.imageUrl = url
            }

            dispatch(updateSubMilestone({ milestoneId: pid, subId, setLoading, body: form, adminId: user?.id }))
            setSubDialog({ open: false, parentId: null, mode: "add", subMilestone: null })
            return
        }

        const imageUrl = await dispatch(uploadImage({ setLoading, parentId: user?.id, file })).unwrap();

        const formData = {
            ...form,
            imageUrl
        }

        dispatch(createSubMilestone({ setLoading, adminId: user?.id, milestoneId: pid, formData }))

        setExpanded((prev) => {
            const next = new Set(prev)
            next.add(pid)
            return next
        })
        setSubDialog({ open: false, parentId: null, mode: "add", subMilestone: null })
    }

    return (
        <main className="mx-auto w-full p-6 md:p-8">
            {loading && <Loading />}
            <header className="bg-background border-b border-border flex items-center justify-between">
                <div>
                    <h1 className="text-balance text-2xl font-semibold tracking-tight">Milestones</h1>
                    <p className="text-muted-foreground">Manage milestones and sub-milestones.</p>
                </div>

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
            <div className="mb-6 mt-7 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg">Milestones List</h3>
                </div>
                <Button onClick={handleAddMilestoneClick}>
                    <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                    Add Milestone
                </Button>
            </div>

            <section className="rounded-lg border">
                <Table>
                    <TableCaption className="sr-only">Milestone list</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-24">Month</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-12 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {miles?.map((m) => {
                            const isExpanded = expanded.has(m?.id)
                            return (
                                <React.Fragment key={m?.id}>
                                    <TableRow className="cursor-pointer hover:bg-muted/40" onClick={() => toggleExpand(m.id)}>
                                        <TableCell className="font-medium">{m?.month}</TableCell>
                                        <TableCell>{m?.title}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            <span className="line-clamp-2">{m?.description}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" aria-label="Open actions menu">
                                                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={(e) => handleEditMilestone(m, e)}>
                                                        <Pencil className="mr-2 h-4 w-4" aria-hidden="true" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => handleViewMilestone(m.id, e)}>
                                                        <Eye className="mr-2 h-4 w-4" aria-hidden="true" /> View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => handleAddSubMilestone(m.id, e)}>
                                                        <ListPlus className="mr-2 h-4 w-4" aria-hidden="true" /> Add Sub-Milestone
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={(e) => handleDeleteMilestone(m.id, e)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>

                                    {/* Expanded content for sub-milestones */}
                                    <TableRow className="bg-transparent">
                                        <TableCell colSpan={4} className="p-0">
                                            <AnimatePresence initial={false}>
                                                {isExpanded && (
                                                    <motion.div
                                                        key={`${m?.id}-details`}
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -4 }}
                                                        transition={{ duration: 0.18 }}
                                                        className="border-t"
                                                    >
                                                        <div className="bg-gray-50">
                                                            <div className="border-l-4 border-pink-300 p-4">
                                                                <div className="mb-3 flex items-start gap-4">
                                                                    {m?.imageUrl ? (
                                                                        <img
                                                                            src={m.imageUrl || "/placeholder.svg"}
                                                                            alt={`Milestone ${m?.title}`}
                                                                            className="h-16 w-28 rounded-md object-cover"
                                                                        />
                                                                    ) : null}
                                                                    <div className="text-sm text-muted-foreground">
                                                                        <strong className="text-foreground">Details:</strong>{" "}
                                                                        {m?.description || "No additional details."}
                                                                    </div>
                                                                </div>

                                                                <div className="rounded-md border bg-card">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead className="text-sm">Sub-Milestone</TableHead>
                                                                                <TableHead className="text-sm">Description</TableHead>
                                                                                <TableHead className="text-sm w-40">Image</TableHead>
                                                                                <TableHead className="text-sm w-12 text-right">Actions</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {m?.subMilestones && m?.subMilestones.length > 0 ? (
                                                                                m?.subMilestones.map((s) => (
                                                                                    <TableRow key={s.id}>
                                                                                        <TableCell className="text-sm">{s?.title}</TableCell>
                                                                                        <TableCell className="text-sm text-muted-foreground">
                                                                                            <span className="line-clamp-2">{s?.description}</span>
                                                                                        </TableCell>
                                                                                        <TableCell className="text-sm">
                                                                                            {s?.imageUrl ? (
                                                                                                <img
                                                                                                    src={s?.imageUrl || "/placeholder.svg"}
                                                                                                    alt={`Sub-milestone ${s?.title}`}
                                                                                                    className="h-12 w-24 rounded object-cover"
                                                                                                />
                                                                                            ) : (
                                                                                                <span className="text-muted-foreground">—</span>
                                                                                            )}
                                                                                        </TableCell>
                                                                                        <TableCell className="text-right">
                                                                                            <DropdownMenu>
                                                                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                                                                    <Button variant="ghost" size="icon" aria-label="Open actions menu">
                                                                                                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                                                                                                    </Button>
                                                                                                </DropdownMenuTrigger>
                                                                                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                                                    <DropdownMenuSeparator />
                                                                                                    <DropdownMenuItem onClick={(e) => handleEditSubMilestone(m.id, s, e)}>
                                                                                                        <Pencil className="mr-2 h-4 w-4" aria-hidden="true" /> Edit
                                                                                                    </DropdownMenuItem>
                                                                                                    <DropdownMenuItem onClick={(e) => handleViewSubMilestone(s, e)}>
                                                                                                        <Eye className="mr-2 h-4 w-4" aria-hidden="true" /> View
                                                                                                    </DropdownMenuItem>
                                                                                                    <DropdownMenuSeparator />
                                                                                                    <DropdownMenuItem
                                                                                                        className="text-destructive"
                                                                                                        onClick={(e) => handleDeleteSubMilestone(m.id, s.id, e)}
                                                                                                    >
                                                                                                        <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" /> Delete
                                                                                                    </DropdownMenuItem>
                                                                                                </DropdownMenuContent>
                                                                                            </DropdownMenu>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                ))
                                                                            ) : (
                                                                                <TableRow>
                                                                                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                                                                                        No sub-milestones yet. Use the menu to add one.
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            )}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            )
                        })}
                    </TableBody>
                </Table>
            </section>

            {/* Milestone Dialog */}
            <Dialog
                open={milestoneDialog.open}
                onOpenChange={(open) => {
                    if (!open) setMilestoneDialog({ open: false, mode: "add", milestone: null })
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{milestoneDialog.mode === "edit" ? "Edit Milestone" : "Add Milestone"}</DialogTitle>
                        <DialogDescription>
                            {milestoneDialog.mode === "edit"
                                ? "Update the fields below to modify the milestone."
                                : "Fill out the form to add a new milestone."}
                        </DialogDescription>
                    </DialogHeader>
                    <MilestoneForm
                        mode={milestoneDialog.mode}
                        initialValues={milestoneDialog.milestone}
                        onSubmit={submitMilestone}
                        onCancel={() => setMilestoneDialog({ open: false, mode: "add", milestone: null })}

                    />
                </DialogContent>
            </Dialog>

            {/* Sub-Milestone Dialog */}
            <Dialog
                open={subDialog.open}
                onOpenChange={(open) => {
                    if (!open) setSubDialog({ open: false, parentId: null, mode: "add", subMilestone: null })
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{subDialog.mode === "edit" ? "Edit Sub-Milestone" : "Add Sub-Milestone"}</DialogTitle>
                        <DialogDescription>
                            {subDialog.mode === "edit"
                                ? "Update the fields below to modify the sub-milestone."
                                : "Provide a title, description, and optional image URL."}
                        </DialogDescription>
                    </DialogHeader>
                    <SubMilestoneForm
                        mode={subDialog.mode}
                        initialValues={subDialog.subMilestone}
                        onSubmit={submitSubMilestone}
                        onCancel={() => setSubDialog({ open: false, parentId: null, mode: "add", subMilestone: null })}
                        milestoneId={subDialog.parentId}
                    />
                </DialogContent>
            </Dialog>

            {/* View Sub-Milestone Dialog */}
            <Dialog
                open={viewDialog.open}
                onOpenChange={(open) => {
                    if (!open) setViewDialog({ open: false, sub: null })
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{viewDialog.sub?.title || "Sub-Milestone"}</DialogTitle>
                        <DialogDescription className="sr-only">Sub-milestone details</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3">
                        {viewDialog.sub?.imageUrl ? (
                            <img
                                src={viewDialog.sub.imageUrl || "/placeholder.svg"}
                                alt={`Sub-milestone ${viewDialog.sub.title}`}
                                className="h-36 w-full rounded-md object-cover"
                            />
                        ) : null}
                        <p className="text-sm text-muted-foreground">{viewDialog.sub?.description || "No additional details."}</p>
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    )
}

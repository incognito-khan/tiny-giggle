"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  MessageCircle,
  Search,
  User,
  Baby,
  Heart,
  Camera,
  Clock,
  Smile,
  Moon,
  Utensils,
  Bath,
  BookOpen,
  Music,
  Users,
  Plus,
  UserPlus,
  Video,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loading from "@/components/loading";
import { useDispatch, useSelector } from "react-redux";
import { createRelation, getAllRelations } from "@/store/slices/relationSlice";
import { format } from "date-fns";

export default function FamilyFriendsPage() {
  const user = useSelector((state) => state.auth.user);
  const childId = useSelector((state) => state.child.childId);
  const relations = useSelector((state) => state.relation.relations);
  console.log(relations, "relations");
  const [showCreateInvite, setShowCreateInvite] = useState(false);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newInvite, setNewInvite] = useState({
    name: "",
    relation: "",
    dateOfBirth: "",
    dateOfDeath: null,
  });
  const dispatch = useDispatch();

  const gettingAllRelations = () => {
    dispatch(getAllRelations({ setLoading, parentId: user?.id, childId }));
  };

  useEffect(() => {
    gettingAllRelations();
  }, []);

  // Current logged in parent (can be 'mom' or 'dad')
  const [currentParent, setCurrentParent] = useState("mom"); // Sarah is mom

  // Family members and invitations data
  const familyMembers = [
    {
      id: 1,
      name: "Grandma Rose",
      relationship: "Grandmother",
      email: "rose.johnson@email.com",
      phone: "+1 (555) 123-4567",
      status: "Active",
      joinedDate: "2024-01-15",
      avatar: "GR",
      lastActive: "2 hours ago",
      invitedBy: "Sarah Johnson",
    },
    {
      id: 2,
      name: "Grandpa John",
      relationship: "Grandfather",
      email: "john.johnson@email.com",
      phone: "+1 (555) 234-5678",
      status: "Pending",
      joinedDate: "2024-02-20",
      avatar: "GJ",
      lastActive: "Never",
      invitedBy: "Sarah Johnson",
    },
    {
      id: 3,
      name: "Aunt Lisa",
      relationship: "Aunt",
      email: "lisa.smith@email.com",
      phone: "+1 (555) 345-6789",
      status: "Active",
      joinedDate: "2024-03-10",
      avatar: "AL",
      lastActive: "1 day ago",
      invitedBy: "David Johnson",
    },
    {
      id: 4,
      name: "Uncle Mike",
      relationship: "Uncle",
      email: "mike.brown@email.com",
      phone: "+1 (555) 456-7890",
      status: "Inactive",
      joinedDate: "2024-01-25",
      avatar: "UM",
      lastActive: "1 week ago",
      invitedBy: "Sarah Johnson",
    },
    {
      id: 5,
      name: "Nanny Emma",
      relationship: "Caregiver",
      email: "emma.care@email.com",
      phone: "+1 (555) 567-8901",
      status: "Active",
      joinedDate: "2024-04-05",
      avatar: "NE",
      lastActive: "30 minutes ago",
      invitedBy: "Sarah Johnson",
    },
  ];

  const handleCreateInvite = async () => {
    console.log("Creating invite:", newInvite);
    await dispatch(
      createRelation({
        setLoading,
        parentId: user?.id,
        childId,
        formData: newInvite,
      })
    ).unwrap();
    gettingAllRelations();
    setShowCreateInvite(false);
    setNewInvite({ name: "", relation: "", dateOfBirth: "", dateOfDeath: null });
  };

  const handleInviteClick = (member) => {
    setSelectedMember(member);
    setShowInvitePopup(true);
  };

  const handleWhatsAppInvite = () => {
    if (selectedMember) {
      const message = `Hi ${selectedMember.name}! You're invited to join our Tiny Giggle family group to see precious moments of our little ones. Download the app and join us!`;
      const whatsappUrl = `https://wa.me/${selectedMember.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
    setShowInvitePopup(false);
  };

  const handleFaceToFaceInvite = () => {
    console.log("Face to face invite for:", selectedMember?.name);
    setShowInvitePopup(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date) => {
    return format(date, "MMM dd, yyyy");
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {loading && <Loading />}
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 lg:ml-0 ml-64">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                  Hello, Sarah!
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  Connect with family and friends to share your baby's precious
                  moments
                </p>
              </div>

              <div className="flex items-center gap-2 lg:gap-4">
                <div className="relative flex-1 lg:flex-none">
                  <Search className="w-4 h-4 lg:w-5 lg:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search family members..."
                    className="pl-8 lg:pl-10 w-full lg:w-80 bg-gray-50 border-gray-200 rounded-full text-sm"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full"
                >
                  <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 p-0 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </Badge>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full"
                >
                  <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 p-0 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                    5
                  </Badge>
                </Button>

                <div className="hidden lg:flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800">Sarah Johnson</p>
                    <p className="text-sm text-green-500">Online</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-6 space-y-6">
            {/* Main Banner */}
            <div className="relative h-64 lg:h-80 rounded-3xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center">
                <div className="text-center text-white">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <h2 className="text-2xl lg:text-4xl font-bold mb-2">
                    Family & Friends Circle
                  </h2>
                  <p className="text-lg opacity-90">
                    Share Your Baby's Journey with Loved Ones
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Parent Status Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-pink-100 rounded-3xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Parent Access
                  </h3>
                  <div className="flex items-center justify-center gap-12">
                    {/* Mom Avatar */}
                    <div className="text-center">
                      <div className="relative">
                        <Avatar className="w-20 h-20 mx-auto mb-3">
                          <AvatarImage src="/placeholder.svg?height=80&width=80" />
                          <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white text-xl">
                            SJ
                          </AvatarFallback>
                        </Avatar>
                        {currentParent === "mom" && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-gray-800">Mom</p>
                      <p className="text-sm text-gray-600">Sarah Johnson</p>
                      {currentParent === "mom" && (
                        <Badge className="bg-green-100 text-green-700 border-0 rounded-full text-xs mt-2">
                          Activated
                        </Badge>
                      )}
                    </div>

                    {/* Dad Avatar */}
                    <div className="text-center">
                      <div className="relative">
                        <Avatar className="w-20 h-20 mx-auto mb-3">
                          <AvatarImage src="/placeholder.svg?height=80&width=80" />
                          <AvatarFallback className="bg-gradient-to-r from-blue-400 to-green-400 text-white text-xl">
                            DJ
                          </AvatarFallback>
                        </Avatar>
                        {currentParent === "dad" && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-gray-800">Dad</p>
                      <p className="text-sm text-gray-600">David Johnson</p>
                      {currentParent === "dad" && (
                        <Badge className="bg-green-100 text-green-700 border-0 rounded-full text-xs mt-2">
                          Activated
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center gap-3">
                    <Button
                      variant={currentParent === "mom" ? "default" : "outline"}
                      className={`rounded-full ${
                        currentParent === "mom"
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                          : "bg-transparent"
                      }`}
                      onClick={() => setCurrentParent("mom")}
                    >
                      Switch to Mom
                    </Button>
                    <Button
                      variant={currentParent === "dad" ? "default" : "outline"}
                      className={`rounded-full ${
                        currentParent === "dad"
                          ? "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                          : "bg-transparent"
                      }`}
                      onClick={() => setCurrentParent("dad")}
                    >
                      Switch to Dad
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Family Members List */}
            <Card className="bg-white/80 backdrop-blur-sm border-pink-100 rounded-3xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-800">
                    Family & Friends Invitations
                  </CardTitle>
                  <Button
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full"
                    onClick={() => setShowCreateInvite(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relations?.map((member) => (
                    <Card
                      key={member.id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 rounded-2xl hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => handleInviteClick(member)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={`/placeholder.svg?height=48&width=48`}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
                              {member?.name?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 rounded-full hover:bg-pink-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl"
                            >
                              <DropdownMenuItem className="rounded-lg">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg">
                                <Send className="w-4 h-4 mr-2" />
                                Resend Invite
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 rounded-lg">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-800">
                            {member?.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {member?.relation}
                          </p>
                          {/* <div className="flex items-center justify-between">
                            <Badge
                              className={`${getStatusColor(member.status)} border-0 rounded-full text-xs`}
                            >
                              {member.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {member.lastActive}
                            </span>
                          </div> */}
                          <div className="text-xs text-gray-500">
                            <p>Invited by: {user?.name}</p>
                            <p>Joined: {formatDate(member?.createdAt)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Add New Member Card */}
                  <Card
                    className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 border-dashed rounded-2xl hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setShowCreateInvite(true)}
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[200px]">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mb-3">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Add Family Member
                      </h3>
                      <p className="text-sm text-gray-600 text-center">
                        Invite grandparents, relatives, or caregivers
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Invitation Dialog */}
      <Dialog open={showCreateInvite} onOpenChange={setShowCreateInvite}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Invite Family Member
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Grandma Rose"
                value={newInvite.name}
                onChange={(e) =>
                  setNewInvite({ ...newInvite, name: e.target.value })
                }
                className="mt-1 rounded-full"
              />
            </div>

            <div>
              <Label
                htmlFor="relationship"
                className="text-sm font-medium text-gray-700"
              >
                Relationship
              </Label>
              <Select
                value={newInvite.relation}
                onValueChange={(value) =>
                  setNewInvite({ ...newInvite, relation: value })
                }
              >
                <SelectTrigger className="mt-1 rounded-full">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GRANDMA">Grandmother</SelectItem>
                  <SelectItem value="GRANDPA">Grandfather</SelectItem>
                  <SelectItem value="UNCLE">Uncle</SelectItem>
                  <SelectItem value="AUNT">Aunt</SelectItem>
                  <SelectItem value="BROTHER">Brother</SelectItem>
                  <SelectItem value="SISTER">Sister</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="dateOfBirth"
                className="text-sm font-medium text-gray-700"
              >
                Date Of Birth
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={
                  newInvite.dateOfBirth
                    ? new Date(newInvite.dateOfBirth)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setNewInvite({
                    ...newInvite,
                    dateOfBirth: new Date(e.target.value).toISOString(),
                  })
                }
                className="mt-1 rounded-full"
              />
            </div>

            <div>
              <Label
                htmlFor="dateOfDeath"
                className="text-sm font-medium text-gray-700"
              >
                Date Of Death
              </Label>
              <Input
                id="dateOfDeath"
                type="date"
                value={
                  newInvite.dateOfDeath
                    ? new Date(newInvite.dateOfDeath)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setNewInvite({
                    ...newInvite,
                    dateOfDeath: new Date(e.target.value).toISOString(),
                  })
                }
                className="mt-1 rounded-full"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 rounded-full bg-transparent"
                onClick={() => setShowCreateInvite(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full"
                onClick={handleCreateInvite}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Method Popup */}
      <Dialog open={showInvitePopup} onOpenChange={setShowInvitePopup}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Invite {selectedMember?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <Avatar className="w-16 h-16 mx-auto mb-3">
                <AvatarImage src={`/placeholder.svg?height=64&width=64`} />
                <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white text-lg">
                  {selectedMember?.avatar}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-gray-800">
                {selectedMember?.name}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedMember?.relationship}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">
                Choose how you'd like to invite {selectedMember?.name} to join
                your family circle:
              </p>

              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full py-3"
                onClick={handleWhatsAppInvite}
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Send WhatsApp Invitation
              </Button>

              <Button
                variant="outline"
                className="w-full border-purple-300 hover:bg-purple-50 rounded-full py-3 bg-transparent"
                onClick={handleFaceToFaceInvite}
              >
                <Video className="w-5 h-5 mr-3" />
                Face to Face Invite
              </Button>
            </div>

            <div className="text-center pt-2">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowInvitePopup(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

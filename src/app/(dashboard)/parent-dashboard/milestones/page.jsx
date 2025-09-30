"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMilestones,
  createMilestone,
} from "@/store/slices/milestoneSlice";
import { uploadImage } from "@/store/slices/mediaSlice";
import Loading from "@/components/loading";
import { Plus, Star, Search, MessageCircle, Bell } from "lucide-react";
import { MilestoneCard } from "@/components/parent-dashboard/milestoneCard/milestoneCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Milestones() {
  const milestones = useSelector((state) => state.milestone.milestones);
  console.log(milestones, "milestones");
  const user = useSelector((state) => state.auth.user);
  const childId = useSelector((state) => state.child.childId);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();

  const gettingAllMilestones = () => {
    dispatch(getAllMilestones({ setLoading, parentId: user.id, childId }));
  };

  useEffect(() => {
    gettingAllMilestones();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await dispatch(
        uploadImage({ setLoading, parentId: user.id, file })
      ).unwrap();
      const finalFormData = {
        ...formData,
        imageUrl: imageUrl,
      };
      await dispatch(
        createMilestone({
          setLoading,
          childId,
          parentId: user.id,
          formData: finalFormData,
        })
      ).unwrap();
      gettingAllMilestones();
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        date: "",
      });
      setFile(null);
      setPreview(null);
    } catch (error) {
      toast.error(err.response?.data?.message || "Failed to add milestone.");
      return console.error(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-background">
      {loading && <Loading />}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
              Hello, Sarah!
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Keep track of your baby's vaccination schedule and health records
            </p>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="relative flex-1 lg:flex-none">
              <Search className="w-4 h-4 lg:w-5 lg:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search vaccinations..."
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Add Milestone Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Recent Milestones
            </h2>
            <p className="text-sm text-muted-foreground">
              {milestones.length} milestone{milestones.length !== 1 ? "s" : ""}{" "}
              recorded
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Milestone
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-gray-800">
                  Add New Milestone
                </DialogTitle>
              </DialogHeader>

              <form className="space-y-4">
                <div>
                  <Label className="mb-2">Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="First Walk"
                  />
                </div>

                <div>
                  <Label className="mb-2">Description</Label>
                  <Input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Baby’s first walk"
                  />
                </div>

                <div>
                  <Label className="mb-2">Date</Label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

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

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  onClick={handleAddMilestone}
                >
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {milestones?.map((milestone) => (
            <MilestoneCard
              key={milestone?.id}
              title={milestone?.title}
              description={milestone?.description}
              date={milestone?.date}
              image={milestone?.imageUrl}
            />
          ))}
        </div>

        {/* Empty State (if no milestones) */}
        {milestones.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No milestones yet
            </h3>
            <p className="text-muted-foreground mb-6 text-pretty">
              Start tracking your child's precious moments and achievements
            </p>
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Milestone
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

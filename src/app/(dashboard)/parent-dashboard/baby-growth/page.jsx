"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Activity,
  Heart,
  Thermometer,
  Scale,
  Ruler,
  Baby,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Search,
  MessageCircle,
  Bell,
  Dumbbell,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  getLatestGrowth,
  createGrowth,
  getAllGrowths,
} from "@/store/slices/growthSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@/components/loading";

// Sample growth data

const healthMetrics = [
  {
    name: "Temperature",
    value: 98.6,
    unit: "°F",
    status: "normal",
    icon: Thermometer,
    color: "text-green-600",
  },
  {
    name: "Heart Rate",
    value: 120,
    unit: "bpm",
    status: "normal",
    icon: Heart,
    color: "text-green-600",
  },
  {
    name: "Sleep Hours",
    value: 14,
    unit: "hrs/day",
    status: "good",
    icon: Activity,
    color: "text-blue-600",
  },
  {
    name: "Feeding",
    value: 8,
    unit: "times/day",
    status: "normal",
    icon: Baby,
    color: "text-green-600",
  },
];

const infectionHistory = [
  {
    date: "2024-07-20",
    type: "Common Cold",
    severity: "Mild",
    duration: "5 days",
    status: "Recovered",
  },
  {
    date: "2024-06-10",
    type: "Diaper Rash",
    severity: "Mild",
    duration: "3 days",
    status: "Recovered",
  },
  {
    date: "2024-05-15",
    type: "Ear Infection",
    severity: "Moderate",
    duration: "7 days",
    status: "Recovered",
  },
];

const nutritionData = [
  { name: "Milk", value: 60, color: "#8884d8" },
  { name: "Formula", value: 25, color: "#82ca9d" },
  { name: "Solid Food", value: 15, color: "#ffc658" },
];

export default function GrowthPage() {
  const user = useSelector((state) => state.auth.user);
  const childId = useSelector((state) => state.child.childId);
  const growth = useSelector((state) => state.growth.growth);
  const growths = useSelector((state) => state.growth.growths);
  console.log(growth, growths, "growth");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const gettingLatestGrowths = () => {
    dispatch(getLatestGrowth({ setLoading, parentId: user?.id, childId }));
  };
  const gettingAllGrowths = () => {
    dispatch(getAllGrowths({ setLoading, parentId: user?.id, childId }));
  };

  useEffect(() => {
    gettingLatestGrowths();
    gettingAllGrowths();
  }, []);

  const getHeightPercentile = (h) => {
    if (h < 20) return 40;
    if (h < 25) return 60;
    if (h < 30) return 75;
    return 80;
  };

  const getWeightPercentile = (w) => {
    if (w < 15) return 40;
    if (w < 18) return 65;
    if (w < 20) return 75;
    return 85;
  };

  const currentAge = "8 months";
  const currentWeight = 9.0;
  const currentHeight = 73;
  const weightPercentile = getWeightPercentile(growth?.height);
  const heightPercentile = getHeightPercentile(growth?.weight);

  const formatAge = (age) => {
    const parts = [];
    if (age?.years > 0)
      parts.push(`${age?.years} year${age?.years > 1 ? "s" : ""}`);
    if (age?.months > 0)
      parts.push(`${age?.months} month${age?.months > 1 ? "s" : ""}`);
    if (age?.days > 0) parts.push(`${age?.days} day${age?.days > 1 ? "s" : ""}`);
    return parts.length > 0 ? parts.join(" ") : "0 days";
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-pink-50 to-purple-100">
      {loading && <Loading />}
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
                Keep track of your baby's vaccination schedule and health
                records
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

        {/* Banner */}
        <div className="p-4 lg:p-6 space-y-6">
          <div className="relative h-64 lg:h-80 rounded-3xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative px-6 py-16">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 p-4 rounded-full">
                      <TrendingUp className="h-12 w-12" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold mb-4">
                    Baby Growth Tracker
                  </h1>
                  <p className="text-xl opacity-90">
                    Monitor your baby's development, health, and milestones
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Current Age</p>
                    <p className="text-2xl font-bold">
                      {growths?.[0]?.age && formatAge(growths?.[0]?.age)}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Weight</p>
                    <p className="text-2xl font-bold">{growth?.weight} kg</p>
                    {/* <p className="text-green-100 text-xs">
                      {weightPercentile}th percentile
                    </p> */}
                  </div>
                  <Scale className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Height</p>
                    <p className="text-2xl font-bold">{growth?.height} cm</p>
                    {/* <p className="text-purple-100 text-xs">
                      {heightPercentile}th percentile
                    </p> */}
                  </div>
                  <Ruler className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Health Status</p>
                    <p className="text-2xl font-bold">Excellent</p>
                    <p className="text-orange-100 text-xs">
                      All metrics normal
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="growth">Growth Charts</TabsTrigger>
              <TabsTrigger value="health">Health Metrics</TabsTrigger>
              <TabsTrigger value="growths">Growths History</TabsTrigger>
              <TabsTrigger value="infections">Health History</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Growth Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Height Progress
                        </span>
                        <Badge className="bg-green-100 text-green-800">
                          Above Average
                        </Badge>
                      </div>
                      <Progress value={heightPercentile} className="h-2" />
                      <p className="text-xs text-gray-600">
                        {heightPercentile}th percentile for age
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Weight Progress
                        </span>
                        <Badge className="bg-blue-100 text-blue-800">
                          Healthy Range
                        </Badge>
                      </div>
                      <Progress value={weightPercentile} className="h-2" />
                      <p className="text-xs text-gray-600">
                        {weightPercentile}th percentile for age
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Health Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Health Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {healthMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full bg-gray-100 ${metric.color}`}
                          >
                            <metric.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{metric.name}</p>
                            <p className="text-xs text-gray-600">
                              {metric.value} {metric.unit}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Recent Growths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">Weight</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">Height</p>
                        </div>
                      </div>
                    </div>
                    {growths?.slice(0, 4)?.map((growth, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full bg-red-100`}>
                            <Dumbbell className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">{growth?.weight}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{growth?.height}</p>
                          </div>
                          <div className={`p-2 rounded-full bg-green-100`}>
                            <Ruler className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Growth Charts Tab */}
            <TabsContent value="growth" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Height Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="h-5 w-5" />
                      Height Growth Chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={growths}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(dateStr) =>
                            new Date(dateStr).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          }
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(dateStr) =>
                            new Date(dateStr).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          }
                          formatter={(value, name) => [`${value} cm`, "Height"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="height"
                          stroke="#8884d8"
                          strokeWidth={3}
                          dot={{ fill: "#8884d8", strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Weight Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Weight Growth Chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={growths}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(dateStr) =>
                            new Date(dateStr).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          }
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(dateStr) =>
                            new Date(dateStr).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          }
                          formatter={(value, name) => [`${value} kg`, "Weight"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="weight"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.3}
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Growth Percentiles */}
              <Card>
                <CardHeader>
                  <CardTitle>Growth Percentiles Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={growths}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(dateStr) =>
                          new Date(dateStr).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(dateStr) =>
                          new Date(dateStr).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="height"
                        stroke="#8884d8"
                        strokeWidth={2}
                        name="Height"
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Weight"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Health Metrics Tab */}
            <TabsContent value="health" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {healthMetrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-full bg-gray-100 ${metric.color}`}
                        >
                          <metric.icon className="h-6 w-6" />
                        </div>
                        <Badge
                          variant={
                            metric.status === "normal" ? "default" : "secondary"
                          }
                        >
                          {metric.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg">{metric.name}</h3>
                      <p className="text-2xl font-bold">
                        {metric.value}{" "}
                        <span className="text-sm font-normal text-gray-600">
                          {metric.unit}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Nutrition Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Nutrition Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={nutritionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {nutritionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Daily Health Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Sleep Quality
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-20 h-2" />
                          <span className="text-sm">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Feeding Schedule
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress value={92} className="w-20 h-2" />
                          <span className="text-sm">92%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Activity Level
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress value={78} className="w-20 h-2" />
                          <span className="text-sm">78%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Mood</span>
                        <div className="flex items-center gap-2">
                          <Progress value={88} className="w-20 h-2" />
                          <span className="text-sm">88%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Growths Tab */}
            <TabsContent value="growths" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Grwoths History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {growths?.map((growth, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full bg-red-100`}>
                            <Dumbbell className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">{growth?.weight}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{growth?.height}</p>
                          </div>
                          <div className={`p-2 rounded-full bg-green-100`}>
                            <Ruler className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Health History Tab */}
            <TabsContent value="infections" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Health History & Infections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {infectionHistory.map((infection, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-full ${
                              infection.status === "Recovered"
                                ? "bg-green-100"
                                : "bg-yellow-100"
                            }`}
                          >
                            {infection.status === "Recovered" ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">{infection.type}</h4>
                            <p className="text-sm text-gray-600">
                              {infection.date} • {infection.severity} severity •
                              Duration: {infection.duration}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            infection.status === "Recovered"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {infection.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Health Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      No Active Infections
                    </h3>
                    <p className="text-sm text-gray-600">
                      Baby is currently healthy with no ongoing health issues
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Heart className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      Strong Immunity
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quick recovery from minor infections shows good immune
                      system
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Activity className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      Regular Checkups
                    </h3>
                    <p className="text-sm text-gray-600">
                      Maintaining regular pediatric visits for preventive care
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

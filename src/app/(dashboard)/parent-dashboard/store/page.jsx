"use client";

import { useState, useEffect } from "react";
import CategoryTabs from "@/components/parent-dashboard/shopping/category-tabs";
import ProductGrid from "@/components/parent-dashboard/shopping/product-grid";
import { Bell, MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/store/slices/productSlice";
import { getAllCategories } from "@/store/slices/categorySlice";
import Loading from "@/components/loading";

export default function BabyShoppingPage() {
  const products = useSelector((state) => state.product.products);
  console.log(products);
  const categories = useSelector((state) => state.category.categories);
  console.log(categories);
  const [activeCategory, setActiveCategory] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const dispatch = useDispatch();

  const gettingAllProducts = () => {
    dispatch(getAllProducts({ setLoading }));
  };

  const gettingAllCategories = () => {
    dispatch(getAllCategories({ setLoading }));
  };

  useEffect(() => {
    gettingAllProducts();
    gettingAllCategories();
  }, []);

  useEffect(() => {
    if (activeCategory === 1) {
      setFilteredProducts(products);
    } else {
      const filterd = products.filter(
        (product) => product.categoryId === activeCategory
      );
      setFilteredProducts(filterd);
    }
  }, [activeCategory, products]);

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
              Here are all your little ones and their precious details
            </p>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="relative flex-1 lg:flex-none">
              <Search className="w-4 h-4 lg:w-5 lg:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search anything here"
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
      {/* Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categories}
        type={"Products"}
      />

      {/* Product Grid */}
      <ProductGrid products={filteredProducts} />
    </div>
  );
}

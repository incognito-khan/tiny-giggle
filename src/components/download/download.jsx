import { ChevronDown } from "lucide-react"
import { FaApple } from "react-icons/fa";
import { IoLogoGooglePlaystore } from "react-icons/io5";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { FaWindows } from "react-icons/fa";

export default function Download() {
  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Download Mobile Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center">
          <div className="mb-8 relative w-full">
            <div className="w-full border  bg-gray-200 rounded-3xl shadow-2xl relative overflow-hidden">
              <img src="/Mobile.png" alt="Mobile.png" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-brand mb-8">
            Tiny Giggle<span className="text-secondary">.</span>
          </h1>

          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
              <FaApple className="w-7 h-7" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="font-semibold">App Store</div>
              </div>
            </button>

            <button className="bg-secondary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
              <IoLogoGooglePlaystore className="w-7 h-7" />
              <div className="text-left">
                <div className="text-xs">GET IT ON</div>
                <div className="font-semibold">Google Play</div>
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center">
          <div className="mb-8 relative w-full">
            <div className="w-full bg-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">
              <img src="/Desktop.png" alt="Desktop.png" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-brand mb-8">
            Desktop<span className="text-secondary">.</span>
          </h1>
          <div className="flex gap-4 w-full">
            {/* Mac */}
            <Button variant="outline" className="rounded-full px-5 py-5 w-1/2 ">
              <FaApple className="w-20 h-20 text-4xl" />
              <span>Mac</span>
            </Button>

            {/* Windows Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full p-5 inline-flex items-center w-1/2">
                  <FaWindows className="w-5 h-5" />
                  <span>Windows</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem>Windows (64-bit)</DropdownMenuItem>
                <DropdownMenuItem>Windows (ARM 64-bit)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

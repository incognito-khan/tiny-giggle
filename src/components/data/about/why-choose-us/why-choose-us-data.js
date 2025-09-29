import { PinIcon as Pinwheel, Shield, Home, Heart } from "lucide-react";

export const cardsData = [
  {
    id: 1,
    title: "Safe & Trusted",
    description:
      "Secure environment with trained staff, CCTV, and trusted pickup protocols so parents can relax.",
    icon: <Shield className="w-6 h-6 text-white" />,
    iconBg: "#FFA69E",
  },
  {
    id: 2,
    title: "Tailored Growth Plans",
    description:
      "Individual learning plans and activity suggestions based on each child's progress and interests.",
    icon: <Home className="w-6 h-6 text-white" />,
    iconBg: "#A8E6CF",
  },
  {
    id: 3,
    title: "Capture & Share Moments",
    description:
      "Private photo journals and weekly highlights let you keep and share every little milestone.",
    icon: <Heart className="w-6 h-6 text-white" />,
    iconBg: "#FFD93D",
  },
];

import { Bus, Palette, Star, Building2 } from "lucide-react";

export const sessionsData = [
  {
    key: "brain",
    title: "Brain Boosters",
    time: "8:00 AM - 9:30 AM",
    icon: Bus,
    isMain: true,
    bgImage:
      "https://html.vecurosoft.com/toddly/demo/assets/img/elements/session-main-block.png",
    description:
      "Fun puzzles and simple problem-solving games to strengthen early thinking and focus.",
  },
  {
    key: "drawing",
    title: "Art Explorers",
    time: "9:45 AM - 10:30 AM",
    icon: Palette,
    color: "bg-orange-500",
    bgImage:
      "https://html.vecurosoft.com/toddly/demo/assets/img/elements/session-main-block.png",
    description:
      "Hands-on painting & crafting sessions to boost creativity and fine motor skills.",
  },
  {
    key: "alphabet",
    title: "Letter Lab",
    time: "10:45 AM - 11:30 AM",
    icon: Star,
    color: "bg-purple-700",
    bgImage:
      "https://html.vecurosoft.com/toddly/demo/assets/img/elements/session-main-block.png",
    description:
      "Playful alphabet activities that make letters memorable through games and songs.",
  },
  {
    key: "playland",
    title: "Playland & Parent Café",
    time: "11:45 AM - 1:00 PM",
    icon: Building2,
    color: "bg-teal-500",
    bgImage:
      "https://html.vecurosoft.com/toddly/demo/assets/img/elements/session-main-block.png",
    description:
      "Free play with supervised zones for toddlers and a cozy café area where parents can relax.",
  },
];

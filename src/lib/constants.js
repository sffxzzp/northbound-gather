export const CATEGORY_STYLES = {
  "Hiking": {
    gradient: "from-emerald-600 to-green-900",
    text: "text-emerald-100",
    bg: "bg-emerald-100",
    label: "text-emerald-800",
    icon: "text-emerald-500",
    solid: "bg-emerald-600"
  },
  "Camping": {
    gradient: "from-amber-700 to-orange-900",
    text: "text-amber-100",
    bg: "bg-amber-100",
    label: "text-amber-800",
    icon: "text-amber-600",
    solid: "bg-amber-700"
  },
  "Skiing": {
    gradient: "from-sky-500 to-blue-800",
    text: "text-sky-100",
    bg: "bg-sky-100",
    label: "text-sky-800",
    icon: "text-sky-500",
    solid: "bg-sky-500"
  },
  "Kayaking": {
    gradient: "from-cyan-600 to-blue-900",
    text: "text-cyan-100",
    bg: "bg-cyan-100",
    label: "text-cyan-800",
    icon: "text-cyan-600",
    solid: "bg-cyan-600"
  },
  "Social": {
    gradient: "from-pink-600 to-rose-900",
    text: "text-pink-100",
    bg: "bg-pink-100",
    label: "text-pink-800",
    icon: "text-pink-500",
    solid: "bg-pink-600"
  },
  "Other": {
    gradient: "from-slate-600 to-slate-900",
    text: "text-slate-100",
    bg: "bg-slate-100",
    label: "text-slate-800",
    icon: "text-slate-500",
    solid: "bg-slate-600"
  }
};

export const CATEGORIES = Object.keys(CATEGORY_STYLES);

export const getCategoryStyle = (category) => {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES["Other"];
};

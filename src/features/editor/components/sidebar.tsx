"use client";

import {
  ImageIcon,
  LayoutTemplate,
  Pencil,
  Settings,
  Shapes,
  Sparkles,
  Type,
} from "lucide-react";
import React from "react";
import { ActiveTool } from "../types";
import SidebarItem from "./sidebar-item";

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const sidebarItems = [
  {
    icon: LayoutTemplate,
    label: "Design",
    activeTool: "templates",
  },
  {
    icon: ImageIcon,
    label: "Image",
    activeTool: "images",
  },
  {
    icon: Type,
    label: "Text",
    activeTool: "text",
  },
  {
    icon: Shapes,
    label: "Shapes",
    activeTool: "shapes",
  },
  {
    icon: Pencil,
    label: "Draw",
    activeTool: "draw",
  },
  {
    icon: Sparkles,
    label: "AI",
    activeTool: "ai",
  },
  {
    icon: Settings,
    label: "Settings",
    activeTool: "settings",
  },
];

export default function Sidebar({
  activeTool,
  onChangeActiveTool,
}: SidebarProps) {
  return (
    <aside className="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto">
      <ul className="flex flex-col">
        {sidebarItems.map((item, i) => (
          <SidebarItem
            key={i}
            icon={item.icon}
            label={item.label}
            isActive={activeTool === item.activeTool}
            onClick={() => onChangeActiveTool(item.activeTool as ActiveTool)}
          />
        ))}
      </ul>
    </aside>
  );
}

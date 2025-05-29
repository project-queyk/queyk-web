"use client";

import Image from "next/image";
import { useState } from "react";

import { floors } from "@/lib/floors";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MobileFloorPlans() {
  const [selectedFloor, setSelectedFloor] = useState("ground");

  const currentFloor =
    floors.find((floor) => floor.id === selectedFloor) || floors[0];

  return (
    <div className="space-y-4">
      <Select defaultValue="ground" onValueChange={setSelectedFloor}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select floor" />
        </SelectTrigger>
        <SelectContent>
          {floors.map((floor) => (
            <SelectItem key={floor.id} value={floor.id}>
              {floor.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="animate-in fade-in-50">
        <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-md">
          <Image
            src={currentFloor.imageSrc}
            alt={`${currentFloor.title} Earthquake Evacuation Plan`}
            width={1280}
            height={720}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

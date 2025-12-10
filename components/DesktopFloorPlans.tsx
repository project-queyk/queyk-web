import Image from "next/image";
import { useState } from "react";

import { floors } from "@/lib/floors";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DesktopFloorPlans() {
  const [isGif, setIsGif] = useState(false);

  function handleToggleIsGif() {
    setIsGif((prev) => !prev);
  }

  return (
    <Tabs defaultValue="ground" className="w-full">
      <TabsList className="flex w-full">
        {floors.map((floor) => (
          <TabsTrigger
            key={floor.id}
            value={floor.id}
            className="flex-1 text-sm"
          >
            {floor.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {floors.map((floor) => (
        <TabsContent key={floor.id} value={floor.id} className="mt-4">
          <p className="text-foreground/70 mb-4 text-center text-xs">
            Tap the image to {isGif ? "hide" : "show"} evacuation arrows
          </p>
          <button
            className="relative mx-auto flex aspect-video w-full max-w-4xl cursor-pointer items-center overflow-hidden rounded-md"
            onClick={handleToggleIsGif}
          >
            <Image
              src={isGif ? floor.gifSrc : floor.imageSrc}
              alt={`${floor.title} Earthquake Evacuation Plan`}
              width={1280}
              height={720}
              className="object-contain"
              priority={floor.id === "ground"}
              unoptimized={isGif ? true : false}
            />
          </button>
          {isGif && (
            <div className="mt-2 grid gap-2">
              <p className="text-destructive text-center text-sm font-semibold">
                Emergency Exit
              </p>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

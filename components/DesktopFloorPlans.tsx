import Image from "next/image";

import { floors } from "@/lib/floors";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DesktopFloorPlans() {
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
          <div className="relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-md">
            <Image
              src={floor.imageSrc}
              alt={`${floor.title} Earthquake Evacuation Plan`}
              width={1280}
              height={720}
              className="object-contain"
              priority={floor.id === "ground"}
            />
          </div>
          <div className="mt-2 text-center">
            <h3 className="font-medium">{floor.title}</h3>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

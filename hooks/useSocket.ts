import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { ReadingData } from "@/lib/types/readings";
import { EarthquakeData } from "@/lib/types/earthquake";

interface ReadingsResponse {
  data: ReadingData[];
  firstDate?: string;
  batteryLevel?: number;
  aiSummary?: string;
  pdfBase64?: string;
}

interface EarthquakesResponse {
  data: EarthquakeData[];
  aiSummary?: string;
}

let socket: Socket;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    if (backendUrl.includes("vercel.app")) {
      const pollReadings = () => {
        queryClient.invalidateQueries({ queryKey: ["readings"] });
      };

      const pollEarthquakes = () => {
        queryClient.invalidateQueries({ queryKey: ["earthquakes"] });
      };

      const readingsInterval = setInterval(pollReadings, 30000);
      const earthquakesInterval = setInterval(pollEarthquakes, 30000);

      setIsConnected(true);

      return () => {
        clearInterval(readingsInterval);
        clearInterval(earthquakesInterval);
      };
    }

    socket = io(backendUrl);

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("newReading", (newReading: ReadingData) => {
      queryClient.setQueryData(
        ["readings"],
        (oldData: ReadingsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: [newReading, ...(oldData.data || [])],
          };
        },
      );
    });

    socket.on("newEarthquake", (newEarthquake: EarthquakeData) => {
      queryClient.setQueryData(
        ["earthquakes"],
        (oldData: EarthquakesResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: [newEarthquake, ...(oldData.data || [])],
          };
        },
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return { isConnected };
};

export type EarthquakeData = {
  id: string;
  magnitude: number;
  duration: number;
  createdAt: Date;
  riskLevel: "minor" | "moderate" | "major" | "severe";
};

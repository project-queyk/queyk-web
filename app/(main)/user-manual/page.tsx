import { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "User Manual",
  description:
    "Complete guide to using the Queyk earthquake monitoring system. Learn how to navigate the dashboard, access safety protocols, view evacuation plans, and understand seismic activity data visualization features.",
};

const userManualSections = [
  {
    header: "Getting Started",
    description: "Basic introduction to the Queyk earthquake monitoring system",
    bulletItems: [
      {
        title: "Login",
        description:
          "Access the system using your school email credentials through the Google login option on the homepage.",
      },
      {
        title: "Dashboard Overview",
        description:
          "Upon login, you'll see the main dashboard showing current seismic activity data and key metrics for today.",
      },
      {
        title: "Navigation",
        description:
          "Use the sidebar menu to access different sections including Dashboard, Protocols, Evacuation Plan, and User Manual.",
      },
    ],
  },
  {
    header: "Dashboard Features",
    description: "Understanding the earthquake monitoring dashboard",
    bulletItems: [
      {
        title: "Seismic Activity Chart",
        description:
          "The main chart displays hourly magnitude and frequency readings throughout the day. Click on data points for details.",
      },
      {
        title: "Peak Magnitude",
        description:
          "Shows the highest seismic reading of the day and when it occurred.",
      },
      {
        title: "Average Magnitude",
        description:
          "Displays the average seismic activity level across all hours today.",
      },
      {
        title: "Significant Hours",
        description:
          "Indicates how many hours experienced notable seismic activity (above 1.0 magnitude).",
      },
      {
        title: "Peak Activity",
        description:
          "Shows the hour with the most frequent seismic events and the count.",
      },
    ],
  },
  {
    header: "Safety Protocols",
    description: "How to access and use safety information",
    bulletItems: [
      {
        title: "Accessing Protocols",
        description:
          "Navigate to the Protocols section from the sidebar to view earthquake preparedness, during-earthquake, and post-earthquake guidance.",
      },
      {
        title: "Finding Evacuation Sites",
        description:
          "Use the 'Find Nearest Evacuation Site' button on the Protocols page to view evacuation options.",
      },
      {
        title: "Safety Alerts",
        description:
          "The system will display prominent alerts when significant seismic activity is detected.",
      },
    ],
  },
  {
    header: "Evacuation Plan",
    description: "Understanding evacuation floor plans and assembly points",
    bulletItems: [
      {
        title: "Accessing Floor Plans",
        description:
          "The evacuation plan page displays official floor plans of campus buildings with marked emergency exits.",
      },
      {
        title: "Emergency Exit Routes",
        description:
          "Highlighted paths show the quickest routes to safety from any point in the building.",
      },
      {
        title: "Saving for Offline Use",
        description:
          "Download floor plans to your device for access during emergencies when internet may be unavailable.",
      },
    ],
  },
];

export default function Page() {
  return (
    <div className="grid gap-3">
      <p className="text-muted-foreground">
        Complete guide to using the Queyk earthquake monitoring system
      </p>
      {userManualSections.map((section) => (
        <Card className="w-full" key={section.header}>
          <CardHeader className="mx-4.5 flex flex-col items-stretch space-y-0 border-b p-0">
            <div className="flex flex-1 flex-col justify-center gap-1 px-1.5 pt-2">
              <CardTitle>{section.header}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 px-6 pb-4">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {section.bulletItems.map((bullet) => (
                <div className="flex flex-col gap-2" key={bullet.title}>
                  <h3 className="text-primary font-semibold">{bullet.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {bullet.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="text-muted-foreground mt-2 text-center text-xs md:text-sm">
        © {new Date().getFullYear()} Queyk Project - All Rights Reserved
      </div>
    </div>
  );
}

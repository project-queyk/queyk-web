import { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the Queyk earthquake monitoring system. Learn how we collect, use, and protect your personal information while providing seismic monitoring services.",
};

const privacySections = [
  {
    header: "Information We Collect",
    description: "Types of data collected through the Queyk system",
    bulletItems: [
      {
        title: "User Account Information",
        description:
          "When you sign in with Google, we collect your email address, full name, Google profile ID, and profile picture to create and maintain your account.",
      },
      {
        title: "User Preferences",
        description:
          "We store your alert notification preferences to customize your experience and ensure you receive important safety alerts according to your settings.",
      },
      {
        title: "Usage Analytics",
        description:
          "Basic usage data may be collected to improve system performance and user experience, but no personal browsing habits are tracked or stored.",
      },
    ],
  },
  {
    header: "How We Use Your Information",
    description: "Our practices for using collected data",
    bulletItems: [
      {
        title: "Account Authentication",
        description:
          "Your Google OAuth ID is used to securely authenticate your account and provide access to the earthquake monitoring dashboard.",
      },
      {
        title: "Emergency Notifications",
        description:
          "Your email and notification preferences are used to send critical earthquake alerts and safety information when significant seismic activity is detected.",
      },
      {
        title: "Service Personalization",
        description:
          "Your profile information helps personalize your dashboard experience and ensures appropriate access levels based on your user role.",
      },
    ],
  },
  {
    header: "Data We Do NOT Collect",
    description: "Information we explicitly do not gather or store",
    bulletItems: [
      {
        title: "Location Tracking",
        description:
          "We do not track your real-time location or store GPS coordinates. Floor plan and evacuation data is static and not tied to your personal movements.",
      },
      {
        title: "Browsing History",
        description:
          "We do not monitor your web browsing outside of the Queyk system or track your activity on other websites or applications.",
      },
      {
        title: "Personal Communications",
        description:
          "We do not access, store, or monitor your personal emails, messages, or communications outside of system-generated notifications.",
      },
    ],
  },
  {
    header: "Data Security & Storage",
    description: "How we protect your information",
    bulletItems: [
      {
        title: "Secure Authentication",
        description:
          "All authentication is handled through Google's secure OAuth system. We never store or have access to your Google password.",
      },
      {
        title: "Data Encryption",
        description:
          "All data transmission uses HTTPS encryption, and stored data is protected using industry-standard security measures and access controls.",
      },
      {
        title: "Limited Data Retention",
        description:
          "Account information is retained only while your account is active. Seismic monitoring data is kept for research and safety analysis purposes.",
      },
    ],
  },
  {
    header: "Your Privacy Rights",
    description: "Control over your personal information",
    bulletItems: [
      {
        title: "Access Your Data",
        description:
          "You can view all stored personal information through your account profile and modify your notification preferences at any time.",
      },
      {
        title: "Account Deletion",
        description:
          "You may request complete account deletion, which will remove all personal information while preserving anonymous seismic data for safety research.",
      },
      {
        title: "Notification Control",
        description:
          "You have full control over alert notifications and can enable or disable them through your account settings without affecting system access.",
      },
    ],
  },
  {
    header: "Third-Party Services",
    description: "External services and data sources",
    bulletItems: [
      {
        title: "Google Authentication",
        description:
          "We use Google OAuth for secure login. Google's privacy policy governs data handled during authentication. We only receive basic profile information.",
      },
      {
        title: "IoT Sensor Data",
        description:
          "Seismic data is collected exclusively from our own IoT sensors and devices. This data contains no personal information and is used for earthquake detection and public safety alerts.",
      },
      {
        title: "Educational Institution Integration",
        description:
          "System access is limited to verified educational institution email addresses. No data is shared back with institutions beyond basic usage statistics.",
      },
    ],
  },
];

export default function Page() {
  return (
    <>
      <header className="mx-6 my-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/queyk-light.png"
            width={25}
            height={25}
            alt="queyk's logo"
            className="size-4.5 invert md:size-5.5"
          />
          <p className="mb-0.5 font-semibold md:text-xl">Queyk</p>
        </Link>
      </header>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-3">
          <span className="mb-0.5 text-lg font-semibold">Privacy Policy</span>
          <p className="text-muted-foreground">
            Learn how we collect, use, and protect your personal information
            while providing earthquake monitoring services
          </p>
          {privacySections.map((section) => (
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
                      <h3 className="text-primary font-semibold">
                        {bullet.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {bullet.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="text-muted-foreground py-8 text-center text-xs md:text-sm">
            Last updated: {new Date().toLocaleDateString()} | ©{" "}
            {new Date().getFullYear()} Queyk Project - All Rights Reserved
          </div>
        </div>
      </div>
    </>
  );
}

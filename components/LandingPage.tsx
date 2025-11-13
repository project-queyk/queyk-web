"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { motion } from "framer-motion";
import {
  Activity,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MapPin,
  Shield,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { members } from "@/lib/members";
import { signOutRootAction } from "@/lib/auth-actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const textPart1 = "Is your school prepared for an";
const earthquakeWord = "earthquake?";
const regularWords = textPart1.split(" ");

const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
  }),
};

const child = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

const earthquakeAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
      delay: 0.7,
    },
  },
};

const shakeEffect = {
  initial: { x: 0, y: 0 },
  shake: {
    x: [0, -5, 5, -5, 5, -3, 3, -2, 2, 0],
    y: [0, 3, -3, 2, -2, 3, -3, 1, -1, 0],
    transition: {
      duration: 1.2,
      delay: 1.6,
      ease: "easeInOut",
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.8,
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const headerAnimation = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const heroImageAnimation = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 1.3,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function LandingPage({ session }: { session: Session | null }) {
  return (
    <>
      <motion.header
        className="mx-6 my-4 flex items-center justify-between"
        initial="hidden"
        animate="visible"
        variants={headerAnimation}
      >
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
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer rounded-full"
              >
                <Image
                  src={session.user?.image ?? ""}
                  alt={session.user?.name ?? ""}
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4 w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link
                    href="/dashboard"
                    className="flex w-full cursor-default items-center gap-2"
                  >
                    <LayoutDashboard />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  onClick={signOutRootAction}
                  className="flex w-full items-center gap-2"
                >
                  <LogOut /> Log out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="font-semibold">
            <Link href="/dashboard">Sign in</Link>
          </Button>
        )}
      </motion.header>
      <main>
        <section className="mx-6 mt-12 flex min-h-[80dvh] flex-col items-center justify-center gap-2 md:mx-24 md:mt-6 md:min-h-[110dvh] md:gap-3">
          <motion.h1
            className="flex flex-wrap justify-center gap-x-2 text-2xl font-semibold md:text-5xl"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {regularWords.map((word, index) => (
              <motion.span
                key={index}
                variants={child}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className="inline-block text-[#ccaa2f]"
              variants={earthquakeAnimation}
              initial="hidden"
              animate="visible"
            >
              <motion.span
                initial="initial"
                animate="shake"
                variants={shakeEffect}
                className="inline-block"
              >
                {earthquakeWord}
              </motion.span>
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-center text-sm font-medium md:text-base"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Monitor seismic activity and receive critical alerts when they
            matter most.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-2 flex gap-2"
          >
            <Button className="cursor-pointer font-semibold" asChild>
              <Link href="/dashboard">Get started</Link>
            </Button>
            <Button
              className="cursor-pointer font-semibold"
              variant="outline"
              asChild
            >
              <a
                // href="https://play.google.com/store/apps/details?id=com.luiscabantac.Queyk"
                href="https://github.com/project-queyk/queyk-mobile/releases"
                target="_blank"
              >
                <FaGithub className="size-4" />
                <div className="grid">
                  <span className="text-[9px]">Get it on</span>
                  <p>GitHub</p>
                </div>
              </a>
            </Button>
          </motion.div>
          <motion.div
            variants={heroImageAnimation}
            initial="hidden"
            animate="visible"
            className="mt-10 w-full max-w-5xl perspective-[1000px]"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              initial={{ y: 0, rotateX: 0, scale: 1 }}
              whileInView={{
                y: -25,
                rotateX: 3.5,
                scale: 1.05,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 100,
                },
              }}
              viewport={{ once: false, amount: 0.8 }}
              className="w-full"
            >
              <div className="hidden md:block">
                <Image
                  src="/queyk-hero.png"
                  alt="queyk dashboard hero image"
                  width={1920}
                  height={1080}
                  className="h-full w-full rounded-lg shadow-xl"
                />
              </div>
              <div className="mt-4 block md:hidden">
                <Image
                  src="/queyk-hero-mobile.png"
                  alt="queyk dashboard hero image"
                  width={1080}
                  height={1440}
                />
              </div>
            </motion.div>
          </motion.div>
        </section>
        <section className="py-16 md:py-32">
          <div className="@container mx-auto max-w-5xl px-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-balance md:text-4xl">
                Complete earthquake preparedness for your school
              </h2>
              <p className="text-muted-foreground mt-4 text-sm md:text-base">
                Monitor, prepare, and respond effectively to seismic events with
                our comprehensive system
              </p>
            </motion.div>
            <Card className="mx-auto mt-8 grid max-w-sm overflow-hidden shadow-zinc-950/5 *:text-center md:mt-16 md:divide-y @min-4xl:max-w-full @min-4xl:grid-cols-3 @min-4xl:divide-x @min-4xl:divide-y-0">
              <motion.div
                className="group shadow-zinc-950/5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <Activity className="size-6" aria-hidden />
                  </CardDecorator>
                  <h3 className="mt-6 font-medium">
                    Seismic Activity Tracking
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    View hourly magnitude readings, track peak activity periods,
                    and monitor significant seismic events through our
                    informative dashboard.
                  </p>
                </CardContent>
              </motion.div>
              <motion.div
                className="group shadow-zinc-950/5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <Shield className="size-6" aria-hidden />
                  </CardDecorator>

                  <h3 className="mt-6 font-medium">Safety Protocols</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Access comprehensive guidance for before, during, and after
                    an earthquake, including safety alerts for your school
                    community.
                  </p>
                </CardContent>
              </motion.div>
              <motion.div
                className="group shadow-zinc-950/5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <MapPin className="size-6" aria-hidden />
                  </CardDecorator>

                  <h3 className="mt-6 font-medium">Evacuation Planning</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    View floor plans with emergency exit routes and assembly
                    points, downloadable for offline access during emergencies.
                  </p>
                </CardContent>
              </motion.div>
            </Card>
          </div>
        </section>
        <section className="py-16 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              className="grid gap-6 md:grid-cols-2 md:gap-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl font-semibold md:text-4xl">
                Every second counts when earthquakes strike schools
              </h2>
              <div className="space-y-6 text-sm md:text-base">
                <p>
                  Schools face unique challenges during earthquakes, with large
                  numbers of students and staff needing to respond quickly in
                  complex campus environments.
                </p>
                <p>
                  <span className="font-bold">
                    Proper preparation saves lives
                  </span>{" "}
                  — studies show that schools with comprehensive earthquake
                  monitoring and response systems can reduce injury rates by up
                  to 70% during seismic events.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="gap-1 pr-1.5"
                >
                  <Link href="/protocols">
                    <span>View Safety Resources</span>
                    <ChevronRight className="size-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="py-16 md:py-32 dark:bg-transparent">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="sm:w-2/5">
                <h2 className="text-2xl font-semibold md:text-4xl">Our team</h2>
              </div>
              <div className="mt-6 text-sm sm:mt-0 md:text-base">
                <p>
                  Our team is dedicated to developing tools that help your
                  school prepare for earthquake events. We combine educational
                  safety knowledge with user-friendly technology to make
                  emergency planning more accessible.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mt-12 md:mt-24"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member, index) => (
                  <motion.div
                    key={index}
                    className="group overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 * index,
                    }}
                  >
                    <Image
                      className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 group-hover:h-[22.5rem] group-hover:rounded-xl hover:grayscale-0"
                      src={member.avatar}
                      alt={member.name}
                      width="826"
                      height="1239"
                    />
                    <div className="px-2 pt-2 sm:pt-4 sm:pb-0">
                      <div className="flex justify-between">
                        <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                          {member.name}
                        </h3>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        <section className="py-16 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-balance md:text-4xl">
                Protect Your School Today
              </h2>
              <p className="text-muted-foreground mt-4 text-sm md:text-base">
                Take the next step toward comprehensive earthquake preparedness
                for your campus
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    <span>Access Dashboard</span>
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/protocols">
                    <span>View Safety Protocols</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <motion.footer
        className="py-8 text-center text-xs text-gray-500 md:text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1.8,
          duration: 0.7,
          ease: "easeOut",
        }}
      >
        <div className="space-y-2">
          <div>
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>
          </div>
          <p>
            © {new Date().getFullYear()} Queyk Project - All Rights Reserved
          </p>
        </div>
      </motion.footer>
    </>
  );
}

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="to-card absolute inset-0 bg-radial from-transparent to-75%"
    />
    <div className="bg-card absolute inset-0 m-auto flex size-12 items-center justify-center">
      {children}
    </div>
  </div>
);

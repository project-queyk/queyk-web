"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

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

export default function LandingPage({ isLoggedIn }: { isLoggedIn: boolean }) {
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
            className="size-5 invert md:size-6"
          />
          <p className="mb-0.5 font-semibold md:text-xl">Queyk</p>
        </Link>
        {!isLoggedIn && (
          <Button className="cursor-pointer font-semibold">
            <Link href="/dashboard">Sign in</Link>
          </Button>
        )}
      </motion.header>
      <main className="mx-6 flex min-h-[90dvh] flex-col items-center justify-center gap-2 md:mx-24 md:min-h-[110dvh] md:gap-3">
        <motion.h1
          className="flex flex-wrap gap-x-2 text-3xl font-semibold md:text-5xl"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {regularWords.map((word, index) => (
            <motion.span key={index} variants={child} className="inline-block">
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
          Monitor seismic activity and receive critical alerts when they matter
          most.
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
            <a href="https://github.com/project-queyk" target="_blank">
              View on GitHub
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
                damping: 15,
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
                src="/queyk-hero-small.png"
                alt="queyk dashboard hero image"
                width={1080}
                height={1080}
                className="rounded-lg shadow-xl"
              />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}

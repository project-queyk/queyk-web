export interface IProtocols {
  header: string;
  description: string;
  bulletItems: IProtocolItem[];
}

export interface IProtocolItem {
  title: string;
  description: string;
}

export const protocols: IProtocols[] = [
  {
    header: "Before an Earthquake",
    description:
      "Be prepared before an earthquake strikes by securing your surroundings and knowing what to do.",
    bulletItems: [
      {
        title: "Secure heavy objects",
        description:
          "Anchor shelves, televisions, and appliances to prevent falling.",
      },
      {
        title: "Know safe spots",
        description:
          "Identify sturdy tables or corners where you can take cover during a quake.",
      },
      {
        title: "Prepare a Go-Bag",
        description:
          "Include essentials like water, flashlight, batteries, first aid kit, and important documents.",
      },
      {
        title: "Join earthquake drills",
        description:
          "Participate in local or school-led drills like the Nationwide Simultaneous Earthquake Drill (NSED).",
      },
      {
        title: "Know evacuation routes",
        description:
          "Familiarize yourself with exits and community evacuation sites.",
      },
      {
        title: "Plan with your family",
        description:
          "Discuss where to meet and how to communicate after a disaster.",
      },
    ],
  },
  {
    header: "During an Earthquake",
    description:
      "Keep yourself safe during the shaking by following key safety steps.",
    bulletItems: [
      {
        title: "Drop, Cover, and Hold On",
        description:
          "Drop to the ground, take cover under sturdy furniture, and hold on until shaking stops.",
      },
      {
        title: "Stay indoors",
        description:
          "It’s usually safer to remain inside than to run outside during shaking.",
      },
      {
        title: "Avoid glass and heavy items",
        description:
          "Steer clear of windows, mirrors, or anything that can fall or break.",
      },
      {
        title: "If outside, go to an open space",
        description:
          "Move away from buildings, trees, and power lines that could collapse.",
      },
      {
        title: "If driving, stop safely",
        description:
          "Pull over, stay inside your car, and avoid stopping under overpasses or near buildings.",
      },
    ],
  },
  {
    header: "After an Earthquake",
    description: "Stay alert and cautious even after the shaking has stopped.",
    bulletItems: [
      {
        title: "Be ready for aftershocks",
        description:
          "Smaller quakes may follow — remain cautious and avoid damaged structures.",
      },
      {
        title: "Check yourself and others",
        description:
          "Provide first aid if needed and call for help if anyone is seriously injured.",
      },
      {
        title: "Inspect your surroundings",
        description:
          "Look out for fires, gas leaks, or structural damage in your home or building.",
      },
      {
        title: "Stay informed",
        description:
          "Use radio or trusted sources to receive updates from PHIVOLCS, NDRRMC, or local authorities.",
      },
      {
        title: "Evacuate if unsafe",
        description:
          "Leave buildings if there's visible damage or a risk of collapse.",
      },
      {
        title: "Use phones wisely",
        description:
          "Keep calls short — prioritize emergency communication only.",
      },
    ],
  },
];

import { Metadata } from "next";

import AuthErrorPage from "@/components/AuthError";

export const metadata: Metadata = {
  title: "Something went wrong",
  description:
    "An error occurred while processing your request. Please try again or contact support if the problem persists.",
};

export default function Page() {
  return <AuthErrorPage />;
}

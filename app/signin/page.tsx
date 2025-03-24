import { signIn } from "@/auth";

import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="my-24 flex items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <Button type="submit">Sign in</Button>
      </form>
    </div>
  );
}

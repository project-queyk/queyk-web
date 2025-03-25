import { signInAction } from "@/lib/auth-actions";

import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="my-24 flex items-center justify-center">
      <Button onClick={signInAction}>Sign in</Button>
    </div>
  );
}

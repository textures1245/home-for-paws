import { notFound } from "next/navigation";

// `server-only` guarantees any modules that import code in file
// will never run on the client. Even though this particular api
// doesn't currently use sensitive environment variables, it's
// good practise to add `server-only` preemptively.
import "server-only";

export async function singIn({ parent }: { parent?: string } = {}) {
  //   mockup
}


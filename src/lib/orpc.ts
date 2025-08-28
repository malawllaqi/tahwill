import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { router } from "@/router";

const link = new RPCLink({
  url: `${typeof window !== "undefined" ? window.location.origin : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/rpc`,
  headers: async () => {
    if (typeof window !== "undefined") {
      return {};
    }

    const { headers } = await import("next/headers");
    return Object.fromEntries(await headers());
  },
});

const client: RouterClient<typeof router> = createORPCClient(link);

const orpc = createTanstackQueryUtils(client);

export { orpc };

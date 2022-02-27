import { createReactQueryHooks } from "@trpc/react";
import type { LiteratureRouter } from "@s2h/routers";

export const trpc = createReactQueryHooks<LiteratureRouter>();
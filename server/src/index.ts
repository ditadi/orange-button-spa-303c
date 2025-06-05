
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { createUIConfigInputSchema, updateUIConfigInputSchema } from './schema';
import { createUIConfig } from './handlers/create_ui_config';
import { getUIConfig } from './handlers/get_ui_config';
import { updateUIConfig } from './handlers/update_ui_config';
import { z } from 'zod';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  createUIConfig: publicProcedure
    .input(createUIConfigInputSchema)
    .mutation(({ input }) => createUIConfig(input)),
  getUIConfig: publicProcedure
    .input(z.object({ componentType: z.string(), componentId: z.string() }))
    .query(({ input }) => getUIConfig(input.componentType, input.componentId)),
  updateUIConfig: publicProcedure
    .input(updateUIConfigInputSchema)
    .mutation(({ input }) => updateUIConfig(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();

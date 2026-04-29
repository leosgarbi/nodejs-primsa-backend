import { pathToFileURL } from "bun";
import type { FastifyPluginAsync } from "fastify";
import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import type { FastifyTypedInstance } from "../../@types/fastify-typed";

const here = dirname(fileURLToPath(import.meta.url));

export default async function authRoutes(app: FastifyTypedInstance) {
  const files = readdirSync(here).filter(
    (file) =>
      file.endsWith(".ts") && !file.endsWith(".d.ts") && file !== "index.ts",
  );

  for (const file of files) {
    const mod = (await import(pathToFileURL(join(here, file)).href)) as {
      default?: FastifyPluginAsync;
    };

    if (typeof mod.default !== "function") {
      app.log.warn(`No default export found in ${file}, skipping...`);
      continue;
    }

    await app.register(mod.default);
  }
}

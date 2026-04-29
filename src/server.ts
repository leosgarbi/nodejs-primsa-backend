import { buildApp } from "./app";
import { env } from "./env";

async function main() {
  const app = await buildApp();

  try {
    app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`Servidor iniciado 🚀, ${env.HOST}:${env.PORT}`);
  } catch (err) {
    app.log.error(`Erro ao iniciar o servidor: ${err}`);
    process.exit(1);
  }

  const shutdown = async (signal: string) => {
    app.log.info(`Recebido sinal ${signal}, fechando o servidor...`);
    try {
      await app.close();
      app.log.info("Servidor fechado com sucesso");
      process.exit(0);
    } catch (err) {
      app.log.error(`Erro ao fechar o servidor: ${err}`);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main();

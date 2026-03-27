import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { existsSync, readFileSync } from "node:fs";
import { AppModule } from "./app.module";

async function bootstrap() {
  const httpsKeyPath = process.env.HTTPS_KEY_PATH;
  const httpsCertPath = process.env.HTTPS_CERT_PATH;

  const httpsOptions =
    httpsKeyPath &&
    httpsCertPath &&
    existsSync(httpsKeyPath) &&
    existsSync(httpsCertPath)
      ? {
          key: readFileSync(httpsKeyPath),
          cert: readFileSync(httpsCertPath),
        }
      : undefined;

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();

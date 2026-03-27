"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const node_fs_1 = require("node:fs");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const httpsKeyPath = process.env.HTTPS_KEY_PATH;
    const httpsCertPath = process.env.HTTPS_CERT_PATH;
    const httpsOptions = httpsKeyPath &&
        httpsCertPath &&
        (0, node_fs_1.existsSync)(httpsKeyPath) &&
        (0, node_fs_1.existsSync)(httpsCertPath)
        ? {
            key: (0, node_fs_1.readFileSync)(httpsKeyPath),
            cert: (0, node_fs_1.readFileSync)(httpsCertPath),
        }
        : undefined;
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { httpsOptions });
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
}
void bootstrap();
//# sourceMappingURL=main.js.map
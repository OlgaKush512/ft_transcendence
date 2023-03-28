import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { SessionAdapter } from './SessionAdapter';

const pgSession = require('connect-pg-simple')(session);
const sessionPool = require('pg').Pool;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const configService = app.get(ConfigService);

  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: 'http://localhost:3000',
    credentials: true,
  }); // Used during development as the frontend and backend are on different ports

  const sessionDBaccess = new sessionPool({
    user: configService.get<string>('DB_APP_USER'),
    password: configService.get<string>('DB_APP_PASSWORD'),
    host: configService.get<string>('DB_HOST'),
    port: configService.get<string>('DB_PORT'),
    database: configService.get<string>('DB_NAME'),
  });

  const sessionConfig: session.SessionOptions = {
    store: new pgSession({
      pool: sessionDBaccess,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: configService.get<string>('SESSION_SECRET'),
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 / 2, sameSite: 'lax' }, // 1h
  };

  const config = new DocumentBuilder()
    .setTitle('Transcendence')
    .setDescription('Transcendence backend API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('./src/swagger.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);
  const sessionMiddleware = session(sessionConfig);
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.useWebSocketAdapter(new SessionAdapter(sessionMiddleware, app));

  await app.listen(5000);
}
bootstrap();

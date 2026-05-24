import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedAllData } from './seeds/seed-all';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  
  const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
  ]);

  const uploadsPath = join(__dirname, '..', 'uploads');
  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath, { recursive: true });
  }

  app.useStaticAssets(uploadsPath, { prefix: '/uploads' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const frontendOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  frontendOrigins.forEach((origin) => allowedOrigins.add(origin));

  app.enableCors({
    origin: (origin, callback) => {
      // Allow any localhost port (development) and the configured origins
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log(`📡 API at http://localhost:${port}/api`);

  // Seed database with initial data
  try {
    const dataSource = app.get(DataSource);
    if (dataSource && dataSource.isInitialized) {
      console.log('🌱 Seeding database...');
      await seedAllData(dataSource);
      console.log('✅ Database seeding complete!');
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error instanceof Error ? error.message : error);
  }
}
void bootstrap();
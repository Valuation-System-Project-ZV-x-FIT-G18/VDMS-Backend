import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedAllData } from './seeds/seed-all';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
    ],
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000);
  console.log('🚀 VDMS Backend running on http://localhost:3000');
  console.log('📡 API at http://localhost:3000/api');

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
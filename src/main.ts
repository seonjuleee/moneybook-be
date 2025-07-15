import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 추가
  app.enableCors({
    origin: 'http://localhost:5173', // Vite 개발 서버 주소
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 NestJS 서버가 http://localhost:3000 에서 실행 중입니다.');
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
});

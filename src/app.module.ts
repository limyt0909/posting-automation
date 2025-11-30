import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NaverBlogController } from './naver-blog/naver-blog.controller';
import { NaverBlogService } from './naver-blog/naver-blog.service';

@Module({
  imports: [],
  controllers: [AppController, NaverBlogController],
  providers: [AppService, NaverBlogService],
})
export class AppModule {}

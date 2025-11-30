import { Controller, Post, Body } from '@nestjs/common';
import { NaverBlogService } from './naver-blog.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('naver-blog')
export class NaverBlogController {
  constructor(private readonly blogService: NaverBlogService) {} // ✅ 서비스 주입

  @Post('post')
  async createPost(@Body() body: CreatePostDto) {
    const { title, content, imagePath } = body;
    return this.blogService.post(title, content, imagePath);
  }
}

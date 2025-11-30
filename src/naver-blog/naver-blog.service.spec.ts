import { Test, TestingModule } from '@nestjs/testing';
import { NaverBlogService } from './naver-blog.service';

describe('NaverBlogService', () => {
  let service: NaverBlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NaverBlogService],
    }).compile();

    service = module.get<NaverBlogService>(NaverBlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

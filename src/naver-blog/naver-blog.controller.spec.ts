import { Test, TestingModule } from '@nestjs/testing';
import { NaverBlogController } from './naver-blog.controller';

describe('NaverBlogController', () => {
  let controller: NaverBlogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NaverBlogController],
    }).compile();

    controller = module.get<NaverBlogController>(NaverBlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

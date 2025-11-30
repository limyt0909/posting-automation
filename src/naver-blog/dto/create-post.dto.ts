import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: '포스팅 제목' })
  title: string;

  @ApiProperty({ description: '포스팅 본문 HTML' })
  content: string;

  @ApiProperty({ description: '이미지 경로', required: false })
  imagePath?: string;
}
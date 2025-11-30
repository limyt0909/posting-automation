import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as fs from 'fs';

@Injectable()
export class NaverBlogService {

  async post(title: string, content: string, imagePath?: string) {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage();

    // 1) 네이버 로그인 쿠키 삽입
    const cookies = JSON.parse(fs.readFileSync('./cookies/naver.json', 'utf8'));
    await page.setCookie(...cookies);

    // 2) 글쓰기 페이지 이동
    await page.goto('https://blog.naver.com/aldjzk/postwrite', {
      waitUntil: 'networkidle2',
    });

    // 3) 제목 입력
    await page.waitForSelector('.se-title-text');
    await page.click('.se-title-text');
    await page.keyboard.type(title);

    // 4) 본문 입력
    await page.waitForSelector('.se-editable');
await page.evaluate((content) => {
  const el = document.querySelector('.se-editable');
  if (el) {
    el.innerHTML = content;
  }
}, content);
    // 5) 이미지 업로드 (선택)
    if (imagePath) {
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('.se-image-toolbar-button'),
      ]);
    await fileChooser.accept([imagePath]);
    await page.waitForSelector('.se-module-image img', { timeout: 15000 });
    }

    // 6) 발행 버튼 클릭
    await page.click('.se-publish-button');
    await page.waitForSelector('.se-editable', { timeout: 10000 });
    await browser.close();

    return { status: 'OK', message: '네이버 블로그 자동 포스팅 완료' };
  }
}

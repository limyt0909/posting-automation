import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NaverBlogService {
  async post(title: string, content: string, imagePath?: string) {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();

    // 1) 쿠키 로드 및 정제
    const rawCookies = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../cookies/naver.json'), 'utf8'),
    );
    const cookies = rawCookies.map((c) => ({
      name: c.name,
      value: c.value,
      domain: c.domain || '.naver.com',
      path: c.path || '/',
      httpOnly: c.httpOnly || false,
      secure: c.secure || false,
      sameSite: c.sameSite || 'Lax',
    }));
    await page.setCookie(...cookies);

    // 2) 글쓰기 페이지 이동
    await page.goto('https://blog.naver.com/네이버아이디/postwrite', {
      waitUntil: 'networkidle2',
    });

    // 3) 제목 입력
    await page.waitForSelector('.se-title-text', { visible: true });
    await page.click('.se-title-text');
    await page.keyboard.type(`${title}${new Date()}`, { delay: 50 });

    // 4) iframe 내부 본문 입력
    await page.waitForSelector('iframe[name^="input_buffer"]', {
      visible: true,
    });
    const iframeHandle: any = await page.$('iframe[name^="input_buffer"]');
    const frame = await iframeHandle.contentFrame();
    await frame.focus('.se-editable'); // 글쓰기 영역 focus
    await frame.keyboard.type(content, { delay: 50 }); // 실제 입력처럼 타이핑

    // 5) 이미지 업로드 (선택)
    if (imagePath) {
      // 블로그 에디터의 이미지 버튼 클릭
      await page.click('.se-toolbar .se-image-tool');
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        await fileInput.uploadFile(imagePath);
        await new Promise((r) => setTimeout(r, 3000)); // 업로드 대기
      }
    }

    // 6) 발행 버튼 클릭
    await page.waitForSelector('.se-publish-button', { visible: true });
    await page.click('.se-publish-button');

    // 발행 완료 대기
    try {
      await page.waitForNavigation({
        waitUntil: 'networkidle2',
        timeout: 15000,
      });
    } catch {}

    await browser.close();
    return { status: 'OK', message: '네이버 블로그 자동 포스팅 완료' };
  }
}

import {test,expect} from '@playwright/test';

test('course map, stage lock and step-by-step mission unlock',async({page})=>{
 await page.goto('/learn/blink/led-on');
 await expect(page.getByText('아직 잠긴 미션입니다')).toBeVisible();
 await page.goto('/learn/blink/concept');
 await expect(page.getByText('퀴즈: 올바른 설명을 선택하세요')).toBeVisible();
 await page.locator('.answer').nth(1).click();
 await page.getByRole('button',{name:'미션 확인 및 완료'}).click();
 await page.getByRole('link',{name:/다음 미션/}).click();
 await expect(page.getByText('회로 연결 한눈에 보기')).toBeVisible();
 await page.locator('.check-line input').check();
 await page.getByRole('button',{name:'미션 확인 및 완료'}).click();
 await page.getByRole('link',{name:/다음 미션/}).click();
 await expect(page.getByText('GPIO26에 연결된 LED를 켜세요.')).toBeVisible();
 await page.reload();
 await expect(page.getByText('GPIO26에 연결된 LED를 켜세요.')).toBeVisible();
});

test('Python-only final mission validates typed modification',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{
   const done=Object.fromEntries(['concept','wiring','led-on','led-off','led-after-1s','led-three','led-forever','led-faster'].map(k=>[`blink:${k}`,Date.now()]));
   localStorage.setItem('esp32-block-studio:progress:v2',JSON.stringify({done,notes:{},deviceChecks:{}}));
 });
 await page.goto('/learn/blink/led-python');
 await expect(page.getByText('MicroPython으로 직접 수정')).toBeVisible();
 await expect(page.locator('.blockly-host')).toHaveCount(0);
 const editor=page.getByRole('textbox',{name:'MicroPython 코드'});
 const value=await editor.inputValue();
 await editor.fill(value.replaceAll('time.sleep_ms(200)','time.sleep_ms(100)'));
 await page.getByRole('button',{name:/코드 검사/}).click();
 await expect(page.getByText(/코드 검사 통과/).first()).toBeVisible();
 await page.reload();
 await expect(page.getByText(/코드 미션 완료/)).toBeVisible();
});

test('teacher guide includes safe wiring and lesson questions',async({page})=>{
 await page.goto('/teacher/blink');
 await expect(page.getByRole('heading',{name:/반짝반짝 LED/})).toBeVisible();
 await expect(page.getByText('회로 연결 한눈에 보기')).toBeVisible();
 await expect(page.getByText('GPIO26').first()).toBeVisible();
 await expect(page.getByText(/자주 발생하는 문제/)).toBeVisible();
});

test('serial action is unavailable until physical USB connection',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>localStorage.setItem('esp32-block-studio:progress:v2',JSON.stringify({done:{'blink:concept':1,'blink:wiring':1},notes:{},deviceChecks:{}})));
 await page.goto('/learn/blink/led-on');
 await expect(page.getByRole('button',{name:'▶ 실행'})).toBeDisabled();
 await expect(page.getByRole('button',{name:/USB 연결/})).toBeVisible();
});

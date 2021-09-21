import consola from "consola";
import { Page } from "playwright";

export const login = async (page: Page, username: string, password: string) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.fill("input[name='userName']", username);
  await page.fill("input[name='password']", password);
  consola.log("ログイン中...");

  await page.click('text="ログイン"');
  await page.waitForNavigation({ waitUntil: "load" });
  consola.log("ログイン成功");
};

export const download = async (page: Page) => {
  consola.log("データをダウンロード中");
  await page.goto("/campusweb/campusportal.do?page=main&tabId=si");

  const frame = page.frame({
    name: "portlet-body",
  });

  await frame?.click("text=ダウンロード");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    frame?.click("text=出 力"),
  ]);
  consola.log("ダウンロード完了");
  return download;
};

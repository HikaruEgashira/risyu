import consola from "consola";
import { Page, Download } from "playwright";

export const login = async (page: Page, username: string, password: string) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.fill("input[name='userName']", username);
  await page.fill("input[name='password']", password);
  consola.log("ログイン中...");

  await page.click('text="ログイン"');
  await page.waitForNavigation({ waitUntil: "load" });
  consola.log("ログイン成功");
};

const dl = async (page: Page) => {
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

let retry = 0;
const retryMax = 3;
export const download = async (page: Page): Promise<Download> => {
  try {
    return await dl(page);
  } catch (error) {
    if (retry === retryMax) {
      throw new Error("Error: retry 3 count");
    } else {
      retry++;
      consola.log("retry");
      return await download(page);
    }
  }
};

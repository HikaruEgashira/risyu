import pw from "playwright";

import { download, login } from "./scraping";
import { processFile } from "./stream";
import { config } from "dotenv";

export const main = async () => {
  if (process.env.NODE_ENV === "development") config();

  const username = process.env.TWINS_USERNAME;
  const password = process.env.TWINS_PASSWORD;
  if (!username || !password) {
    throw new Error("Please set USERNAME and PASSWORD environment variables");
  }

  // PlayWright

  const chromium = await pw.chromium.launch();
  const page = await chromium.newPage({
    baseURL: "https://twins.tsukuba.ac.jp",
    acceptDownloads: true,
  });

  await login(page, username, password);
  const dl = await download(page);

  const stream = await dl.createReadStream();
  const risyu = await processFile(stream);

  await dl.delete();
  await chromium.close();

  return risyu;
};

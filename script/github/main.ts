import { Octokit } from "@octokit/action";
import consola from "consola";

import { getProject } from "./getProject";

export const main = async () => {
  consola.log("[GitHub] start");
  const octokit = new Octokit();
  // const [owner, repo] = process.env.GITHUB_REPOSITORY?.split("/") || [];
  const project = await getProject(octokit, "履修一覧");

  consola.log("[GitHub] done");
  console.log(project);
};

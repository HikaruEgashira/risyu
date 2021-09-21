import { Octokit } from "@octokit/action";

import { getProject } from "./github/getProject";
import { main as runTwinsScraping } from "./twins/main";

const risyu = await runTwinsScraping();

// GitHub Project

const octokit = new Octokit();
const [owner, repo] = process.env.GITHUB_REPOSITORY?.split("/") || [];
const project = await getProject(octokit, "履修一覧");

console.log(project);
console.log(risyu);

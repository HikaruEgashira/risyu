import { Octokit } from "@octokit/action";
import consola from "consola";

const [owner, repo] = process.env.GITHUB_REPOSITORY?.split("/") || [];

export const getProject = async (octokit: Octokit, name: string) => {
  let { data: projects } = await octokit.rest.projects.listForRepo({
    owner,
    repo,
  });

  const project = projects.find((project) => project.name === name);
  if (project) return project;

  consola.log("新しいプロジェクトを作成中");
  const { data: newProject } = await octokit.rest.projects.createForRepo({
    owner,
    repo,
    name,
  });
  return newProject;
};

import { Octokit } from "@octokit/action";
import consola from "consola";
import scheme from "../../scheme.json";
import type { Course } from "domain/cource";

import { getProject } from "./getProject";
import { getColumn } from "./getColumn";

const [owner, repo] = process.env.GITHUB_REPOSITORY?.split("/") || [];

export const main = async (risyu: Course[]) => {
  consola.log("[GitHub] start");
  const octokit = new Octokit();

  await octokit.repos.update({
    owner,
    repo,
    branch: "api",
    message: "update(api)",
    path: "twins.json",
    content: Buffer.from(JSON.stringify(risyu)).toString("base64"),
  });

  const project = await getProject(octokit, "履修一覧");

  const columnSum = await getColumn(octokit, project, "合計");
  const sumTask = risyu.splice(0, 2).map(async (course, i) => {
    return await octokit.rest.projects.createCard({
      column_id: columnSum.id,
      note: `${course["科目名 "]} ${course["単位数"]}`,
      content_id: i,
      content_type: "Task",
    });
  });
  await Promise.all(sumTask);

  const task = scheme.items.map(async (item) => {
    const column = await octokit.rest.projects.createColumn({
      project_id: project.id,
      name: item.name,
    });

    const task = risyu
      .filter(
        (course) =>
          RegExp(item.regex).test(course["科目名 "]) ||
          RegExp(item.regex).test(course["科目番号"])
      )
      .splice(0, 2)
      .map(async (course, i) => {
        return await octokit.rest.projects.createCard({
          column_id: columnSum.id,
          note: `${course["科目名 "]} ${course["単位数"]}`,
          content_id: i,
          content_type: "Task",
        });
      });
    await Promise.all(task);

    return column;
  });
  const columns = await Promise.all(task);
  consola.log(`[GitHub] ${columns[0].url}... generated`);

  consola.log("[GitHub] done");
};

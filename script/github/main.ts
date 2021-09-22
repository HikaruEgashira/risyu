import { Octokit } from "@octokit/action";
import consola from "consola";
import scheme from "../../scheme.json";
import type { Course } from "script/types";

import { getProject } from "./getProject";

export const main = async (risyu: Course[]) => {
  consola.log("[GitHub] start");
  const octokit = new Octokit();

  const project = await getProject(octokit, "履修一覧");

  const columnSum = await octokit.rest.projects.createColumn({
    project_id: project.id,
    name: "合計",
  });
  const sumTask = risyu.splice(0, 2).map(async (course) => {
    return await octokit.rest.projects.createCard({
      column_id: columnSum.data.id,
      note: `${course["科目名 "]} ${course["単位数"]}`,
      content_id: course["科目番号"],
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
          column_id: columnSum.data.id,
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

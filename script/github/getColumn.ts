import { Octokit } from "@octokit/action";
import consola from "consola";
import type { Project } from "./getProject";

export const getColumn = async (
  octokit: Octokit,
  project: Project,
  name: string
) => {
  let { data: columns } = await octokit.rest.projects.listColumns({
    project_id: project.id,
  });

  const column = columns.find((column) => column.name === name);
  if (column) return column;

  consola.log("新しいプロジェクトを作成中");
  const newColumn = await octokit.rest.projects.createColumn({
    project_id: project.id,
    name: "合計",
  });
  return newColumn.data;
};

type ReturnPromiseType<A extends (...args: any) => any> =
  ReturnType<A> extends Promise<infer T> ? T : never;

export type Column = ReturnPromiseType<typeof getColumn>;

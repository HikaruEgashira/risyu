import { Octokit, RestEndpointMethodTypes } from "@octokit/action";
import consola from "consola";
import type { Project } from "./getProject";

export type Column =
  RestEndpointMethodTypes["projects"]["listColumns"]["response"]["data"][0];

export const getColumn = async (
  octokit: Octokit,
  project: Project,
  name: string
): Promise<Column> => {
  let { data: columns } = await octokit.rest.projects.listColumns({
    project_id: project.id,
  });

  const column = columns.find((column) => column.name === name);
  if (column) return column;

  consola.log("新しいプロジェクトを作成");
  const newColumn = await octokit.rest.projects.createColumn({
    project_id: project.id,
    name: "合計",
  });
  return newColumn.data;
};

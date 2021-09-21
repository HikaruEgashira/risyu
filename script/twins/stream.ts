import parse from "csv-parse";
import { finished } from "stream/promises";
import type { Readable } from "stream";
import type { Course } from "script/types";

export const processFile = async (
  stream: Readable | null
): Promise<Course[]> => {
  if (stream === null) return [];

  let records: Course[] = [];
  const parser = stream.pipe(
    parse({
      columns: true,
    })
  );
  parser.on("readable", function () {
    let record;
    while ((record = parser.read())) {
      // Work with each record
      records.push(JSON.parse(JSON.stringify(record)) as Course);
    }
  });
  await finished(parser);
  return records;
};

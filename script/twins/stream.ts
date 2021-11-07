import parse from "csv-parse";
import { finished } from "stream/promises";
import type { Readable } from "stream";
import type { Course } from "domain/cource";

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
      const cource = JSON.parse(JSON.stringify(record));
      delete cource["学籍番号"];
      delete cource["名前"];
      records.push(cource as Course);
    }
  });
  await finished(parser);
  return records;
};

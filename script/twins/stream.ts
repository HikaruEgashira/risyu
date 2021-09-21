import parse from "csv-parse";
import { finished } from "stream/promises";
import { Readable } from "stream";

type Risyu = {
  学籍番号: string;
  学生氏名: string;
  科目番号: string;
  "科目名 ": string;
  単位数: string;
  春学期: string;
  秋学期: string;
  総合評価: string;
  科目区分: string;
  開講年度: string;
  開講区分: string;
};

export const processFile = async (
  stream: Readable | null
): Promise<Risyu[]> => {
  if (stream === null) return [];

  let records: Risyu[] = [];
  const parser = stream.pipe(
    parse({
      columns: true,
    })
  );
  parser.on("readable", function () {
    let record;
    while ((record = parser.read())) {
      // Work with each record
      records.push(JSON.parse(JSON.stringify(record)) as Risyu);
    }
  });
  await finished(parser);
  return records;
};

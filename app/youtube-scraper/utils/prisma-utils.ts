import { Obj } from "types/utility-types";

export const batchRawSql = async (queries: Obj): Promise<{ [key: string]: unknown }> => {
  const queryKeys = Object.keys(queries);
  const queryValues = Object.values(queries);

  const rawResults = (await Promise.all(queryValues).catch(() =>
    new Array(queryKeys.length).fill(null)
  )) as unknown[];

  console.log({ rawResults });

  return rawResults.reduce((acc: Obj, cv: unknown, i: number) => {
    acc[queryKeys[i]] = cv;
    return acc;
  }, {});
};

const connectOrCreateData = <T>(data: T) => ({
  where: data,
  create: data,
});

export const getConnectOrCreate = <T>(data: T) => ({
  connectOrCreate: connectOrCreateData(data),
});

export const getConnectOrCreateMany = <T>(data: T[]) => ({
  connectOrCreate: data.map((element: T) => connectOrCreateData(element)),
});

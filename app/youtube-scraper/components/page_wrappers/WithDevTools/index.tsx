import Debug from "components/Debug";
import { PropsWithChildren } from "react";

const WithDevTools = ({ children, data, path }: PropsWithChildren<{ path: string; data: unknown }>) => {
  return (
    <>
      {children}
      <Debug data={data} path={path} />
    </>
  );
};

export default WithDevTools;

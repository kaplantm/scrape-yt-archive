import { PropsWithChildren } from "react";

// TODO: react helmet header
// TODO: nav
const MainLayout = ({ children }: PropsWithChildren) => {
  return <div className="p-10">{children}</div>;
};

export default MainLayout;

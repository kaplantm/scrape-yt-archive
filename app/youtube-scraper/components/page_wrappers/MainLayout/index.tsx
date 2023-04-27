import Nav from "components/Nav";
import { PropsWithChildren } from "react";

// TODO: react helmet header
// TODO: nav
const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Nav />
      <div className="p-10">{children}</div>
    </>
  );
};

export default MainLayout;

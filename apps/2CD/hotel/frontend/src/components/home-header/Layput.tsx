
import HomeHeader from "./Header";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default Layout;

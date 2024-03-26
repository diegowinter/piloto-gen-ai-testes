import { ReactNode, useState } from "react";
import Header from "./Header";
import Drawer from "./Drawer";

interface LayoutProps {
  children: ReactNode
}

const Layout = (props: LayoutProps) => {

  const [showDrawer, setShowDrawer] = useState(false);

  const onShowDrawer = () => {
    setShowDrawer(!showDrawer);
  }

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="hidden md:block">
        <Drawer />
      </div>
      {showDrawer && (
        <div className="md:hidden absolute z-20 h-full">
          <Drawer onClickMenu={onShowDrawer} showMenuButton />
        </div>
      )}
      <div className="flex flex-col w-full">
        <Header onClickMenu={onShowDrawer} />
        <div className="h-full overflow-auto">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
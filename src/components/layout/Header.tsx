import { Avatar } from "@nextui-org/react";
import { MenuIcon } from "../icons";

interface HeaderProps {
  onClickMenu: () => void;
}

function Header(props: HeaderProps) {
  return (
    <div className="h-[80px] bg-gradient-to-b from-slate-500 dark:from-slate-900 to-transparent p-4 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center">
        <div className="block md:hidden" onClick={props.onClickMenu}>
          {MenuIcon}
        </div>
        <span className="text-xl font-bold ml-4 md:ml-0">
          Piloto Gen AI
        </span>
      </div>
      <div>
        <Avatar color="default" name="Admin" />
      </div>
    </div>
  );
}

export default Header;
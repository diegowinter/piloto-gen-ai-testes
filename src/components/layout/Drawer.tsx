import { Button } from "@nextui-org/react";
import { AddIcon, ChevronLeftIcon } from "../icons";
import ServiceHistoryItem from "../common/ServiceHistoryItem";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from 'uuid';
import { useContext } from "react";
import { ServicesContext } from "@/context/ServiceContext";

interface DrawerProps {
  showMenuButton?: boolean;
  onClickMenu?: () => void;
}

function Drawer(props: DrawerProps) {
  const router = useRouter()

  const { servicesState } = useContext(ServicesContext)

  const newService = () => {
    router.push(`/service/${uuidv4()}`)
  }

  return (
    <div className="bg-slate-950 flex flex-col flex-shrink-0 w-[300px] h-full ">
      {props.showMenuButton && (
        <div className="p-4 block md:hidden" onClick={props.onClickMenu}>
          <div className="flex flex-row">
            {ChevronLeftIcon}
            <span className="ml-2 font-bold">Fechar menu</span>
          </div>
        </div>
      )}
      <div className="h-[80px] flex items-center justify-center p-2">
        <Button
          className="m-2 w-full"
          endContent={AddIcon}
          onClick={newService}
        >
          Nova consulta
        </Button>
      </div>
      <div className="flex flex-col flex-grow overflow-y-auto px-2"> {/* Possivelmente novo componente */}
        <span className="opacity-70 text-sm mb-2 px-2 mt-6">Últimas consultas</span>
        {[...servicesState ?? []].reverse().map((service) => (
          <ServiceHistoryItem
            key={service.id}
            label={service.title}
            onClick={() => router.push(`/service/${service.id}`)}
          />
        ))}
        {(servicesState ?? []).length === 0 && (
          <div>
            <span className="text-sm opacity-70 px-2">Nenhuma consulta realizada</span>
          </div>
        )}
        {/* <span className="opacity-70 text-sm mb-2 px-2 mt-6">Hoje</span> */}
        {/* <ServiceHistoryItem label="Paciente Maria com tonturas ao acordar" /> */}
      </div>
    </div>
  );
}

export default Drawer;
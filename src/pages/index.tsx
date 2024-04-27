import { AddIcon, SparklesIcon } from "@/components/icons";
import { Button } from "@nextui-org/react";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";

function Home() {

  const router = useRouter()

  const newService = () => {
    router.push(`/service/${nanoid(10)}`)
  }

  return (
    <div className="flex flex-col p-8 items-center justify-center h-full">
      {SparklesIcon}
      <h1 className="text-5xl font-semibold mt-8">Bem-vindo(a) ao Piloto Gen AI!</h1>
      <span className="my-10 text-2xl">
        Inicie uma nova consulta ou selecione uma consulta existente no histórico para visualizar.
      </span>
      <span className="text-xl mb-16">
        Você pode configurar os modelos de transcrição e de IA para aprimorar a experiência.
      </span>
      <Button
        color="primary"
        endContent={AddIcon}
        onClick={newService}
      >
        Iniciar nova consulta
      </Button>
    </div>
  );
}

export default Home;
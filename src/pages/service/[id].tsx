import NewServiceForm from "@/components/forms/service-form/ServiceForm";
import { ServicesContext } from "@/context/ServiceContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

function ServiceDetails() {
  const router = useRouter()
  const { id } = router.query;

  const { servicesState, getServiceById } = useContext(ServicesContext);
  const [serviceData, setServiceData] = useState<ServiceFormData | undefined>(undefined)

  useEffect(() => {
    if (id) {
      let data = getServiceById(id as string)
      if (!data) {
        data = {
          transcriptionModel: 'gladia',
          aiModel: 'GPT',
          title: servicesState!.length > 0 ? `Consulta ${servicesState!.length + 1}` : 'Nova consulta',
          description: '',
          type: 'clinico-geral'
        }
      }
      setServiceData(data)
    }
  }, [id])

  return (
    <div className="p-4 h-full max-w-[1100px] ml-auto mr-auto">
      {serviceData && <NewServiceForm serviceData={serviceData} />}
    </div>
  );
}

export default ServiceDetails;
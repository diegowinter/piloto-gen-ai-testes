import React, { createContext, useState, useEffect } from 'react';

// Interface para o contexto dos serviços
interface ServicesContextProps {
  servicesState: ServiceFormData[] | null;
  setServicesState: React.Dispatch<React.SetStateAction<ServiceFormData[] | null>>;
  getAllServices: () => ServiceFormData[] | null;
  getServiceById: (id: string) => ServiceFormData | undefined;
  saveService: (service: ServiceFormData) => void;
}

// Criando o contexto dos serviços
export const ServicesContext = createContext<ServicesContextProps>({
  servicesState: null,
  setServicesState: () => { },
  getAllServices: () => null,
  getServiceById: (id: string) => undefined,
  saveService: () => { },
});

// Componente provedor de serviços
export const ServicesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [servicesState, setServicesState] = useState<ServiceFormData[] | null>(null);

  // Função para recuperar todos os serviços do LocalStorage
  const getAllServices = () => {
    const storedServices = localStorage.getItem('services');
    if (storedServices) {
      return JSON.parse(storedServices) as ServiceFormData[];
    }
    return null;
  };

  // Função para recuperar um serviço por ID
  const getServiceById = (id: string) => {
    const services = getAllServices();
    if (services) {
      return services.find(service => service.id === id);
    }
    return undefined;
  };

  // Função para salvar um serviço no LocalStorage
  const saveService = (service: ServiceFormData) => {
    let updatedServices: ServiceFormData[] = [];
    const storedServices = localStorage.getItem('services');
    if (storedServices) {
      updatedServices = JSON.parse(storedServices) as ServiceFormData[];
    }
    if (!service.id) {
      service.id = Math.random().toString(36).substr(2, 9); // Gerar um ID aleatório se não estiver presente
    }
    updatedServices.push(service);
    localStorage.setItem('services', JSON.stringify(updatedServices));
    setServicesState(updatedServices);
  };

  // Carregar os serviços ao montar o componente
  useEffect(() => {
    const storedServices = localStorage.getItem('services');
    if (storedServices) {
      setServicesState(JSON.parse(storedServices) as ServiceFormData[]);
    }
  }, []);

  return (
    <ServicesContext.Provider value={{ servicesState, setServicesState, getAllServices, getServiceById, saveService }}>
      {children}
    </ServicesContext.Provider>
  );
};

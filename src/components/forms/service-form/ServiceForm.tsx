import { Button, Input, Progress, Select, SelectItem, Textarea } from "@nextui-org/react"
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ServicesContext } from "@/context/ServiceContext";
import { API_URL } from "@/constants";
import AudioTranscriptionContainer from "@/components/service/AudioTranscriptionContainer";
import Handbook from "@/components/service/Handbook";

interface ServiceFormProps {
  serviceData?: ServiceFormData
}

function ServiceForm(props: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isHandbookGenerated, setIsHandbookGenerated] = useState(false)

  const [liveTranscription, setLiveTranscription] = useState('')

  const { saveService } = useContext(ServicesContext);

  const [newServiceForm, setNewServiceForm] = useState<ServiceFormData>({
    transcriptionModel: 'gladia',
    aiModel: 'GPT',
    title: '',
    description: '',
    type: 'clinico-geral'
  })


  /**
   * Função para atualizar o estado da transcrição em tempo real.
   * @param transcription Transcrição do áudio que está sendo capturado.
   */
  const updateLiveTranscription = (transcription: string) => {
    setLiveTranscription(transcription)
  }


  /**
   * Função para atualizar o estado do formulário de consulta.
   * @param key Chave do campo a ser atualizado.
   * @param value Valor do campo a ser atualizado.
   */
  const handleFormEdit = (key: string, value: string) => {
    setNewServiceForm(prevState => ({
      ...prevState, [key]: value
    }))
  }


  /**
   * Função para submeter a consulta para geração do prontuário.
   */
  const submitService = async () => {
    setIsSubmitting(true)

    const resSummary = await axios.post(`${API_URL}/summarize_text`, {
      text: liveTranscription
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        'model': newServiceForm.aiModel
      }
    })

    if (resSummary.status == 200) {
      const newService = {
        ...newServiceForm,
        'audioTranscription': liveTranscription,
        'transcriptionSummary': resSummary.data
      }

      saveService(newService)
      setNewServiceForm(newService)
      setIsHandbookGenerated(true)
    }

    setIsSubmitting(false)
  }

  useEffect(() => {
    // Se há dados de uma consulta (caso do uso do formulário para exibir uma consulta existente),
    // preenche o formulário com os dados da consulta.
    if (props.serviceData) {
      setNewServiceForm(props.serviceData)
      setIsHandbookGenerated(!!props.serviceData.transcriptionSummary)
    }
  }, [props.serviceData])

  return (
    <div className="flex flex-col h-full w-full" >

      {/* Cabeçalho e seletores de modelos */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 ">
        <h1 className="text-3xl w-full lg:w-fit lg:flex-shrink-0 mr-0 lg:mr-6 mb-4 lg:mb-0">
          {isHandbookGenerated ? 'Consulta' : 'Nova consulta'}
        </h1>
        <div className="flex flex-row w-full justify-end">
          <Select
            label="Modelo LLM"
            className="max-w-xs ml-2"
            selectedKeys={[newServiceForm.aiModel]}
            onChange={(e) => handleFormEdit('aiModel', e.target.value)}
            isDisabled={isHandbookGenerated}
            isRequired
          >
            <SelectItem value="GPT" key="GPT">GPT</SelectItem>
            <SelectItem value="gemini" key="Gemini">Gemini</SelectItem>
          </Select>
        </div>
      </div>

      {/* Formulário de dados da consulta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Input
          label="Título da consulta"
          className="col-span-1 lg:col-span-2 w-full"
          value={newServiceForm.title}
          onChange={(e) => handleFormEdit('title', e.target.value)}
          isRequired
        />
        <Select
          label="Tipo de consulta"
          className="w-full"
          selectedKeys={[newServiceForm.type]}
          onChange={(e) => handleFormEdit('type', e.target.value)}
          isDisabled={isHandbookGenerated}
          isRequired
        >
          <SelectItem value="clinico-geral" key="clinico-geral">Consulta com clínico geral</SelectItem>
          <SelectItem value="retorno" key="retorno">Consulta de retorno</SelectItem>
        </Select>
        <Textarea
          type="text"
          label="Descrição da consulta"
          className="col-span-1 lg:col-span-3 w-full"
          value={newServiceForm.description}
          onChange={(e) => handleFormEdit('description', e.target.value)}
        />
      </div>

      {/* Captura da consulta ou exibição do prontuário gerado */}
      {!isHandbookGenerated ? (
        <AudioTranscriptionContainer updateTranscript={updateLiveTranscription} />
      ) : (
        <Handbook serviceData={newServiceForm} />
      )}

      {isSubmitting && (
        <div className="flex flex-col h-full w-full items-center justify-center my-6">
          <Progress size="sm" isIndeterminate aria-label="Loading..." className="max-w-sm mb-4" />
          <span>Gerando prontuário. Por favor, aguarde.</span>
        </div>
      )}

      {/* Ações do formulário */}
      <div className="flex flex-row w-full justify-end pb-4">
        <Button
          className="h-8 ml-4"
          onClick={submitService}
          color="primary"
          isDisabled={isSubmitting || liveTranscription === ''}
        >
          {isHandbookGenerated ? 'Salvar alterações' : 'Gerar prontuário'}
        </Button>
      </div>
    </div>
  );
}

export default ServiceForm;
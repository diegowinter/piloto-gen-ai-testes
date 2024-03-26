import { Button, Card, CardBody, Input, Progress, Select, SelectItem, Tab, Tabs, Textarea } from "@nextui-org/react"
import { MicIcon, SparklesIcon, UploadIcon } from "../../icons";
import { useFilePicker } from "use-file-picker";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ServicesContext } from "@/context/ServiceContext";
import Markdown from "react-markdown";
import AskAssistant from "./AskAssistant";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

interface ServiceFormProps {
  serviceData?: ServiceFormData
}

function ServiceForm(props: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isHandbookGenerated, setIsHandbookGenerated] = useState(false)
  const [step, setStep] = useState('transcription')

  const { saveService } = useContext(ServicesContext);

  const [newServiceForm, setNewServiceForm] = useState<ServiceFormData>({
    transcriptionModel: 'gladia',
    aiModel: 'GPT',
    title: '',
    description: '',
    type: 'clinico-geral'
  })

  const { openFilePicker, filesContent, loading, clear } = useFilePicker({
    accept: '.mp3, .wav',
    multiple: false,
    readAs: 'ArrayBuffer'
  })

  const [audioDuration, setAudioDuration] = useState(0)
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)

  const recorderControls = useAudioRecorder()
  const processRecordedAudio = (blob: Blob) => {
    console.log('Processando áudio gravado...')
    console.log('Tamanho do arquivo:', blob.size)

    setRecordedAudio(blob)
  }

  const handleFormEdit = (key: string, value: string) => {
    setNewServiceForm({
      ...newServiceForm,
      [key]: value
    })
  }

  const submitService = async () => {
    setIsSubmitting(true)

    const formData = new FormData();

    if (filesContent[0]) {
      const fileBlob = new Blob([filesContent[0].content], { type: 'audio/mpeg' });
      formData.append('file', fileBlob, filesContent[0].name)
    } else {
      formData.append('file', recordedAudio!, 'audio.weba')
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        'transcriber': newServiceForm.transcriptionModel,
      }
    }

    const resTranscription = await axios.post("https://3.22.222.8.nip.io/transcribe", formData, config)

    setStep('summary')

    const resSummary = await axios.post("https://3.22.222.8.nip.io/summarize_text", {
      text: resTranscription.data.transcript
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        'model': newServiceForm.aiModel
      }
    })

    if (resTranscription.status == 200 && resSummary.status == 200) {
      const newService = {
        ...newServiceForm,
        'audioTranscription': resTranscription.data.transcript,
        'transcriptionSummary': resSummary.data
      }

      saveService(newService)
      setNewServiceForm(newService)
      setIsHandbookGenerated(true)
    }

    setIsSubmitting(false)
  }

  useEffect(() => {
    if (props.serviceData) {
      setNewServiceForm(props.serviceData)
      setIsHandbookGenerated(!!props.serviceData.transcriptionSummary)
      clear()
      setHasRecordedAudio(false)
      setStep('transcription')
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
            label="Modelo de transcrição"
            className="max-w-full lg:max-w-xs mr-2"
            selectedKeys={[newServiceForm.transcriptionModel]}
            onChange={(e) => handleFormEdit('transcriptionModel', e.target.value)}
            isDisabled={isHandbookGenerated}
            isRequired
          >
            <SelectItem value="gladia" key="gladia">Gladia</SelectItem>
            <SelectItem value="whisper" key="whisper">Whisper</SelectItem>
          </Select>
          <Select
            label="Modelo de IA"
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
      {/* Botões de upload e captura de áudio */}
      <div className="bg-slate-300 dark:bg-slate-900 w-full p-3 my-6 rounded-xl">
        {!isHandbookGenerated ? (
          <div className="">
            <span className="text-xs opacity-80">Gravação da consulta</span>
            {(filesContent[0] || hasRecordedAudio) && !isSubmitting && (
              <div className="flex flex-col items-center justify-center h-full my-6">
                <span className="text-xl font-bold mb-2">Arquivo selecionado</span>
                <span className="bg-slate-950 px-2 py-1 rounded-lg">
                  {filesContent[0] ? (
                    <span>{filesContent[0].name}</span>
                  ) : (
                    <span>Gravação de áudio ({audioDuration}s)</span>
                  )}
                </span>
              </div>
            )}
            {loading && (
              <div>Carregando...</div>
            )}
            {!filesContent[0] && !hasRecordedAudio && !loading && !isSubmitting && (
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch justify-around my-6">
                <div
                  className="flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-950 p-6 w-full mx-4 rounded-lg cursor-pointer"
                  onClick={() => openFilePicker()}
                >
                  {UploadIcon}
                  <span className="mt-3">Carregar arquivo</span>
                </div>
                <div className="flex flex-col items-center bg-slate-200 dark:bg-slate-950 p-6 w-full mt-4 rounded-lg cursor-pointer">
                  {MicIcon}
                  <span className="my-3">{recorderControls.isRecording ? `Gravando (${recorderControls.recordingTime}s)` : 'Capturar áudio'}</span>
                  <Button
                    onClick={() => {
                      if (!recorderControls.isRecording) {
                        recorderControls.startRecording()
                      } else {
                        console.log("Parada solicitada!")
                        setAudioDuration(recorderControls.recordingTime)
                        recorderControls.stopRecording()
                        setHasRecordedAudio(true)
                      }
                    }}
                  >
                    {recorderControls.isRecording ? 'Parar' : 'Gravar'}
                  </Button>
                </div>
              </div>
            )}
            <AudioRecorder
              onRecordingComplete={(blob) => {
                processRecordedAudio(blob)
              }}
              recorderControls={recorderControls}
              classes={{
                AudioRecorderClass: 'recorder',
                AudioRecorderTimerClass: 'display-none',
                AudioRecorderStatusClass: 'display-none',
                AudioRecorderStartSaveClass: 'display-none',
                AudioRecorderPauseResumeClass: 'display-none',
                AudioRecorderDiscardClass: 'display-none',
              }}
            />
            {isSubmitting && (
              <div className="flex flex-col h-full w-full items-center justify-center my-6">
                <Progress size="sm" isIndeterminate aria-label="Loading..." className="max-w-sm mb-4" />
                <span>{`${step === 'transcription' ? 'Transcrevendo áudio' : 'Gerando prontuário'}. Por favor, aguarde.`}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex w-full h-full flex-col">
            <Tabs aria-label="Options">
              <Tab
                key="handbook"
                title={
                  <div className="flex items-center space-x-2">
                    {SparklesIcon}
                    <span>Prontuário gerado</span>
                  </div>
                }
              >
                <Card>
                  <CardBody>
                    <div className="prose dark:prose-invert max-w-none">
                      {/* {newServiceForm.transcriptionSummary} */}
                      <Markdown>{newServiceForm.transcriptionSummary}</Markdown>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="ask-ai" title="Pergunte à IA">
                <Card>
                  <CardBody>
                    <AskAssistant
                      audioTranscription={newServiceForm.audioTranscription!}
                      aiModel={newServiceForm.aiModel}
                    />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="transcription" title="Transcrição original">
                <Card>
                  <CardBody>
                    {newServiceForm.audioTranscription}
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        )}
      </div>
      {/* Botão de submissão do formulário */}
      <div className="flex flex-row w-full justify-end pb-4">
        <Button variant="light" className="h-8">Cancelar</Button>
        <Button
          className="h-8 ml-4"
          onClick={submitService}
          color="primary"
        >
          Gerar prontuário
        </Button>
      </div>
    </div>
  );
}

export default ServiceForm;
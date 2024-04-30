import { Button } from '@nextui-org/button';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { RecMicIcon, StopIcon, TrashIcon } from '../icons';
import { useEffect } from 'react';

interface AudioTranscriptionContainerProps {
  updateTranscript: (transcript: string) => void
}

function AudioTranscriptionContainer(props: AudioTranscriptionContainerProps) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition()

  // Inicializa ou interrompe a captura de áudio
  const toggleRecording = () => {
    if (listening) {
      SpeechRecognition.stopListening()
    } else {
      SpeechRecognition.startListening({ language: 'pt-BR', continuous: true })
    }
  }

  // Atualiza a transcrição da consulta para o componente pai
  useEffect(() => {
    props.updateTranscript(transcript)
  }, [transcript])

  return (
    <div className="bg-slate-300 dark:bg-slate-900 w-full p-3 my-4 rounded-xl">
      <span className="text-lg opacity-80 font-semibold">Captura de áudio da consulta</span>

      {/* Captura da transcrição */}
      <div className="my-3">
        <div className="flex items-center justify-center">
          <Button onClick={toggleRecording}>
            {listening ? (
              <div className="flex flex-row justify-center items-center">
                {StopIcon}
                <span className="ml-2">Parar captura da consulta</span>
              </div>
            ) : (
              <div className="flex flex-row items-center">
                {RecMicIcon}
                <span className="ml-2">{
                  transcript === '' ? "Iniciar captura da consulta" : "Retomar captura da consulta"
                }</span>
              </div>
            )}
          </Button>
        </div>

        {/* Exibição da transcrição */}
        {(listening || transcript !== '') && (
          <div className="my-2 flex flex-col">
            <span className="text-sm opacity-80">Transcrição</span>
            <span>{transcript}</span>
          </div>
        )}

        {/* Limpeza da transcrição */}
        {transcript !== '' && (
          <div className="flex flex-row justify-end">
            <Button onClick={resetTranscript}>
              <div className="flex flex-row justify-center items-center">
                {TrashIcon}
                <span className="ml-2">Limpar transcrição</span>
              </div>
            </Button>
          </div>
        )}

        {/* Exibição do status de permissão de microfone */}
        {!isMicrophoneAvailable && (
          <span className="text-sm opacity-70 text-red-400 pt-4">
            Pode ser que seu microfone esteja indisponível. Atualize a página e permita o acesso ao microfone ou verifique as permissões da página.
          </span>
        )}
      </div>
    </div>
  );
}

export default AudioTranscriptionContainer;
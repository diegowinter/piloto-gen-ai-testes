interface ServiceFormData {
  id?: string
  transcriptionModel: string
  aiModel: string
  title: string
  description: string
  type: ServiceType
  audioTranscription?: string
  transcriptionSummary?: string
}

type TranscriptionModel = 'gladia' | 'whisper'

type AIModel = 'GPT' | 'Gemini'

type ServiceType = 'clinico-geral' | 'retorno' | 'psicologico' | 'pediatrico' | 'ginecologico' | 'relato-cirurgico'

type ProcessingStep = 'transcription' | 'summary'
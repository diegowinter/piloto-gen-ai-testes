import { PaperAirplaneIcon } from "@/components/icons";
import { API_URL } from "@/constants";
import { Button, Input, Skeleton } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";

interface AskAssistantProps {
  audioTranscription: string,
  aiModel: string
}

function AskAssistant(props: AskAssistantProps) {
  const [inputValue, setInputValue] = useState('' as string)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false)

  const askAssistant = async () => {
    setIsAwaitingResponse(true)
    const questionContent = inputValue
    setQuestion(questionContent)
    setAnswer('')
    setInputValue('')

    const res = await axios.post(`${API_URL}/summarize_text`, {
      text: props.audioTranscription
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        'model': props.aiModel,
        'prompt': questionContent
      }
    })

    if (res.status === 200) {
      setAnswer(res.data)
    }

    setIsAwaitingResponse(false)
  }

  return (
    <div className="flex flex-col">
      <div className="h-80 overflow-y-auto mb-4">
        {!question && !answer && (
          <div className="mb-5">
            <span className="font-bold">Assistente</span>
            <p>Olá! Como posso te ajudar?</p>
          </div>
        )}
        {question && (
          <div className="mb-5">
            <span className="font-bold">Você</span>
            <p>{question}</p>
          </div>
        )}
        {answer && (
          <div>
            <span className="font-bold">Assistente</span>
            <p>{answer}</p>
          </div>
        )}
        {isAwaitingResponse && (
          <div className="space-y-3">
            <span className="font-bold">Assistente</span>
            <Skeleton className="w-full rounded-lg">
              <div className="h-3 w-full rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-full rounded-lg">
              <div className="h-3 w-full rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        )}
      </div>
      <div className="flex flex-row space-x-2">
        <Input
          placeholder="Pergunte algo à IA"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={askAssistant}>
          {PaperAirplaneIcon}
        </Button>
      </div>
    </div>
  );
}

export default AskAssistant;
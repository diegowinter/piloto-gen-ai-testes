import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { SparklesIcon } from "../icons";
import Markdown from "react-markdown";
import AskAssistant from "../forms/service-form/AskAssistant";

interface HandbookProps {
  serviceData: ServiceFormData
}

function Handbook(props: HandbookProps) {
  return (
    <div className="bg-slate-300 dark:bg-slate-900 w-full p-3 my-4 rounded-xl">
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
                  <Markdown>{props.serviceData.transcriptionSummary}</Markdown>
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="ask-ai" title="Pergunte à IA">
            <Card>
              <CardBody>
                <AskAssistant
                  audioTranscription={props.serviceData.audioTranscription!}
                  aiModel={props.serviceData.aiModel}
                />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="transcription" title="Transcrição original">
            <Card>
              <CardBody>
                {props.serviceData.audioTranscription}
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Handbook;
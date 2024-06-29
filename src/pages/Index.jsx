import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Index = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [translatedText, setTranslatedText] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (transcript) {
      translateText(transcript);
    }
  }, [transcript]);

  const translateText = async (text) => {
    try {
      const response = await axios.post(
        "https://translation.googleapis.com/language/translate/v2",
        {},
        {
          params: {
            q: text,
            target: "zh",
            key: apiKey,
          },
        }
      );
      setTranslatedText(response.data.data.translations[0].translatedText);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  const stopListening = () => SpeechRecognition.stopListening();

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="w-full max-w-lg p-4">
        <CardHeader>
          <CardTitle className="text-center">Real-Time Translation Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="api-key">Google API Key</Label>
            <Input
              id="api-key"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google API Key"
            />
          </div>
          <div className="mb-4">
            <Button onClick={startListening} disabled={listening} className="mr-2">
              Start Listening
            </Button>
            <Button onClick={stopListening} disabled={!listening}>
              Stop Listening
            </Button>
            <Button onClick={resetTranscript} className="ml-2">
              Reset
            </Button>
          </div>
          <div className="mb-4">
            <Label>Transcript:</Label>
            <p className="p-2 border rounded">{transcript}</p>
          </div>
          <div>
            <Label>Translated Text:</Label>
            <p className="p-2 border rounded">{translatedText}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
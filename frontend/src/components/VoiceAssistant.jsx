import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import voiceAssistant from '@/utils/voiceAssistant';
import { askAIAssistant } from '@/services/api';
import { toast } from 'sonner';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(voiceAssistant.isSupported());
  }, []);

  const handleStartListening = () => {
    setTranscript('');
    setResponse('');
    setIsListening(true);
    
    voiceAssistant.startListening(
      async (text) => {
        setTranscript(text);
        setIsListening(false);
        
        // Get AI response
        try {
          const result = await askAIAssistant(text, 'disaster safety and management');
          const aiResponse = result.data.response;
          setResponse(aiResponse);
          
          // Speak the response
          setIsSpeaking(true);
          voiceAssistant.speak(aiResponse);
          setTimeout(() => setIsSpeaking(false), 3000);
          
          toast.success('Voice command processed');
        } catch (error) {
          console.error('AI Assistant error:', error);
          const fallbackResponse = 'I am here to help you with disaster safety. Please try asking about weather, alerts, or safety tips.';
          setResponse(fallbackResponse);
          voiceAssistant.speak(fallbackResponse);
          toast.error('Failed to process command');
        }
      },
      (error) => {
        setIsListening(false);
        toast.error('Voice recognition error: ' + error);
      }
    );
  };

  const handleStopListening = () => {
    voiceAssistant.stopListening();
    setIsListening(false);
  };

  const handleStopSpeaking = () => {
    voiceAssistant.stop();
    setIsSpeaking(false);
  };

  if (!isSupported) {
    return (
      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground text-center">
          Voice assistant is not supported in your browser. Please use Chrome, Edge, or Safari.
        </p>
      </Card>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {(transcript || response) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 max-w-md"
          >
            <Card className="p-4 bg-background/95 backdrop-blur-lg border-2 shadow-2xl">
              {transcript && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-primary mb-1">You said:</p>
                  <p className="text-sm text-foreground">{transcript}</p>
                </div>
              )}
              {response && (
                <div>
                  <p className="text-xs font-semibold text-green-600 mb-1">Assistant:</p>
                  <p className="text-sm text-foreground">{response}</p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex gap-2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`rounded-full h-16 w-16 shadow-2xl ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            }`}
            data-testid="voice-assistant-button"
          >
            {isListening ? (
              <MicOff className="w-7 h-7" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </Button>
        </motion.div>
        
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={handleStopSpeaking}
              className="rounded-full h-16 w-16 shadow-2xl bg-orange-500 hover:bg-orange-600"
              data-testid="stop-speaking-button"
            >
              <VolumeX className="w-7 h-7" />
            </Button>
          </motion.div>
        )}
      </div>
      
      {isListening && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-green-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
};

export default VoiceAssistant;

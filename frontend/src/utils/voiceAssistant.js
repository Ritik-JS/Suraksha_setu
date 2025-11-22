// Voice Assistant using Web Speech API

class VoiceAssistant {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.onResult) {
          this.onResult(transcript);
        }
      };
      
      this.recognition.onerror = (event) => {
        if (this.onError) {
          this.onError(event.error);
        }
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }
  
  startListening(onResult, onError) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported');
      return;
    }
    
    this.onResult = onResult;
    this.onError = onError;
    this.isListening = true;
    this.recognition.start();
  }
  
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  speak(text, options = {}) {
    if (!this.synthesis) return;
    
    // Cancel any ongoing speech
    this.synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;
    utterance.lang = options.lang || 'en-US';
    
    this.synthesis.speak(utterance);
  }
  
  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    this.stopListening();
  }
  
  isSupported() {
    return !!this.recognition && !!this.synthesis;
  }
}

export default new VoiceAssistant();

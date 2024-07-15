// src/services/VoiceRecognitionService.js
class VoiceRecognitionService {
    constructor() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  
    startRecognition(callback) {
      this.recognition.onresult = (event) => {
        const speechToText = event.results[event.resultIndex][0].transcript;
        callback(speechToText);
      };
      this.recognition.start();
    }
  
    stopRecognition() {
      this.recognition.stop();
    }
  }
  
  export default new VoiceRecognitionService();
  
import Fuse from 'fuse.js';

class VoiceRecognitionService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    // Define the commands for fuzzy matching
    this.commands = [
      'show grand farm', 'hide grand farm',
      'show garage', 'hide garage',
      'show freezer', 'hide freezer',
      'show temperature', 'hide temperature',
      'show humidity', 'hide humidity',
      'show wind', 'hide wind',
      'show soil moisture', 'hide soil moisture',
      'show leaf wetness', 'hide leaf wetness',
      'show rainfall', 'hide rainfall',
      'expand temperature details', 'expand humidity details',
      'expand wind details', 'expand soil moisture details',
      'expand leaf wetness details', 'expand rainfall details',
      'log out'
    ];

    // Initialize fuse.js for fuzzy matching
    this.fuse = new Fuse(this.commands, { includeScore: true, threshold: 0.4 });
  }

  startRecognition(callback) {
    this.recognition.onresult = (event) => {
      const speechToText = event.results[event.resultIndex][0].transcript.trim();
      const matches = this.fuse.search(speechToText);
      if (matches.length > 0) {
        const command = matches[0].item;
        callback(command);
      } else {
        callback(null);
      }
    };
    this.recognition.start();
  }

  stopRecognition() {
    this.recognition.stop();
  }
}

export default new VoiceRecognitionService();

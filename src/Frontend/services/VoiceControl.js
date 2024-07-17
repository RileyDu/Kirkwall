// import React, { useEffect, useState } from 'react';
// import { useToast } from '@chakra-ui/react';
// import VoiceRecognitionService from '../services/VoiceRecognitionService';
// import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

// const VoiceControl = ({ onCommand }) => {
//   const [isListening, setIsListening] = useState(false);
//   const toast = useToast();

//   useEffect(() => {
//     if (isListening) {
//       VoiceRecognitionService.startRecognition(handleVoiceCommand);
//     } else {
//       VoiceRecognitionService.stopRecognition();
//     }
//     return () => {
//       VoiceRecognitionService.stopRecognition();
//     };
//   }, [isListening]);

//   const handleVoiceCommand = (command) => {
//     if (command) {
//       toast({
//         title: `Voice Command: ${command}`,
//         status: 'info',
//         duration: 2000,
//         isClosable: true,
//       });
//       onCommand(command);
//     } else {
//       toast({
//         title: 'Command not recognized',
//         status: 'warning',
//         duration: 2000,
//         isClosable: true,
//       });
//     }
//     setIsListening(false); // Stop listening after recognizing the command
//   };

//   return (
//     <button
//       onClick={() => setIsListening(!isListening)}
//       style={{
//         position: 'fixed',
//         bottom: '20px',
//         right: '20px',
//         backgroundColor: isListening ? '#ff4d4d' : '#4caf50',
//         color: 'white',
//         border: 'none',
//         borderRadius: '50%',
//         width: '60px',
//         height: '60px',
//         fontSize: '24px',
//         cursor: 'pointer',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//     >
//       {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
//     </button>
//   );
// };

// export default VoiceControl;

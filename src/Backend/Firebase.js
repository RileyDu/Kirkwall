// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCS52Y5zMvzmBOdNnuxk3L8PrfKZEnY__s",
  authDomain: "kirkwall-weather-hub.firebaseapp.com",
  projectId: "kirkwall-weather-hub",
  storageBucket: "kirkwall-weather-hub.appspot.com",
  messagingSenderId: "760768485973",
  appId: "1:760768485973:web:c820cba35b639174aad2dc",
  measurementId: "G-PM3J2MTH02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
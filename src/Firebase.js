import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyBs7qttuW__3D-SIsgKmH9dXOukgP2F1Ro",
    authDomain: "img-map-25e9a.firebaseapp.com",
    databaseURL: "https://img-map-25e9a.firebaseio.com",
    projectId: "img-map-25e9a",
    storageBucket: "img-map-25e9a.appspot.com",
    messagingSenderId: "215781341742",
    appId: "1:215781341742:web:bcaef16936d5749044bdbf",
    measurementId: "G-MX32W7G461"
  };

  firebase.initializeApp(config);
  
  export const database = firebase.database();
  export const storage = firebase.storage();
  export const provider = new firebase.auth.GoogleAuthProvider();
  export const auth = new firebase.auth();

  export default firebase;
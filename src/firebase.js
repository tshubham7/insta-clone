import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBQ91YzAuPIYYTEZaDHoP2RzlblYYEZRGk",
    authDomain: "insta-clone-1f8c0.firebaseapp.com",
    databaseURL: "https://insta-clone-1f8c0.firebaseio.com",
    projectId: "insta-clone-1f8c0",
    storageBucket: "insta-clone-1f8c0.appspot.com",
    messagingSenderId: "659744805460",
    appId: "1:659744805460:web:69aaa5ab6e975f0c9c53c1"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};

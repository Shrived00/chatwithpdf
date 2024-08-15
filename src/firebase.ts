
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyB3xbbq95ICezCQS6VJNjfOT2WYwaEWIDE",
    authDomain: "chatwith-a55c7.firebaseapp.com",
    projectId: "chatwith-a55c7",
    storageBucket: "chatwith-a55c7.appspot.com",
    messagingSenderId: "452160016754",
    appId: "1:452160016754:web:ac25b51cf1a5d0d0d74deb",
    measurementId: "G-K755GQ3FLY",

};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage }


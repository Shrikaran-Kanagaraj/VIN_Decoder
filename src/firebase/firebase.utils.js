import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyCUbxAg1rXZxtEUgGGZpZRYUUmbEr3SeTM",
  authDomain: "vin-decoder-cd98c.firebaseapp.com",
  databaseURL: "https://vin-decoder-cd98c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vin-decoder-cd98c",
  storageBucket: "vin-decoder-cd98c.appspot.com",
  messagingSenderId: "763219565057",
  appId: "1:763219565057:web:721941bf9a3e494c597e00",
  measurementId: "G-KBWQTD1T84"
};

firebase.initializeApp(config);


export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const firebaseDB=firebase.database().ref();

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  console.log(snapShot);

  if (!snapShot.exists) {
    const { email } = userAuth;
    const {username}=additionalData;
    const createdAt = new Date();
    console.log(additionalData);
    try {
      await userRef.set({
        username,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};



export default firebase;

import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut, useAuthState } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC7WwP7OsoeFTeLMlTM73eopdAPvbCeu0g",
  authDomain: "cs-394-react-tutorial.firebaseapp.com",
  databaseURL: "https://cs-394-react-tutorial-default-rtdb.firebaseio.com",
  projectId: "cs-394-react-tutorial",
  storageBucket: "cs-394-react-tutorial.appspot.com",
  messagingSenderId: "641253081068",
  appId: "1:641253081068:web:1c4e1b1789c79fa046cac9",
  measurementId: "G-R5T705RJKK"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useData = (path, transform) => {
        const [data, setData] = useState();
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState();

        useEffect(() => {
          const dbRef = ref(database, path);
          const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
          if (devMode) { console.log(`loading ${path}`); }
          return onValue(dbRef, (snapshot) => {
            const val = snapshot.val();
            if (devMode) { console.log(val); }
            setData(transform ? transform(val) : val);
            setLoading(false);
            setError(null);
          }, (error) => {
            setData(null);
            setLoading(false);
            setError(error);
          });
        }, [path, transform]);

        return [data, loading, error];
};

export const setData = (path, value) => (
  set(ref(database, path), value)
);

export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useUserState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    onIdTokenChanged(getAuth(firebase), setUser);
  }, []);

  return [user];
};

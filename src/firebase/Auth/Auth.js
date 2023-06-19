

import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseAuth } from '../../config/firebase'

import { getFirestore, getDoc, doc } from "firebase/firestore"

export const handleRolAdmin = async (email) => {

  const db = getFirestore();
  const dbRef = doc(db, "usuarios", email)
  const docSnapRol = await getDoc(dbRef);
  if (docSnapRol.data()!==undefined) {
    if (docSnapRol.data().Rol === "Admin")
      return "admin";
    else {
      return "noadmin";
    }
  }
  return "nousuario";

}

export const loginWithCredentials = async ({ email, password }) => {
  try {
    const resp = await signInWithEmailAndPassword(FirebaseAuth, email, password);
    return resp.user.uid

  } catch (e) {
    if(e.code==="auth/wrong-password"){
      alert(
        'La contraseña no corresponde con el usuario',
     );
    }
  }
}
export const logoutFirebase = async () => await FirebaseAuth.signOut()
export const signInWithCredentials = async ({ email, password }) => {

  try {
    const resp = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
    return resp.user.uid

  } catch (e) {
    alert((e).message)
  }

}
export const onAuthStateHasChanged = (setSession) => {
  onAuthStateChanged(FirebaseAuth, user => {

    if (!user) return setSession({ status: 'no-authenticated', userId: null })

    setSession({ status: 'authenticated', userId: user.uid })
  })
}

export const getUserAuth = async () => {
  const auth = getAuth();
  return auth.currentUser.email;
}

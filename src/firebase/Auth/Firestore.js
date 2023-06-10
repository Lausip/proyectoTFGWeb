import { getFirestore, Timestamp, getDoc, doc, deleteDoc, arrayUnion, arrayRemove, getDocs, collection, orderBy, addDoc,updateDoc, where} from "firebase/firestore"

export const getFotoPerfil = async (email) => {

  const db = getFirestore();
  const docRef = doc(db, "usuarios", email);
  const docSnap = await getDoc(docRef);
  return docSnap.data().Foto;

}
export const addFavReporte = async (email, key) => {
  const db = getFirestore();
  const docRefReportes = doc(db, "usuarios", email);
  const dataReportes = { FavReportes: arrayUnion(key) };
  updateDoc(docRefReportes, dataReportes)

}

export const removeFavReporte = async (email, key) => {
  const db = getFirestore();
  const docRefReportes = doc(db, "usuarios", email);
  const dataReportes = { FavReportes: arrayRemove(key) };
  updateDoc(docRefReportes, dataReportes)

}


export const getFavReportes = async (email) => {

  const db = getFirestore();
  const docRef = doc(db, "usuarios", email);
  const docSnap = await getDoc(docRef);
  return docSnap.data().FavReportes;

}

export const getTodosReportes = async () => {
  const db = getFirestore();
  let snapshot = await getDocs(collection(db, "Reportes"), orderBy("FechaModificación", "desc"));
  let data = await Promise.all(snapshot.docs.map(async (documentSnapshot) => ({
    ...documentSnapshot.data(),
    key: documentSnapshot.id,
  })))
  return data;

}
export const getFavReportesEmail = async (email) => {
  const db = getFirestore();
  let fav = [];
  fav = await getFavReportes(email);
  let favoritos = []
  let snapshot = await getDocs(collection(db, "Reportes"), orderBy("FechaModificación", "desc"));
  await snapshot.docs.map(async (documentSnapshot) => {
    for (let i = 0; i < fav.length; i++) {
      if (fav[i] === documentSnapshot.id) {
        console.log(fav[i])
        favoritos.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id
        })
      }
    }
  })
  return favoritos;

}

export const getEmailComentarioTexto = async (libro, capitulo, comentario) => {
  const db = getFirestore();
  const docRef = doc(db, "libros", libro, "Capitulos", capitulo, "Mensajes", comentario);
  const docSnap = await getDoc(docRef);

  return docSnap.data().Comentario;
}

export const getTipoReportes = async () => {

  const db = getFirestore();
  let snapshot2 = await getDocs(collection(db, "Reportes"), orderBy("FechaModificación", "desc"), where("Tipo", "==", "Persona"));
  let data = await Promise.all(snapshot2.docs.map(async (documentSnapshot2) => ({
    ...documentSnapshot2.data(),
    key: documentSnapshot2.id,
  })))
  return data;

}
export const eliminarReporte = async (autor, email) => {

  const db = getFirestore();
  //Eliminar de favoritos
  await removeFavReporte(autor, email)
  const snap2 = await getDoc(doc(db, "Reportes", email));
  deleteDoc(snap2.ref)

}
export const bloquearPersona = async (email) => {

  const db = getFirestore();
  const dbRef = await doc(db, "usuarios", email.AutorReportado)
  updateDoc(dbRef, {
      AutorBloqueado: true,
  })

}

export const eliminarComentario = async (emailSeleccionado) => {
  const db = getFirestore();
  const docRef = await getDoc(doc(db, "libros", emailSeleccionado.Libro, "Capitulos", emailSeleccionado.Capitulo, "Mensajes", emailSeleccionado.Comentario));
  deleteDoc(docRef.ref);
}


export const eliminarLibro = async (bookId) => {
  const db = getFirestore();

  /*Eliminar los megusta de las personas que tienen megusta en ese libro*/

  const snap = await getDocs(collection(db, "usuarios"));
  snap.docs.map(async (documentSnapshot) => {
    const snap = await getDoc(doc(db, "usuarios", documentSnapshot.id, "MeGusta", bookId));
    deleteDoc(snap.ref)

  })

  /*Eliminar todos los capitulos*/
  const snap2 = await getDocs(collection(db, "libros", bookId, "Capitulos"));
  snap2.docs.map(async (documentSnapshot) => {
    const snap2 = await getDoc(doc(db, "libros", bookId, "Capitulos", documentSnapshot.id));
    deleteDoc(snap2.ref)
  })
  /*Eliminar todos las categorias*/
  const snap3 = await getDocs(collection(db, "libros", bookId, "Categorias"));
  snap3.docs.map(async (documentSnapshot) => {
    const snap3 = await getDoc(doc(db, "libros", bookId, "Categorias", documentSnapshot.id));
    deleteDoc(snap3.ref)
  })

  /*Eliminar el libro*/
  const dbRef = await doc(db, "libros", bookId)
  deleteDoc(dbRef)


}
export const enviarAvisoLibro = async (autor, email) => {
  const db = getFirestore();

  const docRefReportes = collection(db, "usuarios", autor, "Reportes");
  const dataReporte = {
    Tipo: "Libro",
    Texto: "Se ha eliminado el libro " + email.Titulo + "debido a " + email.Motivo,
    FechaCreación: Timestamp.fromDate(new Date()),
  };
  addDoc(docRefReportes, dataReporte);
}

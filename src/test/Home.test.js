/** @jest-environment jsdom */
import React from "react";
import { getFirestore, Timestamp, getDoc, doc, deleteDoc, arrayUnion, arrayRemove, getDocs, collection, orderBy, addDoc, updateDoc, where } from "firebase/firestore"
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthScreen } from "../screens/AuthScreen";
import { AuthContext,handleLogOut } from "../context/AuthContext";
import { getFotoPerfil, getTodosReportes, eliminarReporte, eliminarLibro, bloquearPersona, eliminarComentario, enviarAvisoLibro, getFavReportes, addFavReporte, removeFavReporte, getFavReportesEmail, getEmailComentarioTexto } from '../firebase/Auth/Firestore';
import { HomeScreen } from "../screens/HomeScreen";


firebase.initializeTestApp({
    projectId: "tfgbook-f69af",
    auth: { uid: "alice", email: "alice@example.com" }
});

firebase.initializeTestApp({
    databaseName: "my-database",
    auth: { uid: "alice" }
});
firebase.initializeTestApp({
    storageBucket: "tfgbook-f69af.appspot.com",
    auth: { uid: "alice" }
});
jest.mock('firebase/firestore', () => ({

    doc: () => jest.fn(),
    getFirestore: () => jest.fn(),
    getReactNativePersistence: () => jest.fn(),
    initializeAuth: () => jest.fn(),
    getAuth: () => jest.fn(),
    onAuthStateChanged: () => jest.fn(),
    signInWithEmailAndPassword: () => { return new Promise((resolve) => { resolve({ email: "admin@gmail.com" }) }) }
}))

jest.mock('firebase/firestore', () => {
    return {
        getDoc: jest.fn(),
        getFirestore: jest.fn(),
        doc: jest.fn(),
        collection: jest.fn(),
        orderBy: jest.fn(),
        getDocs: jest.fn(),
    }

})
jest.mock('../../src/firebase/Auth/Firestore', () => ({
    ...(jest.requireActual('../../src/firebase/Auth/Firestore')),
    getTodosReportes: jest.fn(),
    getFavReportesEmail: jest.fn()
}))



jest.mock('firebase/auth', () => {
    return { getAuth: jest.fn() }
})


describe('AuthScreen test', () => {
    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });

    it('Should click button Todos Los Email', async () => {
        getAuth.mockReturnValue({ currentUser: { email: "email" }, });
        getDoc.mockReturnValue({ data: () => ({ name: 'name-for-this-data-item', }), })
        getTodosReportes.mockReturnValue([{ Motivo: "Odio" },]);
        const { rerender } = render(<HomeScreen />)
        fireEvent.click(screen.getByTestId('buttoncogerTodosLosEmail'))

    });

    it('Should click button Reportes Tipo', async () => {
        getAuth.mockReturnValue({ currentUser: { email: "email" }, });
        getDoc.mockReturnValue({ data: () => ({ name: 'name-for-this-data-item', }), })
        getTodosReportes.mockReturnValue([{ Motivo: "Odio" },]);
        const { rerender } = render(<HomeScreen />)
        fireEvent.click(screen.getByTestId('buttoncogerReportesTipo'))
        fireEvent.click(screen.getByTestId('buttoncogerReportesTipoComentario'))
        fireEvent.click(screen.getByTestId('buttoncogerReportesTipoLibro'))
    });

    it('Should click button Fav Roportes', async () => {
        getAuth.mockReturnValue({ currentUser: { email: "email" }, });
        getDoc.mockReturnValue({ data: () => ({ name: 'name-for-this-data-item', }), })
        getTodosReportes.mockReturnValue([{ Motivo: "Odio" },]);
        getFavReportesEmail.mockReturnValue([{ Motivo: "Odio" },]);

        const { rerender } = render(<HomeScreen />)
        fireEvent.click(screen.getByTestId('buttoncogerFavReportes'))
    });
    it('Should open false', async () => {
        React.useState = jest.fn()
        .mockReturnValue([false, {}])

        getAuth.mockReturnValue({ currentUser: { email: "email" }, });
        getDoc.mockReturnValue({ data: () => ({ name: 'name-for-this-data-item', }), })
        getTodosReportes.mockReturnValue([{ Motivo: "Odio" },]);
        getFavReportesEmail.mockReturnValue([{ Motivo: "Odio" },]);

        const { rerender } = render(<HomeScreen />)

    });
/*     it('Should click on an email', async () => {
        getAuth.mockReturnValue({ currentUser: { email: "email" }, });
        getDoc.mockReturnValue({ data: () => ({ name: 'name-for-this-data-item', }), })
        getTodosReportes.mockReturnValue([{ Motivo: "Odio" },]);
        getFavReportesEmail.mockReturnValue([{ Motivo: "Odio" },]);
        React.useState = jest.fn()
        .mockReturnValue([{ Tipo: "Odio" }, {}])
 

        const { rerender } = render(<HomeScreen />)
        // eslint-disable-next-line testing-library/no-debugging-utils
        screen.debug(undefined, Infinity);
       // fireEvent.click(screen.getByTestId('buttonhandleEmailClick'))
    }); */

  /*   it('Should click handleLogOut', async () => {
        getAuth.mockReturnValue({ currentUser: { email: "email" }, });
        getDoc.mockReturnValue({ data: () => ({ name: 'name-for-this-data-item', }), })
        getTodosReportes.mockReturnValue([{ Motivo: "Odio" },]);

        const { rerender } = render(<AuthContext.Provider value={{ status: 'authenticated', userId: true }}><HomeScreen /></AuthContext.Provider>)
        fireEvent.click(screen.getByTestId('buttonhandleLogOut'))
    }); */
});

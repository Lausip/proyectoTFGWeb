/** @jest-environment jsdom */
import React from "react";
import { getFirestore, Timestamp, getDoc, doc, deleteDoc, arrayUnion, arrayRemove, getDocs, collection, orderBy, addDoc, updateDoc, where } from "firebase/firestore"
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { render, fireEvent,screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthScreen } from "../screens/AuthScreen";
import { AuthContext } from "../context/AuthContext";
import { getFotoPerfil, getTodosReportes, eliminarReporte, eliminarLibro, bloquearPersona, eliminarComentario, enviarAvisoLibro, getFavReportes, addFavReporte, removeFavReporte, getFavReportesEmail, getEmailComentarioTexto } from '../firebase/Auth/Firestore';
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
    getTodosReportes: jest.fn()
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
     it('Should check userId false ', async () => {
        getAuth.mockReturnValue({
            currentUser: {
                email: "email"
            },
        });
        getDoc.mockReturnValue({
            data: () => ({
                name: 'name-for-this-data-item',
            }),
        })

        getTodosReportes.mockReturnValue([
            {
                Motivo: "Odio"
            },
        ]);
       render(
            <Router>
                <Switch>
                    <AuthContext.Provider value={{ status: 'authenticated', userId: false }}>
                        <AuthScreen />
                    </AuthContext.Provider>
                </Switch>
            </Router>
        )


    });

    it('Should check status authenticated', async () => {
        getAuth.mockReturnValue({
            currentUser: {
                email: "email"
            },
        });
        getDoc.mockReturnValue({
            data: () => ({
                name: 'name-for-this-data-item',
            }),
        })

        getTodosReportes.mockReturnValue([
            {
                Motivo: "Odio"
            },
        ]);
       render(
            <Router>
                <Switch>
                    <AuthContext.Provider value={{ status: 'authenticated', userId: true }}>
                        <AuthScreen />
                    </AuthContext.Provider>
                </Switch>
            </Router>
        )


    });
    it('Should check status checking', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        render(
            <Router>
                <Switch>
                    <AuthContext.Provider value={{ status: 'checking', userId: true }}>
                        <AuthScreen />
                    </AuthContext.Provider>
                </Switch>
            </Router>
        )

    });


});

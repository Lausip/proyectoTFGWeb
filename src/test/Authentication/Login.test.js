/** @jest-environment jsdom */
import React from "react";
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";
import { handleRolAdmin } from '../../firebase/Auth/Auth'

import { LogInScreen } from "../../screens/Authentication/LoginScreen";


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

jest.mock('../../firebase/Auth/Auth', () => ({
    ...(jest.requireActual('../../firebase/Auth/Auth')),
    handleRolAdmin: jest.fn()
}))

jest.mock('firebase/auth', () => {
    return { getAuth: jest.fn() }
})


describe('LoginScreen test', () => {
    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });

    it('Should render LoginScreen and handleSesion no usuario', async () => {

        handleRolAdmin.mockReturnValue("nousuario");
        const { rerender } = render(<LogInScreen />)
        fireEvent.change(screen.getByTestId('buttonsetEmail'), {
            target: { value: "Changed Value" }
        })
        fireEvent.change(screen.getByTestId('buttonsetPassword'), {
            target: { value: "Changed Value" }
        })
        fireEvent.click(screen.getByTestId('buttonhandleIncioSesion'))
    });

    it('Should render LoginScreen and handleSesion with no admin', async () => {

        handleRolAdmin.mockReturnValue("noadmin");
        const { rerender } = render(<LogInScreen />)
        fireEvent.change(screen.getByTestId('buttonsetEmail'), {
            target: { value: "Changed Value" }
        })
        fireEvent.change(screen.getByTestId('buttonsetPassword'), {
            target: { value: "Changed Value" }
        })
        fireEvent.click(screen.getByTestId('buttonhandleIncioSesion'))
    });
});

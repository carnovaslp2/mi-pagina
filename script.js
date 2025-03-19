import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth-compat.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDVbin1MlXIHp9ge86VH-LcNrAX9RWv0sY",
    authDomain: "diego-f767b.firebaseapp.com",
    projectId: "diego-f767b",
    storageBucket: "diego-f767b.firebasestorage.app",
    messagingSenderId: "117334789385",
    appId: "1:117334789385:web:1137791b171a44cdfbd7d8",
    measurementId: "G-H3392HQ74Q"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const registerSection = document.getElementById('register-section');
const loginSection = document.getElementById('login-section');
const gameSection = document.getElementById('game-section');
const showLoginButton = document.getElementById('show-login-button');
const usernameInput = document.getElementById('username');
const registerButton = document.getElementById('register-button');
const registerEmailInput = document.getElementById('email');
const registerPasswordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const accessCodeInput = document.getElementById('login-access-code');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const logoutButton = document.getElementById('logout-button');

console.log(showLoginButton, registerButton, loginButton, logoutButton); // Verifica los elementos

showLoginButton.addEventListener('click', () => {
    console.log('Botón "Ya tengo un código" clicado');
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
});

registerButton.addEventListener('click', async () => {
    console.log('Botón de registro clicado');
    const username = usernameInput.value.trim();
    const accessCode = document.getElementById('access-code').value.trim();
    const email = registerEmailInput.value.trim();
    const password = registerPasswordInput.value.trim();

    if (username === '' || email === '' || password === '') {
        alert('Por favor, ingresa un nombre de usuario, correo electrónico y contraseña.');
        return;
    }

    if (!/^\d{4,10}$/.test(accessCode)) {
        alert('Por favor, ingresa un código de acceso válido (4-10 dígitos).');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            username: username,
            code: accessCode,
            score: 0
        });

        alert(`Registro exitoso. Tu código de acceso es: ${accessCode}`);
        hideRegisterSection();
        displayWelcomeMessage(username);
    } catch (error) {
        alert('Error al registrar el usuario: ' + error.message);
        console.error(error);
    }
});

loginButton.addEventListener('click', async () => {
    console.log('Botón de acceso clicado');
    const accessCode = document.getElementById('login-access-code').value.trim();
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();

    if (email === '' || password === '') {
        alert('Por favor, ingresa correo electrónico y contraseña.');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.code === accessCode) {
                alert('Acceso exitoso.');
                hideLoginSection();
                displayWelcomeMessage(userData.username);
            } else {
                alert('Código de acceso incorrecto.');
            }
        } else {
            alert('Error al obtener los datos del usuario.');
        }

    } catch (error) {
        alert('Error al acceder: ' + error.message);
        console.error(error);
    }
});

logoutButton.addEventListener('click', async () => {
    console.log('Botón de cerrar sesión clicado');
    try {
        await signOut(auth);
        gameSection.style.display = 'none';
        loginSection.style.display = 'block';
        registerSection.style.display = 'block';
        const welcomeMessage = gameSection.querySelector('h2');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        alert('Sesión cerrada correctamente.');
    } catch (error) {
        alert('Error al cerrar sesión: ' + error.message);
        console.error(error);
    }
});
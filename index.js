import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth,
         GoogleAuthProvider,
         signInWithPopup,
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCujUc9CV_2n6gmhxQ0Waz4tTxk1l-FkZE",
    authDomain: "musicas-3dcc7.firebaseapp.com",
    projectId: "musicas-3dcc7",
    storageBucket: "musicas-3dcc7.appspot.com",
    messagingSenderId: "22639946068",
    appId: "1:22639946068:web:914e8f134fb30058d380c1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

// cadastro com email e senha
document.querySelector("#cadastrar").addEventListener("click", (e)=>{
    e.preventDefault()

    const email = document.querySelector("#emailCad").value
    const senha = document.querySelector("#senhaCad").value

    createUserWithEmailAndPassword(auth, email, senha)
    .then((result)=>{
        window.location.href = "/logged.html"
    }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
    })
})

// login com email e senha
document.querySelector("#login").addEventListener("click", (e)=>{
    e.preventDefault()

    const email = document.querySelector("#emailLogin").value
    const senha = document.querySelector("#senhaLogin").value

    signInWithEmailAndPassword(auth, email, senha)
    .then(async (result)=>{
        console.log(result.user)
        window.location.href = "/logged.html"
    }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
    })
})

// login com google
document.querySelector("#googleLog").addEventListener("click", (e)=>{
    e.preventDefault()

    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
    .then((result) => {
        window.location.href = "/logged.html"
    }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
    })
})

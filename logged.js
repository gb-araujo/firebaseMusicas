import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore,
         collection,
         getDocs,
         where,
         query,
         addDoc,
         deleteDoc,
         doc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
const db = getFirestore(app)

// deslogar da conta
document.querySelector("#deslogar").addEventListener("click", (e)=>{
    signOut(auth)
})

// verifica se existe um usuario logado e puxa do banco de dados as informações do usuario
onAuthStateChanged(auth, async (user)=>{
    if(user){
        const snapshot = query(collection(db, "musicas"), where("uidUsuario", "==", user.uid))
        const musicas = await getDocs(snapshot)
        musicas.forEach((doc) => {
            const tabela = `
              <tr>
                <td>${doc.data().nomeAlbum}</td>
                <td>${doc.data().estrelas}</td>
                <td>${doc.data().nomeArtista}</td>
                <td><button id="excluir" class="${doc.data().nomeAlbum}">excluir</button></td>
              </tr>`
            document.querySelector("#tabela").innerHTML += tabela;
        })
        
        document.querySelector("#nome").innerHTML = user.displayName
        document.querySelector("#email").innerHTML = user.email
        if(!user.photoURL){
            document.querySelector("#foto").src = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
        }else {
            document.querySelector("#foto").src = user.photoURL
        }

    }else {
        window.location.href = "/index.html"
    }
})

// pega as informações e adiciona uma nova musica para o usuario
document.querySelector("#adicionar").addEventListener("click", async (e)=>{
    const nomeArtista = window.prompt("para adicionar sua musica primeiro digite o nome do artista")
    const nomeAlbum = window.prompt("agora digite o nome do album que quer avaliar")
    const estrelas = parseFloat(window.prompt("agora digite somente com números quantas estrelas você dá pro album (1 - 5)"))
    const uid = auth.currentUser.uid

    if(isNaN(estrelas) || estrelas < 1 || estrelas > 5 || !nomeAlbum || !nomeArtista){    
        return window.alert("alguma informação faltando ou errada")
    }
    
    const snapshot = query(collection(db, "musicas"), where("uidUsuario", "==", uid), where("nomeAlbum", "==", nomeAlbum))
    const musicas = await getDocs(snapshot)
    if(musicas.docs.length > 0){
        return window.alert("nome do album ja cadastrado no seu perfil")
    }

    const musicaNova = {
        nomeAlbum: nomeAlbum,
        nomeArtista: nomeArtista,
        estrelas: estrelas,
        uidUsuario: uid
    }

    try {
        await addDoc(collection(db, "musicas"), musicaNova)
    } catch (error) {
        console.error("erro:", error)
    }
    window.location.href = "/logged.html"
})

// verifica se o que foi clicado tem o id excluir e exclui a musica do banco de dados
document.addEventListener("click", async (e)=>{
    const target = e.target
    const uid = auth.currentUser.uid

    if(target.id == "excluir"){
        const nomeAlbum = target.classList.value
        const snapshot = query(collection(db, "musicas"), where("uidUsuario", "==", uid), where("nomeAlbum", "==", nomeAlbum))
        const musicas = await getDocs(snapshot)
        const id = musicas.docs[0].id
        await deleteDoc(doc(db, "musicas", id))
        .then(()=>{
            window.location.href = "/logged.html"
        })
    }
})

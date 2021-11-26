function creerTableau(nbligne, nbcolonne) {
    let body = document.querySelector("body");
    let table = document.createElement("table");
    table.id = "grille";
    body.appendChild(table);
    for (let i = 0; i < nbligne; i++) {
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for (let j = 0; j < nbcolonne; j++) {
            let td = document.createElement("td");
            tr.appendChild(td);
            if (Math.random() < 0.2) {
                td.className = "mur";
                td.innerHTML = "<span class='sr-only'>mur</span>";
            } else if (Math.random() < 0.1) {
                td.className = "bonus";
                td.innerHTML = "<span class='sr-only'>bonus</span>";
            }
        }
    }
}

//le body
let body = document.querySelector("body");

//synthese vocale
let synth = window.speechSynthesis;

//lecteur audio
let audio = document.createElement("audio");
//audio.controls=true;
body.appendChild(audio);

//dimension de la grille
const NBLIGNE = 15;
const NBCOLONNE = 15;
creerTableau(NBLIGNE, NBCOLONNE);
let grille = document.getElementById("grille");

//initialisation du personnage
let perso = document.createElement("img");
perso.id = "perso";
perso.src = "perso.png";

//initialisation du loup
let loup = document.createElement("img");
loup.id = "loup";
loup.src = "loup.png";
loup.style.display = "none";

//attributs personnalisés
perso.dataset.colonne = 0;
perso.dataset.ligne = 0;
grille.rows[perso.dataset.ligne].cells[perso.dataset.colonne].className = "";
grille.rows[perso.dataset.ligne].cells[perso.dataset.colonne].innerHTML = "";
grille.rows[perso.dataset.ligne].cells[perso.dataset.colonne].appendChild(perso);

loup.dataset.colonne = Math.floor((NBCOLONNE - 1) * Math.random());
loup.dataset.ligne = Math.floor((NBLIGNE - 1) * Math.random());
grille.rows[loup.dataset.ligne].cells[loup.dataset.colonne].className = "";
grille.rows[loup.dataset.ligne].cells[loup.dataset.colonne].innerHTML = "";
grille.rows[loup.dataset.ligne].cells[loup.dataset.colonne].appendChild(loup);

//gestionnaire de clavier
document.addEventListener("keydown", clavier, true);

function clavier(event) {
    //Nouvelle coordonnées du personnage
    console.log(event);
    let x = parseInt(perso.dataset.colonne);
    let y = parseInt(perso.dataset.ligne);

    if (event.key == "ArrowLeft") {
        if (x > 0)
            x--;
    } else if (event.key == "ArrowRight") {
        if (x < NBCOLONNE - 1)
            x++;
    } else if (event.key == "ArrowUp") {
        if (y > 0)
            y--;
    } else if (event.key == "ArrowDown") {
        if (y < NBLIGNE - 1)
            y++;
    } else if (event.key == "q" && event.ctrlKey) {
        if (vocale.checked) {
            let utterThis = new SpeechSynthesisUtterance(perso.alt);
            utterThis.rate = 3;
            synth.speak(utterThis);
        }
    } else if (event.key == "5" && event.ctrlKey) {
        if (vocale.checked) {
            let utterThis = new SpeechSynthesisUtterance(distance());
            utterThis.rate = 3;
            synth.speak(utterThis);
        }
    }
    //affichage
    // si la cellule destination n'est pas un mur
    if (!isWall(grille.rows[y].cells[x])) {
        //déplacement de perso
        grille.rows[perso.dataset.ligne].cells[perso.dataset.colonne].innerHTML = "";
        perso.dataset.ligne = y;
        perso.dataset.colonne = x;
        grille.rows[perso.dataset.ligne].cells[perso.dataset.colonne].appendChild(perso);
        perso.alt = y + ", " + x;
        //si la cellule est un bonus
        if (isBonus(grille.rows[y].cells[x])) {
            if (effets.checked) {
                audio.src = "bonus.mp3";
                audio.play();
            }
        }
    } else {
        //si la cellule destination est un mur
        if (effets.checked) {
            audio.src = "mur.mp3";
            audio.play();
        }
    }
}

function isWall(obj) {
    return (obj.className == "mur");
}

function isBonus(obj) {
    return (obj.className == "bonus");
}

function toggleLoup() {
    if (visuloup.checked)
        loup.style.display = "inline";
    else
        loup.style.display = "none";
}

function distance() {
    let ligneresulta = loup.dataset.ligne - perso.dataset.ligne;
    let colonneresulta = loup.dataset.colonne - perso.dataset.colonne;
    if (ligneresulta < 0)
        ligneresulta = "haut";
    else if (ligneresulta > 0)
        ligneresulta = "bas";
    else
        ligneresulta = "même ligne";

    if (colonneresulta < 0)
        colonneresulta = "gauche";
    else if (colonneresulta > 0)
        colonneresulta = "droite";
    else
        colonneresulta = "même colonne";

    let resultat = ligneresulta + " " + colonneresulta;
    return resultat;
} 

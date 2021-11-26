//le body
let body = document.querySelector("body");

//synthese vocale
let synth = window.speechSynthesis;

//lecteur audio
audio = document.createElement("audio");

//dimension de la grille
const NBLIGNE = 16;
const NBCOLONNE = 16;

//déclaration des variables globales
let perso;
let level=level1;
let unité=1;

grille = document.getElementById("grille");

initialisation();
chargerNiveau(level);

/**
 * Génération d'une table HTML de nbligne et nbcolone
 * @param {int} nbligne 
 * @param {int} nbcolonne 
 */
function creerTableau(nbligne, nbcolonne) {
    let table = document.createElement("table");
    table.id = "grille";
    body.appendChild(table);
    grille = document.getElementById("grille");

    for (let i = 0; i < nbligne; i++) {
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for (let j = 0; j < nbcolonne; j++) {
            let td = document.createElement("td");
            tr.appendChild(td);
            td.className = "";
        }
    }
}

function chargerNiveau(level) {
    grille.innerHTML = "";
    for (let i = 0; i < level.length; i++) {
        let tr = document.createElement("tr");
        grille.appendChild(tr);
        for (let j = 0; j < level[i].length; j++) {
            let td = document.createElement("td");
            tr.appendChild(td);
            if (level[i][j] == 2) {
                td.className = "fleuve";
                td.innerHTML = "<span class='sr-only'>fleuve</span>";
            } else if (level[i][j] == 1) {
                td.className = "arbre";
                td.innerHTML = "<span class='sr-only'>arbre</span>";
            }
        }
    }

    //attributs personnalisés
    perso.dataset.colonne = 0;
    perso.dataset.ligne = 7;
    grille.rows[perso.dataset.ligne].cells[perso.dataset.colonne].className = "";
    grille.rows[perso.dataset.ligne].cells[perso.dataset.colonne].innerHTML = "";
    grille.rows[perso.dataset.ligne].cells[perso.dataset.colonne].appendChild(perso);

}

/**
 * initialisation de la grilles et des variables objets du DOM
 */
function initialisation() {
    //audio.controls=true;
    body.appendChild(audio);
    //initialisation du personnage
    perso = document.createElement("img");
    perso.id = "perso";
    perso.src = "perso.png";

    //gestionnaire des événements clavier
    document.addEventListener("keydown", clavier, true);
}

/**
 * gestion des événement clavier de type keydown
 * @param {event} event obj evenement clavier
 */
function clavier(event) {
    //x,y : Nouvelle coordonnées de destination du personnage
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
        //si CTRL+q alors vocalise la position de perso
        if (vocale.checked) {
            let xp = parseInt(perso.dataset.colonne);
            let yp = parseInt(perso.dataset.ligne);
            let chaine = "ligne " + yp + " colone " + xp;
            let utterThis = new SpeechSynthesisUtterance(chaine);
            utterThis.rate = 2;
            synth.speak(utterThis);
        }
    }

    //affichage
    // si la cellule destination n'est pas un arbre alors déplacement de perso en x,y
    //si perso en ligne 7 et colone 15 charger level2
    if ((parseInt(perso.dataset.colonne)) == 15 && (parseInt(perso.dataset.ligne)) == 7) {
        chargerNiveau(level+unité);
    }
    else if (isWall(grille.rows[y].cells[x])) {
    //si la cellule destination est un arbre alors effet sonore        
    if (effets.checked) {
    audio.src = "arbre.mp3";
    audio.play();
    }
    }
    //si la cellule destination est de type fleuve alors effet sonore
    else if (isFleuve(grille.rows[y].cells[x])) {
        deplacerObjet(perso, x, y);
        if (effets.checked) {
            audio.src = "fleuve.wav";
            audio.play();
        }
    } else {        
    deplacerObjet(perso, x, y);
if (effets.checked) {
    audio.src = "pas.mp3";
    audio.play();
    }
    }
}


/**
 * vrai si td est un mur
 * @param {td} obj 
 */
function isWall(obj) {
    return (obj.className == "arbre");
}

/**
 * retourne vrai si td est de type fleuve
 * @param {td} obj 
 */
function isFleuve(obj) {
    return (obj.className == "fleuve");
}

/**
 * retourne vrai si le td de coordonnée x,y est un arbre
 * @param {int} x 
 * @param {int} y 
 */
function isXYwall(x, y) {
    return isWall(grille.rows[y].cells[x]);
}

/**
 * retourne vrai si perso est en x,y
 * @param {int} x 
 * @param {int} y 
 */
function isXYperso(x, y) {
    return (perso.dataset.colonne == x && perso.dataset.ligne == y);
}

/**
 * Déplace un objet en x,y
 * @param {objet de type img} obj avec attributs personnalisé dataset.ligne et dataset.colonne
 * @param {int} x nouvelles coordonnées
 * @param {int} y 
 */
function deplacerObjet(obj, x, y) {
    //effacemment du perso de sa position actuelle
    grille.rows[obj.dataset.ligne].cells[obj.dataset.colonne].innerHTML = "";

    //mise à jour de ses coordonnées
    obj.dataset.ligne = y;
    obj.dataset.colonne = x;
    //affichage à sa nouvelle position
    grille.rows[obj.dataset.ligne].cells[obj.dataset.colonne].appendChild(obj);
    obj.alt = obj.dataset.ligne + ", " + obj.dataset.colonne;
}


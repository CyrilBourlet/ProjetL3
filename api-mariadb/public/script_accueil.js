// Tableau qui va contenir les données des tournois récupérés depuis le serveur
let tournoisData = [];

/**
 * Fonction pour charger tous les tournois depuis l'API.
 * Elle utilise fetch pour faire une requête GET à l'endpoint /api/tournois.
 * Si tout se passe bien, on stocke les données dans tournoisData et on les affiche.
 */
async function chargerTournois() {
    try {
        const response = await fetch('http://localhost:3000/api/tournois'); // Requête vers l'API backend
        const data = await response.json(); // On récupère les données en JSON
        tournoisData = data; // On stocke les données pour pouvoir les trier plus tard
        afficherTournois(data); // On affiche les tournois dans le tableau HTML
    } catch (error) {
        console.error("Erreur de chargement :", error); // En cas d'erreur, on affiche le message dans la console
    }
}

/**
 * Fonction pour afficher la liste des tournois dans le tableau HTML.
 * Elle prend en paramètre un tableau de tournois et les insère ligne par ligne dans le tableau HTML.
 */
function afficherTournois(tournois) {
    const tableBody = document.getElementById("tournoi-list"); // Sélection du corps de tableau
    tableBody.innerHTML = ""; // On vide le tableau avant de le remplir à nouveau

    tournois.forEach(tournoi => {
        const row = document.createElement("tr"); // Création d'une nouvelle ligne dans le tableau
        
        // Remplissage de la ligne avec les données du tournoi
        row.innerHTML = `
            <td>${tournoi.id_tournoi}</td>
            <td>${tournoi.nom_tournoi}</td>
            <td>${tournoi.datedebut_tournoi}</td>
            <td>${tournoi.datefin_tournoi}</td>
            <td>${tournoi.lieu_tournoi}</td>
            <td>
                <a href="Inscrits.html?id=${tournoi.id_tournoi}" class="link">Voir les inscrits</a>
            </td>
        `;

        // Si on clique sur une ligne, on est redirigé vers le formulaire d'inscription à ce tournoi
        row.addEventListener("click", () => {
            window.location.href = `Formulaire.html?id=${tournoi.id_tournoi}`;
        });

        tableBody.appendChild(row); // Ajout de la ligne dans le tableau HTML
    });
}

/**
 * Fonction pour trier les tournois en fonction du critère choisi (ID, nom, lieu ou date).
 * Elle trie une copie de tournoisData, puis appelle afficherTournois pour afficher le résultat.
 */
function trierTournois() {
    const sortBy = document.getElementById("sort-by").value; // On récupère la valeur sélectionnée dans le menu déroulant

    // On copie les données originales pour ne pas les modifier directement
    const sortedTournois = [...tournoisData].sort((a, b) => {
        if (sortBy === "id") {
            return a.id_tournoi - b.id_tournoi; // Tri numérique sur l'ID
        }
        if (sortBy === "name") {
            return a.nom_tournoi.localeCompare(b.nom_tournoi); // Tri alphabétique sur le nom
        }
        if (sortBy === "location") {
            return a.lieu_tournoi.localeCompare(b.lieu_tournoi); // Tri alphabétique sur le lieu
        }
        if (sortBy === "date") {
            return new Date(a.datedebut_tournoi) - new Date(b.datedebut_tournoi); // Tri sur la date de début
        }
    });

    afficherTournois(sortedTournois); // On affiche les tournois triés
}

/**
 * Fonction pour activer ou désactiver le bouton "Ajouter un tournoi" selon le rôle de l'utilisateur.
 * Si l'utilisateur est organisateur, on active le bouton.
 */
function gererBoutonCreation() {
    const estOrganisateur = localStorage.getItem("est_organisateur"); // On récupère l'info du stockage local
    const boutonCreation = document.getElementById("btn-creation"); // Le bouton "Ajouter un tournoi"

    // Si l'utilisateur est organisateur (valeur "true" sous forme de string), le bouton est activé
    if (estOrganisateur === "true") {
        boutonCreation.disabled = false;
    } else {
        boutonCreation.disabled = true;
    }
}

/**
 * Fonction pour afficher le nom et prénom de l'utilisateur connecté dans l'en-tête de la page.
 * Elle gère aussi l'affichage des boutons connexion/déconnexion.
 */
function afficherUtilisateur() {
    const nom = localStorage.getItem("nom");
    const prenom = localStorage.getItem("prenom");

    if (nom && prenom) {
        // Si on a un nom et prénom dans le stockage, on affiche le nom complet
        document.getElementById("user-name").textContent = `${prenom} ${nom}`;

        // On masque le bouton connexion et on montre le bouton déconnexion
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("logout-btn").style.display = "inline-block";
    } else {
        // Si aucun utilisateur n'est connecté
        document.getElementById("login-btn").style.display = "inline-block";
        document.getElementById("logout-btn").style.display = "none";
    }
}

/**
 * Fonction pour déconnecter l'utilisateur.
 * Elle vide le localStorage et recharge la page pour revenir à l'état non connecté.
 */
function logout() {
    localStorage.clear(); // On efface toutes les infos stockées
    window.location.reload(); // On recharge la page pour mettre à jour l'affichage
}

/**
 * Fonction principale exécutée au chargement de la page.
 * Elle initialise l'affichage utilisateur, le bouton création et les données des tournois.
 */
window.onload = function() {
    afficherUtilisateur(); // Affiche le nom de l'utilisateur s'il est connecté
    gererBoutonCreation(); // Active/désactive le bouton "Ajouter un tournoi"
    chargerTournois(); // Charge et affiche la liste des tournois

    // Ajout des événements aux boutons
    document.getElementById("logout-btn").addEventListener("click", logout); // Bouton déconnexion
    document.getElementById("btn-tri").addEventListener("click", trierTournois); // Bouton tri
};

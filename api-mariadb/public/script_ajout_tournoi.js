// Tableau qui contient toutes les séries récupérées depuis l'API
let seriesDisponibles = [];

// Tableau qui contient les séries que l'utilisateur a déjà sélectionnées pour le tournoi
let seriesSelectionnees = [];

/**
 * Fonction pour charger les séries disponibles depuis l'API
 * Cette fonction est appelée automatiquement au chargement de la page
 */
async function chargerSeries() {
    try {
        const response = await fetch('http://localhost:3000/api/series'); // Appel à l'API backend
        const data = await response.json(); // Récupération des données en JSON

        // Si aucune série n'est disponible, on ne fait rien
        if (!Array.isArray(data) || data.length === 0) {
            return;
        }

        // Stockage des séries disponibles
        seriesDisponibles = data;

        // Mise à jour du menu déroulant avec les séries récupérées
        mettreAJourSelection();
    } catch (error) {
        console.error("Erreur lors du chargement des séries :", error);
    }
}

/**
 * Fonction pour mettre à jour le menu déroulant contenant les séries disponibles
 * Cette fonction affiche uniquement les séries qui ne sont pas encore sélectionnées
 */
function mettreAJourSelection() {
    const select = document.getElementById("serie-selection"); // On cible le menu déroulant

    select.innerHTML = ""; // On vide toutes les options existantes

    // Ajout de l'option par défaut
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.innerText = "Sélectionner une série";
    select.appendChild(defaultOption);

    // Ajout des séries disponibles qui ne sont pas encore sélectionnées
    seriesDisponibles.forEach(serie => {
        // On vérifie que la série n'est pas dans la liste des séries déjà sélectionnées
        if (!seriesSelectionnees.includes(serie.id_serie)) {
            const option = document.createElement("option");
            option.value = serie.id_serie; // L'ID sera envoyé en cas de sélection
            option.innerText = serie.nom_serie; // Le texte affiché est le nom de la série
            select.appendChild(option);
        }
    });

    // On s'assure qu'aucune option n'est sélectionnée par défaut après la mise à jour
    select.value = "";
}

/**
 * Fonction déclenchée lorsqu'on clique sur le bouton "Ajouter Série"
 * Elle ajoute la série sélectionnée dans la liste des séries sélectionnées
 */
document.getElementById("ajout-serie").addEventListener("click", function() {
    const select = document.getElementById("serie-selection"); // Le menu déroulant
    const id_serie = select.value; // L'ID de la série choisie
    const nom_serie = select.options[select.selectedIndex]?.text; // Le nom de la série

    // Si aucune série sélectionnée ou si elle est déjà ajoutée, on ne fait rien
    if (!id_serie || seriesSelectionnees.includes(id_serie)) return;

    // On crée un nouvel élément dans la liste des séries sélectionnées
    const listeSeries = document.getElementById("series-list");
    const listItem = document.createElement("li");
    listItem.innerHTML = `${nom_serie} <button class="remove-btn" data-id="${id_serie}">X</button>`; // Ajoute le bouton pour supprimer
    listeSeries.appendChild(listItem); // Ajoute l'élément à la liste HTML

    // On ajoute l'ID de la série dans le tableau des séries sélectionnées
    seriesSelectionnees.push(id_serie);

    // Mise à jour du menu déroulant pour enlever la série qui vient d'être ajoutée
    mettreAJourSelection();
});

/**
 * Fonction déclenchée lorsqu'on clique sur le bouton "X" pour supprimer une série
 * Elle retire la série de la liste et réaffiche l'option dans le menu déroulant
 */
document.getElementById("series-list").addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-btn")) {
        const id_serie = event.target.dataset.id; // Récupère l'ID de la série à supprimer

        // On enlève l'ID de la liste des séries sélectionnées
        seriesSelectionnees = seriesSelectionnees.filter(id => id !== id_serie);

        // On enlève l'élément HTML de la liste affichée
        event.target.parentElement.remove();

        // Mise à jour du menu déroulant pour rendre la série à nouveau disponible
        mettreAJourSelection();
    }
});

/**
 * Fonction déclenchée lorsqu'on soumet le formulaire de création de tournoi
 * Elle envoie les données du tournoi et des séries sélectionnées au backend via une requête POST
 */
document.getElementById("tournoi-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // On empêche l'envoi classique du formulaire

    // Récupération des données saisies dans le formulaire
    const nom = document.getElementById("nom").value;
    const dateDebut = document.getElementById("date-debut").value;
    const dateFin = document.getElementById("date-fin").value;
    const lieu = document.getElementById("lieu").value;

    // Vérifie qu'au moins une série est sélectionnée avant d'envoyer
    if (seriesSelectionnees.length === 0) {
        alert("Veuillez sélectionner au moins une série.");
        return;
    }

    // Prépare les données à envoyer au backend
    const tournoiData = {
        nom,
        dateDebut,
        dateFin,
        lieu,
        series: seriesSelectionnees
    };

    try {
        // Envoi des données au backend via une requête POST
        const response = await fetch('http://localhost:3000/api/tournois', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tournoiData)
        });

        const result = await response.json(); // Récupère la réponse du backend

        if (response.ok) {
            alert("Tournoi créé avec succès !");
            window.location.href = "Accueil.html"; // Redirection vers la page d'accueil
        } else {
            alert("Erreur : " + result.error);
        }
    } catch (error) {
        console.error("Erreur lors de la création du tournoi :", error);
    }
});

// Dès que la page est chargée, on appelle la fonction pour récupérer les séries
window.onload = chargerSeries;

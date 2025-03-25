// Tableau contenant les inscrits du tournoi, utilisé pour les filtres
let inscritsData = [];

// Fonction pour charger les inscrits d'un tournoi à partir de l'API
async function chargerInscrits() {
    // Récupère l'ID du tournoi depuis l'URL (exemple : Inscrits.html?id=1)
    const params = new URLSearchParams(window.location.search);
    const idTournoi = params.get("id");

    // Si aucun ID de tournoi, affiche un message d'erreur dans le tableau
    if (!idTournoi) {
        document.getElementById("inscrits-list").innerHTML = "<tr><td colspan='6'>Aucun tournoi sélectionné.</td></tr>";
        return;
    }

    try {
        // Requête vers l'API pour récupérer les inscrits du tournoi
        const response = await fetch(`http://localhost:3000/api/inscrits/${idTournoi}`);
        const data = await response.json();

        // Vérifie si la réponse est un tableau (format attendu)
        if (!Array.isArray(data)) {
            document.getElementById("inscrits-list").innerHTML = "<tr><td colspan='6'>Erreur : réponse inattendue.</td></tr>";
            return;
        }

        // Stocke les inscrits dans la variable globale pour permettre le filtrage
        inscritsData = data;

        // Affiche les inscrits dans le tableau
        afficherInscrits(inscritsData);

        // Charge les séries disponibles pour les filtres
        chargerSeries(idTournoi);

    } catch (error) {
        // Affiche un message en cas d'erreur de chargement
        document.getElementById("inscrits-list").innerHTML = "<tr><td colspan='6'>Erreur de chargement</td></tr>";
    }
}

// Fonction pour afficher une liste d'inscrits dans le tableau HTML
function afficherInscrits(inscrits) {
    const tableBody = document.getElementById("inscrits-list");

    // Vide le tableau avant d'afficher les nouveaux résultats
    tableBody.innerHTML = "";

    // Si aucun inscrit, affiche un message spécifique
    if (inscrits.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6'>Aucun joueur trouvé</td></tr>";
        return;
    }

    // Crée une ligne dans le tableau pour chaque inscrit
    inscrits.forEach(inscrit => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${inscrit.licence_joueur}</td>
            <td>${inscrit.nom_joueur}</td>
            <td>${inscrit.prenom_joueur}</td>
            <td>${inscrit.club_joueur}</td>
            <td>${inscrit.point_joueur}</td>
            <td>${inscrit.series.length > 0 ? inscrit.series.join(", ") : "Aucune série"}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fonction pour charger les séries disponibles dans le menu de filtres
async function chargerSeries(idTournoi) {
    try {
        // Requête vers l'API pour récupérer les séries associées au tournoi
        const response = await fetch(`http://localhost:3000/api/series/${idTournoi}`);
        const data = await response.json();

        const serieFilter = document.getElementById("serie-filter");

        // Réinitialise le menu déroulant
        serieFilter.innerHTML = `<option value="">Toutes les séries</option>`;

        // Remplit la liste des options avec les séries récupérées
        data.forEach(serie => {
            const option = document.createElement("option");
            option.value = serie.nom_serie; // Utilisé pour filtrer
            option.textContent = serie.nom_serie; // Texte visible dans la liste
            serieFilter.appendChild(option);
        });

    } catch (error) {
        console.error("Erreur lors du chargement des séries :", error);
    }
}

// Fonction pour appliquer les filtres aux inscrits
function filtrerInscrits() {
    // Récupère les valeurs saisies par l'utilisateur dans les filtres
    const searchName = document.getElementById("search-name").value.toLowerCase().trim();
    const selectedSerie = document.getElementById("serie-filter").value.trim();
    const minPoints = document.getElementById("point-filter").value.trim();

    // Filtre les inscrits selon les critères sélectionnés
    const inscritsFiltres = inscritsData.filter(inscrit => {
        // Filtre sur le nom (si renseigné)
        const nomMatch = searchName === "" || inscrit.nom_joueur.toLowerCase().includes(searchName);

        // Filtre sur la série (si sélectionnée)
        const serieMatch = selectedSerie === "" || inscrit.series.includes(selectedSerie);

        // Filtre sur le nombre minimum de points (si renseigné)
        const pointsMatch = minPoints === "" || inscrit.point_joueur >= parseInt(minPoints);

        // Retourne vrai si toutes les conditions sont remplies
        return nomMatch && serieMatch && pointsMatch;
    });

    // Affiche le résultat du filtre dans le tableau
    afficherInscrits(inscritsFiltres);
}

// Affiche ou masque la section des filtres lorsque l'utilisateur clique sur le bouton
document.getElementById("toggle-filters").addEventListener("click", function () {
    const filtersContainer = document.getElementById("filters-container");
    filtersContainer.classList.toggle("hidden"); // Alterne entre visible/invisible
});

// Fonction appelée lorsque la page est chargée
window.onload = chargerInscrits; // Charge les inscrits du tournoi au démarrage

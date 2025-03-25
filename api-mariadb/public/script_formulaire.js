// Récupère l'ID du tournoi depuis l'URL de la page (exemple : ?id=1)
function getIdTournoiFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // Retourne l'ID du tournoi
}

// Remplit automatiquement les champs du formulaire avec les informations du joueur connecté
function remplirFormulaire() {
    document.getElementById("licence").value = localStorage.getItem("licence_joueur") || "";
    document.getElementById("nom").value = localStorage.getItem("nom") || "";
    document.getElementById("prenom").value = localStorage.getItem("prenom") || "";
    document.getElementById("club").value = localStorage.getItem("club_joueur") || "Non renseigné";
    document.getElementById("nbpoint").value = localStorage.getItem("point_joueur") || "0";
    document.getElementById("telephone").value = localStorage.getItem("telephone") || "Non renseigné";
    document.getElementById("email").value = localStorage.getItem("email") || "Non renseigné";
}

// Charge les séries disponibles pour le tournoi sélectionné
async function chargerSeries() {
    const idTournoi = getIdTournoiFromURL(); // Récupère l'ID du tournoi depuis l'URL

    // Vérifie si aucun tournoi n'est sélectionné
    if (!idTournoi) {
        document.getElementById("series-list").innerHTML = "<li>Aucun tournoi sélectionné.</li>";
        return;
    }

    try {
        // Requête vers l'API pour récupérer les séries du tournoi
        const response = await fetch(`http://localhost:3000/api/series/${idTournoi}`);
        const data = await response.json();

        const seriesList = document.getElementById("series-list");
        seriesList.innerHTML = ""; // Vide la liste actuelle avant d'afficher les nouvelles séries

        // Si aucune série disponible
        if (!Array.isArray(data) || data.length === 0) {
            seriesList.innerHTML = "<li>Aucune série disponible pour ce tournoi.</li>";
            return;
        }

        // Affiche chaque série sous forme de case à cocher
        data.forEach(serie => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <input type="checkbox" name="series[]" value="${serie.id_serie}"> ${serie.nom_serie}
            `;
            seriesList.appendChild(listItem);
        });
    } catch (error) {
        // Affiche un message d'erreur en cas d'échec de la requête
        document.getElementById("series-list").innerHTML = "<li>Erreur de chargement.</li>";
    }
}

// Gère l'envoi du formulaire d'inscription à un tournoi
document.getElementById("form-inscription").addEventListener("submit", async function(event) {
    event.preventDefault(); // Empêche le rechargement de la page lors de la soumission

    const idTournoi = getIdTournoiFromURL(); // ID du tournoi depuis l'URL
    const licenceJoueur = localStorage.getItem("licence_joueur"); // Numéro de licence du joueur connecté

    // Liste des séries sélectionnées (cochées)
    const selectedSeries = Array.from(document.querySelectorAll("input[name='series[]']:checked"))
                               .map(checkbox => checkbox.value);

    // Vérification si un tournoi et un joueur sont bien sélectionnés
    if (!idTournoi || !licenceJoueur) {
        alert("Erreur : tournoi ou joueur introuvable.");
        return;
    }

    // Vérifie si au moins une série a été sélectionnée
    if (selectedSeries.length === 0) {
        alert("Veuillez sélectionner au moins une série.");
        return;
    }

    try {
        // Envoie une requête POST à l'API pour inscrire le joueur au tournoi
        const response = await fetch("http://localhost:3000/api/inscrits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_tournoi: idTournoi,
                licence_joueur: licenceJoueur,
                series: selectedSeries
            })
        });

        const data = await response.json();

        // Si l'inscription est validée, redirige vers la page d'accueil
        if (response.ok) {
            alert("Inscription réussie !");
            window.location.href = "Accueil.html";
        } else {
            // Affiche un message d'erreur spécifique si l'inscription échoue
            alert(`Erreur : ${data.message}`);
        }

    } catch (error) {
        // Message générique en cas de problème de communication avec le serveur
        alert("Une erreur s'est produite. Veuillez réessayer.");
    }
});

// Initialise la page au chargement
// Remplit le formulaire et affiche les séries disponibles
window.onload = function() {
    remplirFormulaire();
    chargerSeries();
};

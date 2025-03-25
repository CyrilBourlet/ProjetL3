// On ajoute un écouteur d'événement sur le formulaire de connexion
// Il se déclenche lorsque l'utilisateur soumet le formulaire
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

    // On récupère les valeurs saisies dans les champs email et mot de passe
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // On cible l'élément qui affichera un éventuel message d'erreur
    const errorMessage = document.getElementById("error-message");

    try {
        // On envoie une requête POST à l'API pour tenter de se connecter
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST", // Méthode HTTP POST pour envoyer des données
            headers: { "Content-Type": "application/json" }, // On précise qu'on envoie du JSON
            body: JSON.stringify({ email, password }) // On envoie les données dans le corps de la requête
        });

        // On récupère la réponse du serveur, convertie en objet JavaScript
        const data = await response.json();

        // Si la réponse est OK (code 200), la connexion est réussie
        if (response.ok) {

            // On enregistre les informations du joueur dans le localStorage
            // Cela permettra d'y accéder sur d'autres pages du site
            localStorage.setItem("licence_joueur", data.licence_joueur);
            localStorage.setItem("nom", data.nom_joueur);
            localStorage.setItem("prenom", data.prenom_joueur);
            localStorage.setItem("club", data.club_joueur);
            localStorage.setItem("point_joueur", data.point_joueur);
            localStorage.setItem("telephone", data.tel_joueur);
            localStorage.setItem("email", data.mail_joueur);
            localStorage.setItem("est_organisateur", data.est_organisateur);

            // Une fois connecté, on redirige l'utilisateur vers la page d'accueil
            window.location.href = "Accueil.html";

        } else {
            // Si la réponse contient une erreur (mauvais identifiants, etc.)
            // On affiche le message d'erreur reçu depuis le backend
            errorMessage.textContent = data.message || "Erreur de connexion";
        }

    } catch (error) {
        // Si une erreur survient (problème de serveur, pas de connexion internet, etc.)
        // On affiche un message d'erreur générique à l'utilisateur
        errorMessage.textContent = "Problème de connexion avec le serveur.";
    }
});

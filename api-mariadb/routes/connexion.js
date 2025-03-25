const express = require('express'); // importe Express
const router = express.Router();    // crée un routeur Express
const { Joueur } = require('../models'); // importe le modèle Joueur

// Route POST : Connexion d'un utilisateur
router.post('/', async (req, res) => {

    // récupère les champs envoyés dans la requête
    const { email, password } = req.body;

    // vérifie que les champs email et mot de passe sont bien remplis
    if (!email || !password) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    try {
        // recherche dans la base un joueur avec l'email fourni
        const user = await Joueur.findOne({ where: { mail_joueur: email } });

        // si aucun joueur trouvé ou si le mot de passe est incorrect
        if (!user || user.mdp_joueur !== password) {
            return res.status(401).json({ message: "Identifiants incorrects." });
        }

        // si l'utilisateur est trouvé et le mot de passe est correct, on renvoie ses infos
        res.json({ 
            message: "Connexion réussie", 
            licence_joueur: user.licence_joueur || "",
            nom_joueur: user.nom_joueur || "",
            prenom_joueur: user.prenom_joueur || "",
            club_joueur: user.club_joueur ? user.club_joueur : "Non renseigné",
            point_joueur: user.point_joueur !== null ? user.point_joueur : 0,
            tel_joueur: user.tel_joueur ? user.tel_joueur : "Non renseigné",
            mail_joueur: user.mail_joueur ? user.mail_joueur : "Non renseigné",
            est_organisateur: user.est_organisateur ? "true" : "false"
        });

    } catch (err) {
        // si une erreur serveur survient, on retourne un message d'erreur
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router; // exporte le routeur pour l'utiliser dans server.js

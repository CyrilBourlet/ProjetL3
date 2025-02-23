const express = require('express');
const router = express.Router();
const db = require('../db'); // Connexion à la base de données

// Route pour la connexion des utilisateurs
router.post('/', (req, res) => {
    const { email, password } = req.body;

    const query = `
        SELECT licence_joueur, mail_joueur, mdp_joueur, est_organisateur 
        FROM Joueurs 
        WHERE mail_joueur = ?;
    `;

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("❌ Erreur lors de la connexion :", err);
            res.status(500).json({ message: "Erreur serveur" });
            return;
        }

        if (results.length === 0) {
            res.status(401).json({ message: "Identifiants incorrects" });
            return;
        }

        const user = results[0];

        if (user.mdp_joueur === password) {
            res.json({ 
                message: "Connexion réussie", 
                est_organisateur: user.est_organisateur 
            });
        } else {
            res.status(401).json({ message: "Mot de passe incorrect" });
        }
    });
});


module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db'); // Connexion à la base de données

// Route pour récupérer les inscrits d'un tournoi
router.get('/', async (req, res) => {
    const tournoiId = req.query.id;

    if (!tournoiId) {
        return res.status(400).json({ message: "ID du tournoi manquant" });
    }

    const query = `
        SELECT j.licence_joueur, j.nom_joueur, j.prenom_joueur, j.club_joueur
        FROM Inscriptions i
        JOIN Joueurs j ON i.licence_joueur = j.licence_joueur
        WHERE i.id_tournoi = ?;
    `;

    db.query(query, [tournoiId], (err, results) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération des inscrits :", err);
            res.status(500).json({ message: "Erreur serveur", error: err });
            return;
        }
        res.json(results);
    });
});

module.exports = router;

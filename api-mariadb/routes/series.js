const express = require('express');
const router = express.Router();
const { Serie, SerieIn } = require('../models');

// Route GET : Récupérer toutes les séries disponibles dans la base
router.get('/', async (req, res) => {
    try {
        // Recherche de toutes les séries dans la table "Series"
        const series = await Serie.findAll();

        // Si aucune série n'est trouvée
        if (!series || series.length === 0) {
            return res.status(404).json({ message: "Aucune série trouvée en base." });
        }

        // Envoie les séries trouvées au client
        res.json(series);
    } catch (err) {
        // Gestion d'une éventuelle erreur côté serveur
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

// Route GET : Récupérer les séries d'un tournoi spécifique
router.get('/:id_tournoi', async (req, res) => {
    try {
        const { id_tournoi } = req.params; // Récupère l'ID du tournoi depuis l'URL

        // Recherche les séries associées à ce tournoi via la table "SerieIn"
        const series = await Serie.findAll({
            include: [{
                model: SerieIn, // Jointure avec la table "SerieIn"
                required: true, // Force la jointure à n'inclure que les correspondances
                where: { id_tournoi } // Filtre sur l'ID du tournoi
            }]
        });

        // Si aucune série n'est trouvée pour ce tournoi
        if (!series || series.length === 0) {
            return res.status(404).json({ message: "Aucune série trouvée pour ce tournoi." });
        }

        // Envoie la liste des séries associées à ce tournoi
        res.json(series);
    } catch (err) {
        // Gestion d'une éventuelle erreur côté serveur
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

module.exports = router;

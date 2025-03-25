const express = require('express');        // importe Express
const router = express.Router();           // crée un routeur Express
const { Tournoi, SerieIn } = require('../models'); // importe les modèles Tournoi et SerieIn

// Récupérer tous les tournois
router.get('/', async (req, res) => {
    try {
        const tournois = await Tournoi.findAll(); // récupère tous les tournois dans la base
        res.json(tournois);                       // retourne la liste en JSON
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" }); // renvoie une erreur en cas d'échec
    }
});

// Ajouter un nouveau tournoi
router.post('/', async (req, res) => {
    try {
        // récupère les données du corps de la requête
        const { nom, dateDebut, dateFin, lieu, series } = req.body;

        // vérifie que tous les champs sont remplis
        if (!nom || !dateDebut || !dateFin || !lieu || !series || series.length === 0) {
            return res.status(400).json({ message: "Tous les champs sont requis et au moins une série doit être sélectionnée." });
        }

        // crée le tournoi dans la base de données
        const tournoi = await Tournoi.create({
            nom_tournoi: nom,
            datedebut_tournoi: dateDebut,
            datefin_tournoi: dateFin,
            lieu_tournoi: lieu
        });

        // associe les séries sélectionnées à ce tournoi dans la table SerieIn
        for (const id_serie of series) {
            await SerieIn.create({
                id_tournoi: tournoi.id_tournoi,
                id_serie: id_serie
            });
        }

        // renvoie un message de confirmation
        res.json({ message: "Tournoi créé avec succès !" });
    } catch (err) {
        // en cas d'erreur, renvoie un message avec le détail de l'erreur
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

module.exports = router; // exporte le routeur pour pouvoir l'utiliser dans server.js

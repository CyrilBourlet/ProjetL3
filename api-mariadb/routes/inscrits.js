const express = require('express');
const router = express.Router();
const { Inscription, Joueur, Serie, SerieIn } = require('../models');

// Route GET : Liste des inscrits d'un tournoi
router.get('/:id_tournoi', async (req, res) => {
    try {
        const { id_tournoi } = req.params;

        // Recherche toutes les inscriptions d'un tournoi donné
        const inscriptions = await Inscription.findAll({
            where: { id_tournoi },
            include: [
                {
                    model: Joueur,
                    attributes: ['licence_joueur', 'nom_joueur', 'prenom_joueur', 'club_joueur', 'point_joueur']
                },
                {
                    model: Serie,
                    attributes: ['nom_serie']
                }
            ]
        });

        // Si aucune inscription trouvée, retourne un message
        if (!inscriptions || inscriptions.length === 0) {
            return res.status(404).json({ message: "Aucun joueur inscrit pour ce tournoi." });
        }

        // Map pour regrouper les inscriptions par joueur
        const joueursMap = new Map();

        inscriptions.forEach(inscription => {
            const licence = inscription.Joueur.licence_joueur;

            // Si le joueur n'est pas encore dans la map, on l'ajoute
            if (!joueursMap.has(licence)) {
                joueursMap.set(licence, {
                    licence_joueur: licence,
                    nom_joueur: inscription.Joueur.nom_joueur,
                    prenom_joueur: inscription.Joueur.prenom_joueur,
                    club_joueur: inscription.Joueur.club_joueur,
                    point_joueur: inscription.Joueur.point_joueur,
                    series: []
                });
            }

            // Ajoute la série à la liste des séries du joueur
            joueursMap.get(licence).series.push(inscription.Serie.nom_serie);
        });

        // Transforme la Map en tableau d'objets JSON
        const result = Array.from(joueursMap.values());

        // Retourne la liste des inscrits
        res.json(result);

    } catch (err) {
        // En cas d'erreur serveur
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

// Route POST : Inscrire un joueur à une ou plusieurs séries
router.post('/', async (req, res) => {
    try {
        const { id_tournoi, licence_joueur, series } = req.body;

        // Vérifie que les informations sont complètes
        if (!id_tournoi || !licence_joueur || !series || series.length === 0) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        // Recherche le joueur concerné
        const joueur = await Joueur.findOne({ where: { licence_joueur } });
        if (!joueur) {
            return res.status(404).json({ message: "Joueur non trouvé." });
        }

        // Recherche les inscriptions existantes de ce joueur dans ce tournoi
        const inscriptionsExistantes = await Inscription.findAll({
            where: { id_tournoi, licence_joueur }
        });

        // Vérifie si le joueur dépasse le nombre max d'inscriptions (3 séries par tournoi)
        const nbSeriesExistantes = inscriptionsExistantes.length;
        if (nbSeriesExistantes + series.length > 3) {
            return res.status(400).json({ message: "Vous ne pouvez pas vous inscrire à plus de 3 séries par tournoi." });
        }

        // Vérifie les règles pour chaque série demandée
        for (const id_serie of series) {

            // Vérifie si le joueur est déjà inscrit à cette série
            const dejaInscrit = inscriptionsExistantes.some(insc => insc.id_serie === id_serie);
            if (dejaInscrit) {
                return res.status(400).json({ message: `Vous êtes déjà inscrit à la série ${id_serie}` });
            }

            // Récupère les informations de la série
            const serie = await Serie.findOne({ where: { id_serie } });
            if (!serie) {
                return res.status(404).json({ message: `La série ${id_serie} est introuvable.` });
            }

            // Vérifie si la série est complète
            const nbInscrits = await Inscription.count({
                where: { id_tournoi, id_serie }
            });
            if (nbInscrits >= serie.nbplace_serie) {
                return res.status(400).json({ message: `La série "${serie.nom_serie}" est complète.` });
            }

            // Vérifie le sexe autorisé de la série
            if (serie.sexe_autorise === 'Femme' && joueur.sexe !== 'Femme') {
                return res.status(400).json({ message: `La série "${serie.nom_serie}" est réservée aux femmes.` });
            }

            if (serie.sexe_autorise === 'Homme' && joueur.sexe !== 'Homme') {
                return res.status(400).json({ message: `La série "${serie.nom_serie}" est réservée aux hommes.` });
            }

            // Vérifie la catégorie d'âge si définie
            if (serie.categorie_age && joueur.categorie_age !== serie.categorie_age) {
                return res.status(400).json({ message: `Cette série est réservée à la catégorie ${serie.categorie_age}.` });
            }

            // Vérifie la limite de points si définie
            if (serie.limite_points !== null && joueur.point_joueur > serie.limite_points) {
                return res.status(400).json({
                    message: `Votre nombre de points (${joueur.point_joueur}) dépasse la limite autorisée de ${serie.limite_points} pour la série "${serie.nom_serie}".`
                });
            }
        }

        // Crée les inscriptions si tout est valide
        for (const id_serie of series) {
            await Inscription.create({
                id_tournoi,
                licence_joueur,
                id_serie
            });
        }

        // Retourne une confirmation de l'inscription
        res.json({ message: "Inscription réussie !" });

    } catch (err) {
        // En cas d'erreur serveur
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

module.exports = router;

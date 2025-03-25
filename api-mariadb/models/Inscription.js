const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Inscription extends Model {} // création du modèle Inscription

    Inscription.init({
        id_inscription: { 
            type: DataTypes.INTEGER,        // identifiant unique de l'inscription
            primaryKey: true,               // clé primaire
            autoIncrement: true             // incrémentation automatique
        },
        id_tournoi: { 
            type: DataTypes.INTEGER,        // identifiant du tournoi associé
            allowNull: false,               // obligatoire
            references: {                   // clé étrangère vers la table Tournois
                model: 'Tournois',
                key: 'id_tournoi'
            }
        },
        licence_joueur: { 
            type: DataTypes.INTEGER,        // identifiant du joueur (licence)
            allowNull: false,               // obligatoire
            references: {                   // clé étrangère vers la table Joueurs
                model: 'Joueurs',
                key: 'licence_joueur'
            }
        },
        id_serie: { 
            type: DataTypes.INTEGER,        // identifiant de la série où le joueur s'inscrit
            allowNull: false,               // obligatoire
            references: {                   // clé étrangère vers la table Series
                model: 'Series',
                key: 'id_serie'
            }
        },
        date_inscription: { 
            type: DataTypes.DATE,           // date à laquelle l'inscription a été faite
            allowNull: false,               // obligatoire
            defaultValue: DataTypes.NOW     // valeur par défaut : date actuelle
        }
    }, {
        sequelize,                          // instance de Sequelize utilisée
        modelName: 'Inscription',           // nom du modèle
        tableName: 'Inscriptions',          // nom de la table en base
        timestamps: false                   // désactive createdAt et updatedAt
    });

    return Inscription; // export du modèle
};

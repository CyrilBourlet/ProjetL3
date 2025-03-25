const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Serie extends Model {} // création du modèle Serie

    Serie.init({
        id_serie: { 
            type: DataTypes.INTEGER,        // identifiant unique de la série
            primaryKey: true,               // clé primaire
            autoIncrement: true             // s'incrémente automatiquement
        },
        nom_serie: { 
            type: DataTypes.STRING,         // nom de la série (ex : Série A, Série Elite)
            allowNull: false                // obligatoire
        },
        nbplace_serie: { 
            type: DataTypes.INTEGER,        // nombre maximum de places pour cette série
            allowNull: false                // obligatoire
        },
        sexe_autorise: { 
            type: DataTypes.ENUM('Homme', 'Femme', 'Mixte'), // sexe autorisé dans cette série
            allowNull: false,               // obligatoire
            defaultValue: 'Mixte'           // par défaut, les deux sexes sont autorisés
        },
        categorie_age: { 
            type: DataTypes.ENUM('Poussin', 'Benjamin', 'Minimes', 'Cadet', 'Junior', 'Senior', 'Vétéran'), 
            allowNull: true                 // peut être vide si pas de restriction d'âge
        },
        limite_points: { 
            type: DataTypes.INTEGER,        // limite maximale de points pour s'inscrire
            allowNull: true                 // peut être vide si pas de limite de points
        }
    }, {
        sequelize,                          // instance sequelize utilisée
        modelName: 'Serie',                 // nom du modèle
        tableName: 'Series',                // nom de la table en base de données
        timestamps: false                   // désactive createdAt et updatedAt
    });

    return Serie; // export du modèle
};

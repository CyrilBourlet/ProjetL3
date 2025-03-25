const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Joueur', {
        licence_joueur: { 
            type: DataTypes.INTEGER,           // type entier
            primaryKey: true,                  // clé primaire
            autoIncrement: true                // incrémentation automatique
        },
        nom_joueur: { 
            type: DataTypes.STRING,            // texte
            allowNull: false                   // obligatoire
        },
        prenom_joueur: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        club_joueur: { 
            type: DataTypes.STRING             // texte, pas obligatoire
        },
        point_joueur: { 
            type: DataTypes.INTEGER            // nombre de points du joueur
        },
        tel_joueur: { 
            type: DataTypes.STRING             // numéro de téléphone
        },
        mail_joueur: { 
            type: DataTypes.STRING,            // adresse mail
            unique: true,                      // doit être unique
            allowNull: false                   // obligatoire
        },
        mdp_joueur: { 
            type: DataTypes.STRING,            // mot de passe (hashé en général)
            allowNull: false 
        },
        est_organisateur: { 
            type: DataTypes.BOOLEAN,           // si le joueur est organisateur ou non
            defaultValue: false                // par défaut, ce n'est pas un organisateur
        },
        sexe: { 
            type: DataTypes.ENUM('Homme', 'Femme'),  // sexe du joueur
            allowNull: false 
        },
        categorie_age: { 
            type: DataTypes.ENUM('Poussin', 'Benjamin', 'Minimes', 'Cadet', 'Junior', 'Senior', 'Vétéran'), 
            allowNull: false                   // catégorie d'âge du joueur
        }
    }, {
        tableName: 'Joueurs',                  // nom de la table dans la base de données
        timestamps: false                      // désactive createdAt et updatedAt
    });
};

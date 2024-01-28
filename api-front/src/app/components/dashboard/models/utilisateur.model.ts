export class Utilisateur {
    nom!: string;
    prenom!: string;
    userName!: string;
    role!: number;
    idUtilisateur!: number;

    constructor(nom: string, prenom: string, userName: string, role: number , idUtilisateur: number) {
        this.nom = nom;
        this.prenom = prenom;
        this.userName = userName;
        this.role = role;
        this.idUtilisateur = idUtilisateur;
    }

}

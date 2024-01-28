export class Salle {

    nom!: string;
    capacite!: number;
    idSalle!: number;
    equipements!: any[];

    constructor(idSalle : number , nom: string, capacite: number) {
        this.idSalle = idSalle;
        this.nom = nom;
        this.capacite = capacite;

    }


}

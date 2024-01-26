export class Group {

    idGroupe!: number
    idGroupe_parent!: number
    nom!: string

    constructor(idGroupe: number, nom: string , idGroupe_parent: number) {
        this.idGroupe = idGroupe;
        this.nom = nom;
        this.idGroupe_parent = idGroupe_parent;
    }

    
}

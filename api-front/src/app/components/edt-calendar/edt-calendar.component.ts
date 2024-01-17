import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injectable,
    ViewEncapsulation,
} from '@angular/core';

import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { th } from 'date-fns/locale';

function floorToNearest(amount: number, precision: number) {
    return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
    return Math.ceil(amount / precision) * precision;
}

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
    override weekTooltip(event: CalendarEvent<any>, title: string): string {
        if (!event.meta.tmpEvent) {
            return super.weekTooltip(event, title) || '';
        }
        return '';
    }

    override dayTooltip(event: CalendarEvent<any>, title: string): string {
        if (!event.meta.tmpEvent) {
            return super.dayTooltip(event, title) || '';
        }
        return '';
    }
}

@Component({
    selector: 'app-edt-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './edt-calendar.component.html',
    styleUrls: ['./edt-calendar.component.css'],
    providers: [
        {
            provide: CalendarEventTitleFormatter,
            useClass: CustomEventTitleFormatter,
        }
    ],
    styles: [
        '.disable-hover { pointer-events: none; }',
    ],  
    encapsulation: ViewEncapsulation.None,
})
export class EdtCalendarComponent {
    toggleSuprRessource() {
        this.showSuprRessource = !this.showSuprRessource;
    }
    showSuprRessource = false;
    viewDate = new Date();
    events: CalendarEvent[] = [];
    dragToCreateActive = false;
    weekStartsOn: 0 = 0;
    dayStartHour: number = 8;
    dayEndHour: number = 19;

    ressouces: any[] = [];
    groupes: any[] = [];
    salles: any[] = [];
    teachers: any[] = [];
    types: any[] = [];

    selectedRessource: any;
    selectedGroupe: any;
    selectedSalle: any;
    selectedTeacher: any;
    selectedType: any;
    
    coursId: number = 0;

    constructor(private cdr: ChangeDetectorRef, private http: HttpClient) { }

    ngOnInit(): void {
        
        
        
        this.selectedTeacher = this.teachers[0];
        this.selectedType = this.types[0];
    }

    startDragToCreate(
        segment: WeekViewHourSegment,
        mouseDownEvent: MouseEvent,
        segmentElement: HTMLElement
    ) {

        const dragToSelectEvent: CalendarEvent = {
            id: this.events.length,
            title: '',
            start: segment.date,
            
            meta: {
                tmpEvent: true,
            },
        };

        this.events = [...this.events, dragToSelectEvent];
        const segmentPosition = segmentElement.getBoundingClientRect();
        this.dragToCreateActive = true;
        const endOfView = endOfWeek(this.viewDate, {
            weekStartsOn: this.weekStartsOn,
        });

        fromEvent(document, 'mousemove')
            .pipe(
                finalize(() => {

                    delete dragToSelectEvent.meta.tmpEvent;
                    this.dragToCreateActive = false;
                    this.refresh();
                    this.initCoursModal(dragToSelectEvent);
                    
                    
                }),
                takeUntil(fromEvent(document, 'mouseup'))
            )
            .subscribe((mouseMoveEvent: Event) => {
                const mouseEvent = mouseMoveEvent as MouseEvent;

                const minutesDiff = ceilToNearest(
                    mouseEvent.clientY - segmentPosition.top,
                    30
                );

                const daysDiff =
                    floorToNearest(
                        mouseEvent.clientX - segmentPosition.left,
                        segmentPosition.width
                    ) / segmentPosition.width;

                const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
                if (newEnd > segment.date && newEnd < endOfView) {
                    dragToSelectEvent.end = newEnd;
                }
                this.refresh();
            });

    }


    private refresh() {
        this.events = [...this.events];
        this.cdr.detectChanges();
    }

    updateEvent(event: CalendarEvent) {
        
        event.id = this.coursId;
        console.log('updateEvent');
        console.log(this.selectedRessource);
        console.log(this.ressouces);

        const ressource = this.ressouces.find((ressource) => ressource.idressource == this.selectedRessource);
        event.title = ressource.titre;
        console.log('ressource');
        console.log(ressource);
        console.log('ressource titre');
        console.log(ressource.titre);
        console.log('ressource couleur');
        console.log(ressource.couleur);
        
        event.color = {
            primary: ressource.codecouleur,
            secondary: ressource.codecouleur,
        },


        console.log('event');
        console.log(event);
        this.refresh();
    }


    getAvailableRessources(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('getAvailableRessources');
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            this.http.get('http://localhost:5050/ressource/getDispo', { headers }).subscribe({
                next: (data: any) => {
                    
                    this.ressouces = data;
                    resolve(data);
                },
                error: (error: any) => {
                    console.log(error);
                }
            });
        });

    }

    getAvailableTeacher(event: CalendarEvent): Promise<any> {
        return new Promise((resolve, reject) => {
            const start = event.start;
            const end = event.end;
            const durationInMillis = start && end ? end.getTime() - start.getTime() : 0;

            const token = localStorage.getItem('token'); //format : 
            const headers = { 'Authorization': `Bearer ${token}` };
            const body = {
                'HeureDebut': start?.toLocaleTimeString(),
                'Jour': start.toLocaleDateString().split('/').reverse().join('-'),
                'NombreHeure': this.coursDuration(durationInMillis),
            };
            console.log(body);
            this.http.post('http://localhost:5050/utilisateurs/getProfDispo', body, { headers }).subscribe({
                next: (data: any) => {
                    
                    this.teachers = data;
                    resolve(data);
                },
                error: (error: any) => {
                    console.log(error);
                }
            });
        });
            

    }

    getAvailableRoom(event: CalendarEvent): Promise<any> {
        return new Promise((resolve, reject) => {
            const start = event.start;
            const end = event.end;
            const durationInMillis = start && end ? end.getTime() - start.getTime() : 0;

            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };
            const body = {
                'HeureDebut': start?.toLocaleTimeString(),
                'Jour': start.toLocaleDateString().split('/').reverse().join('-'),
                'NombreHeure': this.coursDuration(durationInMillis),
            };

            this.http.post('http://localhost:5050/salle/getDispo', body, { headers }).subscribe({
                next: (data: any) => {
                    this.salles = data;
                    resolve(data);
                },
                error: (error: any) => {
                    console.log(error);
                }
            });
        });
    }

    getAvailableGroupe(event: CalendarEvent): Promise<any> {
        return new Promise((resolve, reject) => {
            const start = event.start;
            const end = event.end;
            const durationInMillis = start && end ? end.getTime() - start.getTime() : 0;

            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };
            const body = {
                'HeureDebut': start?.toLocaleTimeString(),
                'Jour': start.toLocaleDateString().split('/').reverse().join('-'),
                'NombreHeure': this.coursDuration(durationInMillis),
            };

            this.http.post('http://localhost:5050/groupe/getGroupeDispo', body, { headers }).subscribe({
                next: (data: any) => {
                    this.groupes = data;
                    resolve(data);
                },
                error: (error: any) => {
                    console.log(error);
                }
            });
        });
    }

    getAvailableType(event: CalendarEvent): Promise<any> {
        return new Promise((resolve, reject) => {
            const start = event.start;
            const end = event.end;
            const durationInMillis = start && end ? end.getTime() - start.getTime() : 0;

            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };
            const body = {
                'HeureDebut': start?.toLocaleTimeString(),
                'Jour': start.toLocaleDateString().split('/').reverse().join('-'),
                'NombreHeure': this.coursDuration(durationInMillis),
            };

            this.http.post('http://localhost:5050/cours/getAllCoursType/', body, { headers }).subscribe({
                next: (data: any) => {
                    this.types = data;
                    resolve(data);
                },
                error: (error: any) => {
                    console.log(error);
                }
            });
        });


    }

    coursDuration(durationInMillis: number) {
        const seconds = Math.floor(durationInMillis / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
    
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    

    async initCoursModal(event: CalendarEvent) {
        await this.getAvailableRessources().then((data) => {
            this.ressouces = data;
            this.selectedRessource = this.ressouces[0].idressource;
        });
        await this.getAvailableTeacher(event).then((data) => {
            this.teachers = data;
            this.selectedTeacher = this.teachers[0].idProf;
        });
        await this.getAvailableRoom(event).then((data) => {
            this.salles = data;
            this.selectedSalle = this.salles[0].idSalle;
        });
        await this.getAvailableGroupe(event).then((data) => {
            this.groupes = data;
            this.selectedGroupe = this.groupes[0].IdGroupe;
        });
        await this.getAvailableType(event).then((data) => {
            this.types = data;
            this.selectedType = this.types[0][0];
        });
        console.log('event');
        console.log(this.selectedRessource);
        console.log(this.selectedTeacher);
        console.log(this.selectedSalle);
        console.log(this.selectedGroupe);
        console.log(this.selectedType);
        

        console.log('initCoursModal');
        this.showSuprRessource = true;
    }

    createCours(body:any):Promise<any>{
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        return new Promise((resolve, reject) => {
            this.http.post('http://localhost:5050/cours/add', body, { headers }).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: any) => {
                    console.log(error);
                }
            });
        });
    }

    assingTeacher(body:any, idCours:number):Promise<any>{
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        return new Promise((resolve, reject) => {
            this.http.post('http://localhost:5050/cours/assignerProf/' + idCours, body, { headers }).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: any) => {
                    console.log(error);
                }
            });
        });
    }

    assignGroupe(body:any):Promise<any>{
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        return new Promise((resolve, reject) => {
            this.http.post('http://localhost:5050/groupe/ajouterCours/' + this.selectedGroupe, body, { headers }).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: any) => {
                    console.log(error);
                }
            });
        });
    }

    assignSalle(body:any, idCours:number):Promise<any>{
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        return new Promise((resolve, reject) => {
            this.http.post('http://localhost:5050/cours/attribuerSalle/' + idCours, body, { headers }).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (error: any) => {
                    console.log(error);
                }
            });
        });
    }

    async initiateCoursCreation(){
        console.log('initiateCoursCreation');
        console.log(this.selectedType);
        
        //get last event
        const event = this.events[this.events.length - 1];
        const start = event.start;
        const end = event.end;
        const durationInMillis = start && end ? end.getTime() - start.getTime() : 0;
        
        const body = {
            'HeureDebut': start?.toLocaleTimeString(),
            'Jour': start.toLocaleDateString().split('/').reverse().join('-'),
            'NombreHeure': this.coursDuration(durationInMillis),
            'idRessource': this.selectedRessource,
            'typeCours': this.selectedType,
        };
        let idCours = 0;
        
        await this.createCours(body).then((data)=>{
            idCours = data;
            this.coursId = data;
        });

        console.log("idCours :" + idCours);
        console.log("idProf :" + this.selectedTeacher);
        const bodyAssignTeacher = {
            'idProf': this.selectedTeacher,
        };
        await this.assingTeacher(bodyAssignTeacher, idCours);


        const bodyAssignGroupe = {
            'idCours': idCours,
        };
        await this.assignGroupe(bodyAssignGroupe);

        const bodyAssignSalle = {
            'idSalle': this.selectedSalle,
        };


        await this.assignSalle(bodyAssignSalle, idCours);

        this.showSuprRessource = false;
        this.refresh();
        this.updateEvent(event);
        
        console.log(idCours);
    }

    onRessourceChange(event: any) {
        this.selectedRessource = event.target.value;
        console.log(this.selectedRessource);
    }

    onGroupeChange(event: any) {
        this.selectedGroupe = event.target.value;
        console.log(this.selectedGroupe);
    }

    onSalleChange(event: any) {
        this.selectedSalle = event.target.value;
        console.log(this.selectedSalle);
    }

    onTeacherChange(event: any) {
        this.selectedTeacher = event.target.value;
        console.log(this.selectedTeacher);
    }

    onTypeChange(event: any) {
        this.selectedType = event.target.value;
        console.log(this.selectedType);
    }

}

interface customeCoursEvent extends CalendarEvent {


}
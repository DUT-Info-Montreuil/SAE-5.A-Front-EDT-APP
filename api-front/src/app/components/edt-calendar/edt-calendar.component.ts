import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  ViewEncapsulation,
} from '@angular/core';

import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
  CalendarView
} from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import {fromEvent, Subject} from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import {addDays, addMinutes, endOfWeek, setHours, setMinutes} from 'date-fns';
import {is} from "date-fns/locale";
import { HttpClient } from '@angular/common/http';
import { th } from 'date-fns/locale';

function floorToNearest(amount: number, precision: number) {
    return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
    return Math.ceil(amount / precision) * precision;
}


@Component({
    selector: 'app-edt-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './edt-calendar.component.html',
    styleUrls: ['./edt-calendar.component.css'],
    providers: [
        {
            provide: CalendarEventTitleFormatter,
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
    refreshCalendar = new Subject<void>();

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
  groupesList: { idGroupe: any, name: any }[] = [];
  isInEditMode = false;
  view: CalendarView = CalendarView.Week;
  private activeDayIsOpen: boolean = true;
  CalendarView = CalendarView;

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getGroupes();
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
      draggable: this.isInEditMode,
      resizable: this.getResizable(),
      meta: {
        tmpEvent: true,
      },
    };
    if (this.isInEditMode) {
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
  }


  saveDate(date: any) {
    if (date == null) {
      date = new Date().toLocaleDateString();
    }
    let dateList = date.split('/')
    // console.log("dateString: " + date)
    // console.log("new date" + dateList[1]+"/"+dateList[0]+"/"+dateList[2])
    window.localStorage.setItem("calendarDateView", dateList[1] + "/" + dateList[0] + "/" + dateList[2])
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  changeDay(date: any) {
    // console.log("picked: " + date)
    this.viewDate = date;
  }

  filtreDatePicker = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  setViewClick(view: CalendarView, date: Date) {
    if (!this.isInEditMode) {
      this.view = view;
      this.viewDate = date;
    }

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
  eventChanged({
                 event,
                 newStart,
                 newEnd,
                 allDay
               }: CalendarEventTimesChangedEvent): void {
    console.log("log: " + this.isInEditMode)
    console.log(event.id)
    const externalIndex = this.events.indexOf(event);
    if (typeof allDay !== 'undefined') {
      event.allDay = allDay;
    }
    if (externalIndex > -1) {
      this.events.splice(externalIndex, 1);
      this.events.push(event);
    }
    if(newStart) {
      if (this.canPlaceNewDateHour(newStart)) {
        if (newStart !== event.start) {
          if(!newEnd){
            this.deplacerCours(event.id, newStart)
          }
          else {
            if (this.canPlaceNewDateHour(newEnd)) {
              this.deplacerCours(event.id, newStart)
              event.end = newEnd;
              event.start = newStart;
            }
          }
        } else {
          if (newEnd) {
            if (this.canPlaceNewDateHour(newEnd)) {
              if (newEnd !== event.end) {
                this.modifierCours(event.id, newStart, newEnd)
              }
              event.end = newEnd;
            }
          }
        }
      }
      if (this.view === 'month') {
        this.viewDate = newStart;
        this.activeDayIsOpen = true;
      }
      this.events = [...this.events];
    }
    if (newEnd) {
      if(this.canPlaceNewDateHour(newEnd) && this.canPlaceNewDateHour(newStart)) {
        event.end = newEnd;
      }
    }


  }

  private modifierCours(id: string | number | undefined, start: Date, end: Date) {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'};
    let diffInMs = end.getTime() - start.getTime();

    let diffInSeconds = Math.floor(diffInMs / 1000);
    let diffInMinutes = Math.floor(diffInSeconds / 60);
    let diffInHours = Math.floor(diffInMinutes / 60);

    let body = {"NombreHeure":diffInHours+":"+diffInMinutes%60+":"+diffInSeconds%60}
    this.http.put('http://localhost:5050/cours/modifierCours/'+id, body,{headers}).subscribe({
      next: (data: any) => {
      },
      error: (error: any) => {
      }
    });
  }

  private deplacerCours(id: string | number | undefined, date: Date) {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'};
    console.log(date.toLocaleDateString())
    let body = {"HeureDebut":date.toLocaleTimeString(), "Jour": date.toLocaleDateString()}
    this.http.put('http://localhost:5050/cours/deplacer/'+id, body,{headers}).subscribe({
      next: (data: any) => {
      },
      error: (error: any) => {
      }
    });
  }
  getResizable() {
    if (this.isInEditMode) {
      return {
        afterEnd: true,
        beforeStart: true

      }
    }
    return {}
  }

  setEditMod(isInEditMod: boolean) {
    this.isInEditMode=isInEditMod;
    for (let oneEvent of this.events){
      oneEvent.draggable = isInEditMod;
      oneEvent.resizable = this.getResizable();
    }

  }

  getMonday(date: Date){
    date = new Date(date);
    var day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -6 : 2); // adjust when day is sunday
    return new Date(date.setDate(diff));
  }

  getSunday(date: Date){
    date = new Date(date);
    var day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? 0 : 6); // adjust when day is sunday
    return new Date(date.setDate(diff));
  }
  getAllCoursInfo(idGroupe: string | number | undefined, dateDebut: Date, dateFin: Date) {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'};
    let body = {"intervalleDebut":dateDebut.toLocaleDateString().split('/').reverse().join('-'), "intervalleFin": dateFin.toLocaleDateString().split('/').reverse().join('-')}
    this.http.post('http://localhost:5050/cours/getCoursGroupeExtended/'+idGroupe, body, {headers}).subscribe({
      next: async (data: any) => {
        console.log("data: " + JSON.stringify(data))
        this.events = this.jsonToEvent(data);
        console.log("events : " + JSON.stringify(this.events))
        this.refreshCalendar.next()
      },
      error: (error: any) => {
        console.log(error);
        this.events = [];
        return {}
      }
    });

  }

  jsonToEvent(results: any[]) {
    let bdEvent: CalendarEvent[] = []
    for (let result of results) {
      if (result != null) {
        // console.log("result: " + JSON.stringify(result))
      }
      let heureDebutList = result.HeureDebut.split(':')
      let nombreHeureList = result.NombreHeure.split(':')
      let date = new Date(result.Jour);
      let ressource = result.titre
      console.log(ressource)
      let initprof = result.Initiale
      let resizable = this.getResizable()
      console.log("heuredébut : " + setHours(setMinutes(date, heureDebutList[1]), heureDebutList[0]))
      console.log("heurefin : " + setHours(setMinutes(date, Number(nombreHeureList[1]) + Number(heureDebutList[1])), Number(nombreHeureList[0]) + Number(heureDebutList[0])))
      let draggable = this.isInEditMode
      bdEvent.push({
        start: setHours(setMinutes(date, heureDebutList[1]), heureDebutList[0]),
        end: setHours(setMinutes(date, Number(nombreHeureList[1]) + Number(heureDebutList[1])), Number(nombreHeureList[0]) + Number(heureDebutList[0])),
        title: ressource,
        id: result.idCours,
        resizable: resizable,
        draggable: draggable,
      })
    }
    console.log("bdEvent: " + JSON.stringify(bdEvent))
    return bdEvent
  }

  getGroupes() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'};

    this.http.get('http://localhost:5050/groupe/getAll', {headers}).subscribe({
      next: async (data: any) => {
        console.log("data: " + JSON.stringify(data))
        this.groupesList = this.orderedGroupeList(data);
        console.log(JSON.stringify(this.orderedGroupeList(data)))
      },
      error: (error: any) => {
        // console.log(error);
        return {}
      }
    });
  }

  private orderedGroupeList(data: any[]) {
    let listGroupe: {idGroupe: any, name: any}[] = []
    for(let groupe of data){
      console.log(groupe)
      if(!groupe.idGroupe_parent){
        listGroupe.push({
          idGroupe: groupe.IdGroupe,
          name: groupe.Nom,
        })
      }
    }
    return listGroupe;
  }
  protected readonly window = window;
  private canPlaceNewDateHour(date: Date) {
    let canPlace = true;
    if(date.getHours() < 8 || date.getHours() > 19){
      canPlace = false;

    }

    return canPlace;
  }
}




interface customeCoursEvent extends CalendarEvent {


}
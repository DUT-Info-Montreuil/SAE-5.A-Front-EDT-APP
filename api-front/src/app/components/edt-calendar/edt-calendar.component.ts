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
    selectedGroupe: string = "0";
    refreshCalendar = new Subject<void>();

    ressouces: any[] = [];
    groupes: any[] = [];
    salles: any[] = [];
    teachers: any[] = [];
  groupesList: {idGroupe: any, name: any, subGroupes: any[] | string}[] = [];
  isInEditMode = false;
  view: CalendarView = CalendarView.Week;
  private activeDayIsOpen: boolean = true;
  CalendarView = CalendarView;

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient) { }

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
      title: 'New event',
      start: segment.date,
      draggable: this.isInEditMode,
      resizable: this.getResizable(),
      meta: {
        tmpEvent: true,
      },
    };
    if(this.isInEditMode){
      this.events = [...this.events, dragToSelectEvent];
      const segmentPosition = segmentElement.getBoundingClientRect();
      this.dragToCreateActive = true;
      const endOfView = endOfWeek(this.viewDate, {
        weekStartsOn: this.weekStartsOn,
      });

      fromEvent(document, 'mousemove')
        .pipe(
          finalize(() => {
            console.log("event" );
            console.log(dragToSelectEvent.start.toLocaleDateString());
            delete dragToSelectEvent.meta.tmpEvent;
            this.dragToCreateActive = false;
            this.refresh();
            this.getAvailableRessources();
            console.log(this.ressouces);
          }),
          takeUntil(fromEvent(document, 'mouseup'))
          //this.showSuprRessource = true;
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
    if(date == null){
      date = new Date().toLocaleDateString();
    }
    let dateList = date.split('/')
    // console.log("dateString: " + date)
    // console.log("new date" + dateList[1]+"/"+dateList[0]+"/"+dateList[2])
    window.localStorage.setItem("calendarDateView", dateList[1]+"/"+dateList[0]+"/"+dateList[2])
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
    if(!this.isInEditMode){
      this.view = view;
      this.viewDate = date;
    }

  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }


  getAvailableRessources() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get('http://localhost:5050/ressource/getDispo', { headers }).subscribe({
      next: (data: any) => {
        console.log(data);
        this.ressouces = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  getAvailableTeacher() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    const body = {
      //NombreHeure: type Time (HH:MM:SS)
      //Jour: type string (YYYY-MM-DD)
      //HeureDebut: type Time (HH:MM:SS)
      'HeureDebut': this.events[0].start,
      'Jour': this.events[0].start.getDay(),
      'NombreHeure': '',
    };
    this.http.post('http://localhost:5050/teacher/getDispo', body, { headers }).subscribe({
      next: (data: any) => {
        console.log(data);
        this.teachers = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });

  }
  getAvailableRoom() {
    return this.events.filter(event => event.meta.tmpEvent);
  }
  getAvailableGroupe() {
    return this.events.filter(event => event.meta.tmpEvent);
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
    if(newStart){
      if(newStart !== event.start){
        this.deplacerCours(event.id, newStart)
      }
      else{
        if (newEnd) {
          if(newEnd !== event.end){
            this.modifierCours(event.id, newStart, newEnd)
          }
          event.end = newEnd;
        }
      }
      event.start = newStart;
    }
    if (newEnd) {
      event.end = newEnd;
    }
    if (this.view === 'month') {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
    this.events = [...this.events];

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
    let listGroupe: {idGroupe: any, name: any, subGroupes: any[] | string}[] = []
    for(let groupe of data){
      console.log(groupe)
      if(!groupe.idGroupe_parent){
        listGroupe.push({
          idGroupe: groupe.IdGroupe,
          name: groupe.Nom,
          subGroupes: this.getLowestSubGroupes(groupe.IdGroupe, data)
        })
      }
    }
    return listGroupe;
  }

  private getLowestSubGroupes(idGroupe: any, data: any[]): any[] {
    let subGroupes: any[] = [];
    for(let groupe of data){
      if(groupe.idGroupe_parent === idGroupe){
        let lowestSubGroupes = this.getLowestSubGroupes(groupe.IdGroupe, data);
        if(lowestSubGroupes.length > 0) {
          subGroupes.push(...lowestSubGroupes);
        } else {
          subGroupes.push({
            idGroupe: groupe.IdGroupe,
            name: groupe.Nom
          });
        }
      }
    }
    return subGroupes;
  }

  protected readonly window = window;
}



interface customeCoursEvent extends CalendarEvent {

}
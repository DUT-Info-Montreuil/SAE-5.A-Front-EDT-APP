import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {isSameDay, isSameMonth, setHours, setMinutes} from 'date-fns';
import {Subject} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {changePage} from "../../../main";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  constructor(private route: ActivatedRoute, private http: HttpClient,) {
    this.getCours()
  }

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh = new Subject<void>();

  activeDayIsOpen: boolean = true;



  setView(view: CalendarView, date:Date) {
    this.viewDate = date;
    this.view = view;
  }

  testEvent(event:any) {
    console.log("EVENNT" + event)
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  events: CalendarEvent[] = [
    {
      start: setHours(setMinutes(new Date(), 20), 15),
      end: setHours(setMinutes(new Date(), 40), 17),
      title: 'An event',
      resizable: this.getResizable(),
      draggable: this.isInEditionMod(),
    },
  ];

  getResizable(){
    if(this.isInEditionMod()){
      return {
        afterEnd: true,
        beforeStart: true

      }
    }
    return {}
  }

  isInEditionMod(){
    return this.route.snapshot.component?.name == "_ScheduleEditComponent"
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }


  changeDay(date: Date) {
      this.viewDate = date;
      this.view = CalendarView.Day;
  }

  getCours() {
    const  token = localStorage.getItem('token')
    this.http
      .get('http://localhost:5050/cours/get/1', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      .subscribe({
        next: (data: any) => {
        },
      });
  }


}
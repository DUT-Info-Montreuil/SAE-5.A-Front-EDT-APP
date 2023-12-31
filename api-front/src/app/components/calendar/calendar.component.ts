import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {isSameDay, isSameMonth, setHours, setMinutes} from 'date-fns';
import {Subject} from "rxjs";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh = new Subject<void>();

  activeDayIsOpen: boolean = true;



  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  events: CalendarEvent[] = [];


  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

}

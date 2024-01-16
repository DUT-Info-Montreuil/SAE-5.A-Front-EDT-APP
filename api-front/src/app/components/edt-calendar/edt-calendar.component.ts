import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  ViewEncapsulation,
} from '@angular/core';

import {CalendarEvent, CalendarEventTitleFormatter, CalendarView} from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import {is} from "date-fns/locale";

function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}

function getDisplayDate() {
  try {
    // console.log("date: " + window.localStorage.getItem("calendarDateView"))
    let dayview = window.localStorage.getItem("calendarDateView")
    if(dayview !== null){
      return new Date(dayview)
    }
    else {
      return new Date()
    }

  }
  catch(e){
    return new Date()
  }


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
  providers:[
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
  isInEditMode = false;
  viewDate = getDisplayDate();
  events: CalendarEvent[] = [];
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;
  dayStartHour: number = 8;
  dayEndHour: number = 19;
  view: CalendarView = CalendarView.Week;
  private activeDayIsOpen: boolean = true;
  CalendarView = CalendarView;
  constructor(private cdr: ChangeDetectorRef) {}

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'New event',
      start: segment.date,
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
            delete dragToSelectEvent.meta.tmpEvent;
            this.dragToCreateActive = false;
            this.refresh();
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
    if(date == null){
      date = new Date().toLocaleDateString();
    }
    let dateList = date.split('/')
    // console.log("dateString: " + date)
    // console.log("new date" + dateList[1]+"/"+dateList[0]+"/"+dateList[2])
    window.localStorage.setItem("calendarDateView", dateList[1]+"/"+dateList[0]+"/"+dateList[2])
  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
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
}
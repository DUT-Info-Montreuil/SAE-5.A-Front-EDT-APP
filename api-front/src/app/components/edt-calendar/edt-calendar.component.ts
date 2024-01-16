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
  viewDate = new Date();
  events: CalendarEvent[] = [];
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;
  dayStartHour: number = 8;
  dayEndHour: number = 19;

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

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}
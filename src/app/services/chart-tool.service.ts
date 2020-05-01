import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum ChartToolEvents {
  // Scroll
  ScrollDown = 'ScrollDown',
  ScrollUp = 'ScrollUp',
}
@Injectable({
  providedIn: 'root',
})
export class ChartToolsService {
  public chartToolEvent: Subject<ChartToolEvents> = new Subject();

  public fireEvent(eventType: ChartToolEvents) {
    this.chartToolEvent.next(eventType);
  }
}

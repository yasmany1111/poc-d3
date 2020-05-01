import { Component, OnInit } from '@angular/core';
import { quickGet } from './chart-tools/quick-get';
import { getChart } from './chart-tools/chart';
import { Observable } from 'rxjs';
import {
  ChartToolsService,
  ChartToolEvents,
} from './services/chart-tool.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public debugString = '';

  constructor(private chartToolService: ChartToolsService) {}

  public async ngOnInit() {
    (await getChart(this.chartToolService)).subscribe(
      (debugMessage: string) => {
        this.debugString = debugMessage;
      }
    );
  }

  //
  public onEventMapComponentScroll(event) {
    if (event.wheelDeltaY > 0) {
      this.chartToolService.fireEvent(ChartToolEvents.ScrollDown);
    } else {
      this.chartToolService.fireEvent(ChartToolEvents.ScrollUp);
    }
    event.preventDefault();

    return false;
  }
}

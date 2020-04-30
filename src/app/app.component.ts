import { Component, OnInit } from '@angular/core';
import { quickGet } from './utils/quick-get';
import { getChart } from './utils/chart';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public debugString = '';

  constructor() {
    quickGet('http://127.0.0.1:5000/data.csv').then((data) => {
      // console.log(data);
    });
  }

  public async ngOnInit() {
    (await getChart()).subscribe((debugMessage: string) => {
      this.debugString = debugMessage;
    });
  }
}

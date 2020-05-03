import { Component, OnInit } from '@angular/core';
import * as Plyr from 'plyr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public player;
  ngOnInit(): void {
    this.player = new Plyr('#plyrID', { captions: { active: true } });
  }
  title = 'vietflix-userportal';
}

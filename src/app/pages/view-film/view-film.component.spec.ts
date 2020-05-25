import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFilmComponent } from './view-film.component';

describe('ViewFilmComponent', () => {
  let component: ViewFilmComponent;
  let fixture: ComponentFixture<ViewFilmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFilmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

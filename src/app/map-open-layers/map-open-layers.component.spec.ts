import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOpenLayersComponent } from './map-open-layers.component';

describe('MapOpenLayersComponent', () => {
  let component: MapOpenLayersComponent;
  let fixture: ComponentFixture<MapOpenLayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapOpenLayersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOpenLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

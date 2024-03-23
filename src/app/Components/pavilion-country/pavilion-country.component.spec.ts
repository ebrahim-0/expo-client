import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PavilionCountryComponent } from './pavilion-country.component';

describe('PavilionCountryComponent', () => {
  let component: PavilionCountryComponent;
  let fixture: ComponentFixture<PavilionCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PavilionCountryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PavilionCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

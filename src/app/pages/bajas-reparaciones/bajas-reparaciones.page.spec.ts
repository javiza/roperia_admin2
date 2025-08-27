import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BajasReparacionesPage } from './bajas-reparaciones.page';

describe('BajasReparacionesPage', () => {
  let component: BajasReparacionesPage;
  let fixture: ComponentFixture<BajasReparacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BajasReparacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

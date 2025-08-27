import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnidadPage } from './unidad.page';

describe('UnidadPage', () => {
  let component: UnidadPage;
  let fixture: ComponentFixture<UnidadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

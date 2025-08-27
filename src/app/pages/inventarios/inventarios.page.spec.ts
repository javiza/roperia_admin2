import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventariosPage } from './inventarios.page';

describe('InventariosPage', () => {
  let component: InventariosPage;
  let fixture: ComponentFixture<InventariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LavanderiaPage } from './lavanderia.page';

describe('LavanderiaPage', () => {
  let component: LavanderiaPage;
  let fixture: ComponentFixture<LavanderiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LavanderiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

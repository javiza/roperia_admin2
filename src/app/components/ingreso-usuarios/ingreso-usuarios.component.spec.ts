import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IngresoUsuariosComponent } from './ingreso-usuarios.component';

describe('IngresoUsuariosComponent', () => {
  let component: IngresoUsuariosComponent;
  let fixture: ComponentFixture<IngresoUsuariosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IngresoUsuariosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

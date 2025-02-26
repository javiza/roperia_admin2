import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormularioInicioComponent } from './formulario-inicio.component';

describe('FormularioInicioComponent', () => {
  let component: FormularioInicioComponent;
  let fixture: ComponentFixture<FormularioInicioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormularioInicioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

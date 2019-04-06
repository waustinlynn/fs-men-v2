import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDivisionsComponent } from './edit-divisions.component';

describe('EditDivisionsComponent', () => {
  let component: EditDivisionsComponent;
  let fixture: ComponentFixture<EditDivisionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDivisionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDivisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

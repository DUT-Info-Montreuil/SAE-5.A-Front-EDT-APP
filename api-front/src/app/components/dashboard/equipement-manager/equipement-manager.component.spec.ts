import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementManagerComponent } from './equipement-manager.component';

describe('EquipementManagerComponent', () => {
  let component: EquipementManagerComponent;
  let fixture: ComponentFixture<EquipementManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipementManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipementManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

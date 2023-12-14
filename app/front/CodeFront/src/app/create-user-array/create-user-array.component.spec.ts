import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserArrayComponent } from './create-user-array.component';

describe('CreateUserArrayComponent', () => {
  let component: CreateUserArrayComponent;
  let fixture: ComponentFixture<CreateUserArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUserArrayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUserArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

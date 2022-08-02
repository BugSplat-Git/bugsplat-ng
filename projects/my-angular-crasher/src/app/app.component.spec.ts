import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    const responseData = {} as Record<string, number>;
    responseData['crash_id'] = 99;
    const errorHandler = {
      bugsplat: {
        database: 'fred',
        files: [],
        getObservable: () => of({ responseData }),
      },
    };

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        {
          provide: ErrorHandler,
          useValue: errorHandler,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'my-angular-crasher'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('my-angular-crasher');
  });

  it('should render title in a h1 tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to my-angular-crasher!'
    );
  });
});

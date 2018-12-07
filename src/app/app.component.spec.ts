import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MyAngularErrorHandler } from './my-angular-error-handler';
import { ErrorHandler } from '../../node_modules/@angular/core';
import { BugSplatErrorHandler, BugSplatConfiguration, BugSplat, BugSplatLogger, Logger } from 'bugsplat-ng';
import { HttpClientTestingModule } from '../../node_modules/@angular/common/http/testing';

describe('DatabaseApplicationVersionSelector', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: ErrorHandler, useClass: MyAngularErrorHandler },
        { provide: BugSplatConfiguration, useValue: new BugSplatConfiguration("my-angular-crasher", "1.0.0.0", "fred") },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'my-angular-crasher'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('my-angular-crasher');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to my-angular-crasher!');
  }));
});
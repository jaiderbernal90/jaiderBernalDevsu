import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { By } from '@angular/platform-browser';
import { icon } from '../../../shared/utils/consts';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(async () => {
    const sanitizerSpy = jasmine.createSpyObj('DomSanitizer', [
      'bypassSecurityTrustHtml',
    ]);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [{ provide: DomSanitizer, useValue: sanitizerSpy }],
    }).compileComponents();

    sanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
    sanitizer.bypassSecurityTrustHtml.and.returnValue('sanitized icon');

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sanitize the icon', () => {
    expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(icon);
    expect(component.iconBank).toBe('sanitized icon');
  });

  it('should have a header element', () => {
    const headerElement = fixture.debugElement.query(By.css('header'));
    expect(headerElement).toBeTruthy();
  });

  it('should have a router link to home', () => {
    const headerElement = fixture.debugElement.query(By.css('header'));
    expect(headerElement.attributes['ng-reflect-router-link']).toBe('/');
  });

  it('should display the bank icon', () => {
    const iconElement = fixture.debugElement.query(By.css('.header-icon'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.nativeElement.innerHTML).toBe('sanitized icon');
  });

  it('should display the bank title', () => {
    const titleElement = fixture.debugElement.query(By.css('.header-title'));
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent).toBe('BANCO');
  });
});

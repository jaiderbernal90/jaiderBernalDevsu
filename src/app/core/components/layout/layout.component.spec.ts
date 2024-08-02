import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from '../header/header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA] // Esto permite que ignoremos los componentes que no están declarados, como app-header
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a main container', () => {
    const mainElement = fixture.debugElement.query(By.css('.main__container'));
    expect(mainElement).toBeTruthy();
  });

  it('should include the header component', () => {
    const headerElement = fixture.debugElement.query(By.css('app-header'));
    expect(headerElement).toBeTruthy();
  });

  it('should have a content div', () => {
    const contentElement = fixture.debugElement.query(By.css('.content'));
    expect(contentElement).toBeTruthy();
  });

  it('should include router-outlet', () => {
    const routerOutletElement = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutletElement).toBeTruthy();
  });
});

import { Component, Input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { iconMenu } from '@shared/utils/consts';

@Component({
  selector: 'app-menu-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './menu-dropdown.component.html',
  styleUrl: './menu-dropdown.component.scss',
})
export class MenuDropdownComponent {
  @Input() actions: Array<{ name: string; callback: (index:number) => void }> | undefined = [];
  @Input() rowIndex!: number;
  iconMenu: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(iconMenu);
  isOpen = signal<boolean>(false);

  constructor(private sanitizer: DomSanitizer) {}

  toggleMenu() {
    this.isOpen.set(!this.isOpen());
  }

  executeAction(callback: (index: number) => void) {
    callback(this.rowIndex);
    this.toggleMenu();
  }
}

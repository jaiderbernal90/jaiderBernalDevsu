import { Component } from '@angular/core';
import { icon } from '../../../shared/utils/consts';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  iconBank: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(icon);
  constructor(
    private sanitizer: DomSanitizer
  ){ }
}

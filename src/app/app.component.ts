import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent],
  template: `
    <app-loader></app-loader>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'devsu-jaider-bernal';
}

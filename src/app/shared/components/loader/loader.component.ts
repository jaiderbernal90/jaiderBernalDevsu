import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoaderService } from '@shared/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  standalone: true,
  imports: [AsyncPipe],
})
export class LoaderComponent implements OnInit {
  public readonly _loaderSvc = inject(LoaderService);
  isLoading = this._loaderSvc.loading();
  public ngOnInit(): void {}
}

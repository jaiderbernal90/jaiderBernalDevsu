import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  first,
} from 'rxjs/operators';
import { ProductsService } from '../services/products.service';
import { LoaderService } from '@shared/services/loader.service';

export function asyncNumberValidator(
  service: ProductsService,
  loaderSvc: LoaderService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) =>
        service.verificationId(value).pipe(
          map((isValid) => {
            loaderSvc.hide();
            return !isValid ? null : { invalidNumber: true };
          }),
          catchError(() => {
            loaderSvc.hide();
            return of(null);
          })
        )
      ),
      first()
    );
  };
}

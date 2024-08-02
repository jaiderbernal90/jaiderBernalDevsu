import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IProduct, IProductForm } from '@features/products/interfaces/IProduct';
import { JsonPipe, NgClass } from '@angular/common';
import { addDays, addYears, format } from 'date-fns';
import { ProductsService } from '@features/products/services/products.service';
import { asyncNumberValidator } from '@features/products/validators/async-number.validator';
import { LoaderService } from '@shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    SearchComponent,
    CardComponent,
    TableComponent,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    JsonPipe,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  public form!: FormGroup<IProductForm>;
  private readonly _productsSvc = inject(ProductsService);
  private readonly _loaderSvc = inject(LoaderService);
  private readonly _routerActivated = inject(ActivatedRoute);

  constructor() {}

  public ngOnInit(): void {
    this.initForm();
    this.validateEditProduct();
  }

  public onSubmit(): void {
    const id = this._productsSvc.idProduct();
    if (id) {
      this._productsSvc.update(id, this.form.value).subscribe();
      return;
    }

    this._productsSvc.create(this.form.value).subscribe();
  }

  public handleResetForm(): void {
    this.form.reset();
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl<number | null>(null, {
        validators: [
          Validators.required,
          Validators.max(9999999999),
          Validators.min(99),
        ],
        asyncValidators: [
          asyncNumberValidator(this._productsSvc, this._loaderSvc),
        ],
        updateOn: 'blur',
      }),
      name: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.maxLength(100),
          Validators.minLength(5),
        ],
      }),
      description: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(10),
        ],
      }),
      logo: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.pattern(
            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
          ),
        ],
      }),
      date_release: new FormControl<Date | null>(null, {
        validators: [Validators.required],
      }),
      date_revision: new FormControl<Date | string | null>(null, {
        validators: [Validators.required],
      }),
    });
  }

  public handleChangeDateRelease(event: Event): void {
    const target = event.target as HTMLInputElement;
    const { value } = target;
    this.form
      .get('date_revision')
      ?.setValue(
        format(addDays(addYears(new Date(value), 1), 1), 'yyyy-MM-dd')
      );
  }
  public validateEditProduct(): void {
    this._routerActivated.params.subscribe((param) => {
      const { id } = param;
      if (id) {
        this._productsSvc.idProduct.set(id);
        this._productsSvc.findOne(id).subscribe((res) => {
          this.form.patchValue(res);
        });
      }
    });
  }
}

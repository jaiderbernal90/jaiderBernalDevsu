import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { ProductsService } from '@features/products/services/products.service';
import { LoaderService } from '@shared/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IProduct } from '@features/products/interfaces/IProduct';
import { format, addYears, addDays } from 'date-fns';
import { IResponseApi } from '@shared/interfaces/IResponseApi';
import { signal, Signal } from '@angular/core';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const productsSpy = jasmine.createSpyObj('ProductsService', ['create', 'update', 'findOne'], {
      idProduct: signal<number | undefined>(undefined)
    });

    const loaderSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], { params: of({}) });

    await TestBed.configureTestingModule({
      imports: [AddProductComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductsService, useValue: productsSpy },
        { provide: LoaderService, useValue: loaderSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    productsServiceSpy = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    loaderServiceSpy = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    activatedRouteSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('id')).toBeDefined();
    expect(component.form.get('name')).toBeDefined();
    expect(component.form.get('description')).toBeDefined();
    expect(component.form.get('logo')).toBeDefined();
    expect(component.form.get('date_release')).toBeDefined();
    expect(component.form.get('date_revision')).toBeDefined();
  });

  it('should call create method when submitting a new product', () => {
    const mockProduct: IProduct = {
      id: 123,
      name: 'Test Product',
      description: 'Test Description',
      logo: 'http://test.com/logo.png',
      date_release: new Date(),
      date_revision: new Date()
    };

    const mockResponse: IResponseApi<IProduct> = {
      data: mockProduct,
      message: 'Product created successfully'
    };

    productsServiceSpy.idProduct.set(undefined);
    productsServiceSpy.create.and.returnValue(of(mockResponse));

    component.form.patchValue(mockProduct);
    component.onSubmit();

    expect(productsServiceSpy.create).toHaveBeenCalledWith(jasmine.objectContaining(mockProduct));
  });

  it('should call update method when submitting an existing product', () => {
    const mockId = 123;
    const mockProduct: IProduct = {
      id: mockId,
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'http://test.com/updated-logo.png',
      date_release: new Date(),
      date_revision: new Date()
    };

    const mockResponse: IResponseApi<IProduct[]> = {
      data: [mockProduct],
      message: 'Product updated successfully'
    };

    productsServiceSpy.idProduct.set(mockId);
    productsServiceSpy.update.and.returnValue(of(mockResponse));

    component.form.patchValue(mockProduct);
    component.onSubmit();

    expect(productsServiceSpy.update).toHaveBeenCalledWith(mockId, jasmine.objectContaining(mockProduct));
  });

  it('should load product data when editing an existing product', fakeAsync(() => {
    const mockId = 123;
    const mockProduct: IProduct = {
      id: 123,
      name: 'Existing Product',
      description: 'Existing Description',
      logo: 'http://test.com/existing-logo.png',
      date_release: new Date(),
      date_revision: new Date()
    };

    activatedRouteSpy.params = of({ id: mockId });
    productsServiceSpy.idProduct.set(mockId);
    productsServiceSpy.findOne.and.returnValue(of(mockProduct));

    component.ngOnInit();
    tick();
  }));

  it('should reset the form when handleResetForm is called', () => {
    spyOn(component.form, 'reset');
    component.handleResetForm();
    expect(component.form.reset).toHaveBeenCalled();
  });

  it('should update date_revision when date_release changes', () => {
    const mockDate = new Date('2023-01-01');
    const expectedRevisionDate = format(addDays(addYears(mockDate, 1), 1), 'yyyy-MM-dd');

    const mockEvent = { target: { value: mockDate.toISOString().split('T')[0] } } as any;
    component.handleChangeDateRelease(mockEvent);

    expect(component.form.get('date_revision')?.value).toBe(expectedRevisionDate);
  });

  it('should load product data when editing an existing product', fakeAsync(() => {
    const mockId = 123;
    const mockProduct: IProduct = {
      id: 123,
      name: 'Existing Product',
      description: 'Existing Description',
      logo: 'http://test.com/existing-logo.png',
      date_release: new Date(),
      date_revision: new Date()
    };

    activatedRouteSpy.params = of({ id: mockId });
    productsServiceSpy.findOne.and.returnValue(of(mockProduct));

    component.ngOnInit();
    tick();
  }));
});

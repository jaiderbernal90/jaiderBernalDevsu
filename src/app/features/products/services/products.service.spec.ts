import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductsService } from './products.service';
import { ApiProductsService } from '@api/products.service';
import { LoaderService } from '@shared/services/loader.service';
import { DataTransformationService } from './data-transformation.service';
import { RouteService } from './route.service';
import { ModalService } from '@shared/services/modal.service';
import { PaginationService } from '@shared/services/pagination.service';
import { of, throwError } from 'rxjs';
import { IResponseApi } from '@shared/interfaces/IResponseApi';
import { IProduct, IProductForTable } from '../interfaces/IProduct';
import { signal, Signal, WritableSignal } from '@angular/core';
const mockProducts: IProduct[] = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description 1',
    logo: 'logo1.png',
    date_release: new Date('2023-01-01'),
    date_revision: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Description 2',
    logo: 'logo2.png',
    date_release: new Date('2023-02-01'),
    date_revision: new Date('2024-02-01'),
  },
];
describe('ProductsService', () => {
  let service: ProductsService;
  let apiProductsServiceSpy: jasmine.SpyObj<ApiProductsService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let dataTransformationServiceSpy: jasmine.SpyObj<DataTransformationService>;
  let routeServiceSpy: jasmine.SpyObj<RouteService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;
  let paginationServiceSpy: jasmine.SpyObj<
    PaginationService<IProductForTable[]>
  >;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiProductsService', [
      'findAll',
      'findOne',
      'create',
      'update',
      'delete',
      'verificationId',
    ]);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    const dataTransformSpy = jasmine.createSpyObj('DataTransformationService', [
      'transformProductsToTableData',
    ]);
    const routeSpy = jasmine.createSpyObj('RouteService', [
      'navigateToHome',
      'navigateToEditProduct',
    ]);
    const modalSpy = jasmine.createSpyObj('ModalService', [
      'openConfirmDialog',
    ]);
    const paginationSpy = jasmine.createSpyObj('PaginationService', [
      'getPaginatedData',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        { provide: ApiProductsService, useValue: apiSpy },
        { provide: LoaderService, useValue: loaderSpy },
        { provide: DataTransformationService, useValue: dataTransformSpy },
        { provide: RouteService, useValue: routeSpy },
        { provide: ModalService, useValue: modalSpy },
        { provide: PaginationService, useValue: paginationSpy },
      ],
    });

    service = TestBed.inject(ProductsService);
    apiProductsServiceSpy = TestBed.inject(
      ApiProductsService
    ) as jasmine.SpyObj<ApiProductsService>;
    loaderServiceSpy = TestBed.inject(
      LoaderService
    ) as jasmine.SpyObj<LoaderService>;
    dataTransformationServiceSpy = TestBed.inject(
      DataTransformationService
    ) as jasmine.SpyObj<DataTransformationService>;
    routeServiceSpy = TestBed.inject(
      RouteService
    ) as jasmine.SpyObj<RouteService>;
    modalServiceSpy = TestBed.inject(
      ModalService
    ) as jasmine.SpyObj<ModalService>;
    paginationServiceSpy = TestBed.inject(PaginationService) as jasmine.SpyObj<
      PaginationService<IProductForTable[]>
    >;

    // Initialize signals
    service.products = signal<IProductForTable[]>(mockProducts);
    service.idProduct = signal<number | undefined>(undefined);
    service.idValid = signal<boolean>(false);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('findAll', () => {
    it('should fetch all products and update signals', () => {
      const mockResponse: IResponseApi<IProduct[]> = {
        data: mockProducts,
        message: 'Success',
      };
      apiProductsServiceSpy.findAll.and.returnValue(of(mockResponse));
      expect(service.products()).toEqual(mockProducts);
    });
  });

  describe('create', () => {
    it('should create a product and navigate to home', fakeAsync(() => {
      const mockProduct: Partial<IProduct> = {
        id: 1,
        name: 'New Product',
        description: 'Description',
        logo: 'logo.png',
        date_release: new Date(),
        date_revision: new Date(),
      };

      const mockResponse: IResponseApi<IProduct> = {
        data: mockProduct as IProduct,
        message: 'Product created',
      };

      apiProductsServiceSpy.create.and.returnValue(of(mockResponse));
      spyOn(window, 'alert');

      service.create(mockProduct).subscribe();
      tick();

      expect(loaderServiceSpy.show).toHaveBeenCalled();
      expect(loaderServiceSpy.hide).toHaveBeenCalled();
      expect(routeServiceSpy.navigateToHome).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Product created');
      expect(service.idProduct()).toBeUndefined();
    }));
  });

  describe('delete', () => {
    it('should delete a product and refresh the list', (done) => {
      const productId = 1;
      const mockResponse = { message: 'Product deleted' };
      apiProductsServiceSpy.delete.and.returnValue(of(mockResponse));
      spyOn(window, 'alert');
      spyOn(service, 'findAll').and.returnValue(
        of({ data: [], message: 'Success' })
      );

      service.delete(productId).subscribe(() => {
        expect(window.alert).toHaveBeenCalledWith('Product deleted');
        expect(service.findAll).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('editItem', () => {
    it('should navigate to edit product page', () => {
      const index = 0;
      const mockProducts = [{ id: 1, name: 'Product 1' }];
      service.products.set(mockProducts as any);

      service.editItem(index);

      expect(routeServiceSpy.navigateToEditProduct).toHaveBeenCalledWith(1);
    });
  });

  describe('verificationId', () => {
    it('should verify ID and update idValid signal', fakeAsync(() => {
      const mockId = 123;
      apiProductsServiceSpy.verificationId.and.returnValue(of(true));

      service.verificationId(mockId).subscribe();
      tick();

      expect(service.idValid()).toBe(true);
    }));
  });
});

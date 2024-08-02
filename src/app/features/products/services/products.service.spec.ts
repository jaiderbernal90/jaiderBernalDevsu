import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';
import { ApiProductsService } from '@api/products.service';
import { LoaderService } from '@shared/services/loader.service';
import { DataTransformationService } from './data-transformation.service';
import { RouteService } from './route.service';
import { of, throwError } from 'rxjs';
import { IProduct, IProductForTable } from '../interfaces/IProduct';
import { IResponseApi } from '@interfaces/IResponseApi';

describe('ProductsService', () => {
  let service: ProductsService;
  let apiProductsServiceSpy: jasmine.SpyObj<ApiProductsService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let dataTransformationServiceSpy: jasmine.SpyObj<DataTransformationService>;
  let routeServiceSpy: jasmine.SpyObj<RouteService>;

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
    const dataTransformationSpy = jasmine.createSpyObj(
      'DataTransformationService',
      ['transformProductsToTableData']
    );
    const routeSpy = jasmine.createSpyObj('RouteService', [
      'navigateToHome',
      'navigateToEditProduct',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        { provide: ApiProductsService, useValue: apiSpy },
        { provide: LoaderService, useValue: loaderSpy },
        { provide: DataTransformationService, useValue: dataTransformationSpy },
        { provide: RouteService, useValue: routeSpy },
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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and transform products on findAll', () => {
    const mockResponse: IResponseApi<IProduct[]> = {
      data: [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          date_release: new Date('2023-01-01'),
          date_revision: new Date('2023-01-10'),
          logo: 'logo1.png',
        },
      ],
      message: 'Product found',
    };
    const transformedData: IProductForTable[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        date_release: '01/01/2023',
        date_revision: '10/01/2023',
        logo: '<img src="logo1.png" alt="Logo">',
      },
    ];

    apiProductsServiceSpy.findAll.and.returnValue(of(mockResponse));
    dataTransformationServiceSpy.transformProductsToTableData.and.returnValue(
      transformedData
    );

    service.findAll().subscribe(() => {
      expect(service.products()).toEqual(transformedData);
    });

    expect(apiProductsServiceSpy.findAll).toHaveBeenCalled();
    expect(
      dataTransformationServiceSpy.transformProductsToTableData
    ).toHaveBeenCalledWith(mockResponse?.data || []);
  });

  it('should handle errors on findAll', () => {
    const errorResponse = new Error('Error fetching products');
    apiProductsServiceSpy.findAll.and.returnValue(throwError(errorResponse));

    service.findAll().subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
      },
    });

    expect(apiProductsServiceSpy.findAll).toHaveBeenCalled();
  });

  it('should set product on findOne', () => {
    const mockProduct: IProduct = {
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
      date_release: new Date('2023-01-01'),
      date_revision: new Date('2023-01-01'),
      logo: 'logo1.png',
    };
    apiProductsServiceSpy.findOne.and.returnValue(of(mockProduct));

    service.findOne(1).subscribe(() => {
      expect(service.product()).toEqual(mockProduct);
    });

    expect(apiProductsServiceSpy.findOne).toHaveBeenCalledWith(1);
  });

  it('should handle errors on findOne', () => {
    const errorResponse = new Error('Error fetching product');
    apiProductsServiceSpy.findOne.and.returnValue(throwError(errorResponse));

    service.findOne(1).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
      },
    });

    expect(apiProductsServiceSpy.findOne).toHaveBeenCalledWith(1);
  });

  it('should create product and navigate to home', () => {
    const mockResponse: IResponseApi<IProduct> = {
      data: {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        date_release: new Date('2023-01-01'),
        date_revision: new Date('2023-01-10'),
        logo: 'logo1.png',
      },
      message: 'Product created',
    };
    apiProductsServiceSpy.create.and.returnValue(of(mockResponse));

    service.create({ name: 'Product 1' }).subscribe(() => {
      expect(loaderServiceSpy.show).toHaveBeenCalled();
      expect(loaderServiceSpy.hide).toHaveBeenCalled();
      expect(service.idProduct()).toBeUndefined();
      expect(routeServiceSpy.navigateToHome).toHaveBeenCalled();
    });

    expect(apiProductsServiceSpy.create).toHaveBeenCalledWith({
      name: 'Product 1',
    });
  });

  it('should handle errors on create', () => {
    const errorResponse = new Error('Error creating product');
    apiProductsServiceSpy.create.and.returnValue(throwError(errorResponse));

    service.create({ name: 'Product 1' }).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
        expect(loaderServiceSpy.show).toHaveBeenCalled();
        expect(loaderServiceSpy.hide).toHaveBeenCalled();
      },
    });

    expect(apiProductsServiceSpy.create).toHaveBeenCalledWith({
      name: 'Product 1',
    });
  });

  it('should update product and navigate to home', () => {
    const mockResponse: IResponseApi<IProduct[]> = {
      data: [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          date_release: new Date('2023-01-01'),
          date_revision: new Date('2023-01-10'),
          logo: 'logo1.png',
        },
      ],
      message: 'Product updated',
    };
    apiProductsServiceSpy.update.and.returnValue(of(mockResponse));

    service.update(1, { name: 'Updated Product' }).subscribe(() => {
      expect(loaderServiceSpy.show).toHaveBeenCalled();
      expect(loaderServiceSpy.hide).toHaveBeenCalled();
      expect(service.idProduct()).toBeUndefined();
      expect(routeServiceSpy.navigateToHome).toHaveBeenCalled();
    });

    expect(apiProductsServiceSpy.update).toHaveBeenCalledWith(1, {
      name: 'Updated Product',
    });
  });

  it('should handle errors on update', () => {
    const errorResponse = new Error('Error updating product');
    apiProductsServiceSpy.update.and.returnValue(throwError(errorResponse));

    service.update(1, { name: 'Updated Product' }).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
        expect(loaderServiceSpy.show).toHaveBeenCalled();
        expect(loaderServiceSpy.hide).toHaveBeenCalled();
      },
    });

    expect(apiProductsServiceSpy.update).toHaveBeenCalledWith(1, {
      name: 'Updated Product',
    });
  });

  it('should delete product', () => {
    const mockResponse: IResponseApi<IProduct[]> = {
      data: [],
      message: 'Product deleted',
    };
    apiProductsServiceSpy.delete.and.returnValue(of(mockResponse));

    service.delete().subscribe(() => {
      expect(service.products()).toEqual([]);
    });

    expect(apiProductsServiceSpy.delete).toHaveBeenCalled();
  });

  it('should handle errors on delete', () => {
    const errorResponse = new Error('Error deleting product');
    apiProductsServiceSpy.delete.and.returnValue(throwError(errorResponse));

    service.delete().subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
      },
    });

    expect(apiProductsServiceSpy.delete).toHaveBeenCalled();
  });

  it('should verify ID', () => {
    apiProductsServiceSpy.verificationId.and.returnValue(of(true));

    service.verificationId(1).subscribe((isValid) => {
      expect(service.idValid()).toBeTrue();
      expect(isValid).toBeTrue();
    });

    expect(apiProductsServiceSpy.verificationId).toHaveBeenCalledWith(1);
  });

  it('should handle errors on verificationId', () => {
    const errorResponse = new Error('Error verifying ID');
    apiProductsServiceSpy.verificationId.and.returnValue(
      throwError(errorResponse)
    );

    service.verificationId(1).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
      },
    });
    expect(apiProductsServiceSpy.verificationId).toHaveBeenCalledWith(1);
  });
});

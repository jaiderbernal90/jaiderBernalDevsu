import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '@envs/environment';
import { ErrorHandlerService } from '@shared/services/error-handler.service';
import {
  IProduct,
  IProductForTable,
} from '@features/products/interfaces/IProduct';
import { IResponseApi } from '@interfaces/IResponseApi';
import { ApiProductsService } from './products.service';
import { throwError } from 'rxjs';

describe('ApiProductsService', () => {
  let service: ApiProductsService;
  let httpMock: HttpTestingController;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiProductsService,
        { provide: ErrorHandlerService, useValue: spy },
      ],
    });

    service = TestBed.inject(ApiProductsService);
    httpMock = TestBed.inject(HttpTestingController);
    errorHandlerSpy = TestBed.inject(
      ErrorHandlerService
    ) as jasmine.SpyObj<ErrorHandlerService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('findAll', () => {
    it('should return an Observable<IResponseApi<IProduct[]>>', () => {
      const mockResponse: IResponseApi<IProduct[]> = {
        data: [
          {
            id: 1,
            name: 'Product 1',
            description: 'Description 1',
            logo: 'logo1.png',
            date_release: new Date(),
            date_revision: new Date(),
          },
        ],
        message: 'Products fetched successfully',
      };

      service.findAll().subscribe((response: IResponseApi<IProduct[]>) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.serveURI}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return an Observable<IProduct>', () => {
      const mockProduct: IProduct = {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        logo: 'logo1.png',
        date_release: new Date(),
        date_revision: new Date(),
      };

      service.findOne(1).subscribe((product: IProduct) => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${environment.serveURI}/products/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('create', () => {
    it('should return an Observable<IResponseApi<IProduct>>', () => {
      const mockProduct: Partial<IProductForTable> = {
        name: 'New Product',
        description: 'New Description',
      };
      const mockResponse: IResponseApi<IProduct> = {
        data: {
          ...mockProduct,
          id: 1,
          logo: 'logo.png',
          date_release: new Date(),
          date_revision: new Date(),
        } as IProduct,
        message: 'Product created successfully',
      };

      service.create(mockProduct).subscribe((response: IResponseApi<IProduct>) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.serveURI}/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should return an Observable<IResponseApi<IProduct[]>>', () => {
      const mockProduct: Partial<IProductForTable> = {
        name: 'Updated Product',
        description: 'Updated Description',
      };
      const mockResponse: IResponseApi<IProduct[]> = {
        data: [
          {
            ...mockProduct,
            id: 1,
            logo: 'logo.png',
            date_release: new Date(),
            date_revision: new Date(),
          } as IProduct,
        ],
        message: 'Product updated successfully',
      };

      service.update(1, mockProduct).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.serveURI}/products/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should return an Observable<IResponseApi<IProduct>>', () => {
      const mockResponse: IResponseApi<IProduct> = {
        data: {
          id: 1,
          name: 'Deleted Product',
          description: 'Deleted Description',
          logo: 'logo.png',
          date_release: new Date(),
          date_revision: new Date(),
        },
        message: 'Product deleted successfully',
      };

      service.delete(1).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.serveURI}/products/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('verificationId', () => {
    it('should return an Observable<boolean>', () => {
      const mockResponse = true;

      service.verificationId(1).subscribe((response) => {
        expect(response).toBe(true);
      });

      const req = httpMock.expectOne(
        `${environment.serveURI}/products/verification/1`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  // Test error handling
  it('should handle errors', (done) => {
    const errorResponse = new Error('Test error');
    errorHandlerSpy.handleError.and.returnValue(throwError(() => errorResponse));

    service.findAll().subscribe({
      next: () => fail('should have failed with the error'),
      error: (error) => {
        expect(error).toBe(errorResponse);
        expect(errorHandlerSpy.handleError).toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne(`${environment.serveURI}/products`);
    req.error(new ErrorEvent('Network error', {
      message: 'simulated network error',
    }));
  });
});

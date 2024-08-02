import { TestBed } from '@angular/core/testing';
import { DataTransformationService } from './data-transformation.service';
import { SharedService } from '@shared/services/shared.service';
import { DatePipe } from '@angular/common';
import { IProduct, IProductForTable } from '../interfaces/IProduct';

describe('DataTransformationService', () => {
  let service: DataTransformationService;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SharedService', ['getInitials']);

    TestBed.configureTestingModule({
      providers: [
        DataTransformationService,
        DatePipe,
        { provide: SharedService, useValue: spy },
      ],
    });

    service = TestBed.inject(DataTransformationService);
    sharedServiceSpy = TestBed.inject(SharedService) as jasmine.SpyObj<SharedService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform products to table data', () => {
    const mockProducts: IProductForTable[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        date_release: '2023-01-01',
        date_revision: '2023-01-10',
        logo: 'logo1.png',
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        date_release: '2023-02-01',
        date_revision: '2023-02-10',
        logo: '',
      },
    ];

    sharedServiceSpy.getInitials.and.returnValue('P2');

    const expectedTransformedProducts = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        date_release: '01/01/2023',
        date_revision: '10/01/2023',
        logo: `<img src="logo1.png" alt="Logo">`,
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        date_release: '01/02/2023',
        date_revision: '10/02/2023',
        logo: 'P2',
      },
    ];

    const transformedProducts = service.transformProductsToTableData(mockProducts);

    expect(transformedProducts).toEqual(expectedTransformedProducts);
    expect(sharedServiceSpy.getInitials).toHaveBeenCalledWith('Product 2');
  });

  it('should handle products without logos', () => {
    const mockProducts: IProductForTable[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        date_release: '2023-01-01',
        date_revision: '2023-01-10',
        logo: '',
      },
    ];

    sharedServiceSpy.getInitials.and.returnValue('P1');

    const expectedTransformedProduct = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        date_release: '01/01/2023',
        date_revision: '10/01/2023',
        logo: 'P1',
      },
    ];

    const transformedProduct = service.transformProductsToTableData(mockProducts);

    expect(transformedProduct).toEqual(expectedTransformedProduct);
    expect(sharedServiceSpy.getInitials).toHaveBeenCalledWith('Product 1');
  });

  it('should handle empty product array', () => {
    const transformedProducts = service.transformProductsToTableData([]);
    expect(transformedProducts).toEqual([]);
  });
});

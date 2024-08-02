import { TestBed } from '@angular/core/testing';
import { DataTransformationService } from './data-transformation.service';
import { SharedService } from '@shared/services/shared.service';
import { DatePipe } from '@angular/common';
import { IProduct, IProductForTable } from '../interfaces/IProduct';

describe('DataTransformationService', () => {
  let service: DataTransformationService;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let datePipe: DatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataTransformationService,
        {
          provide: SharedService,
          useValue: jasmine.createSpyObj('SharedService', ['getInitials']),
        },
        DatePipe, // Make sure DatePipe is provided here if it's used in the service
      ],
    });

    service = TestBed.inject(DataTransformationService);
    sharedServiceSpy = TestBed.inject(
      SharedService
    ) as jasmine.SpyObj<SharedService>;
    datePipe = TestBed.inject(DatePipe); // Ensure DatePipe is available
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
        date_release: '09/02/2023', // Ensure the dates are in a format DatePipe can handle
        date_revision: '09/02/2023',
        logo: 'logo1.png',
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        date_release: '09/02/2023',
        date_revision: '09/02/2023',
        logo: '',
      },
    ];

    sharedServiceSpy.getInitials.and.returnValue('P2');

    const transformedProducts =
      service.transformProductsToTableData(mockProducts);

    expect(transformedProducts[0].date_release).toBe(
      datePipe.transform('09/02/2023', 'dd/MM/yyyy')
    );
    expect(transformedProducts[0].date_revision).toBe(
      datePipe.transform('09/02/2023', 'dd/MM/yyyy')
    );
    expect(transformedProducts[1].date_release).toBe(
      datePipe.transform('09/02/2023', 'dd/MM/yyyy')
    );
    expect(transformedProducts[1].date_revision).toBe(
      datePipe.transform('09/02/2023', 'dd/MM/yyyy')
    );

    expect(transformedProducts[0].logo).toBe(
      '<img src="logo1.png" alt="Logo">'
    );
    expect(transformedProducts[1].logo).toBe('P2');

    expect(sharedServiceSpy.getInitials).toHaveBeenCalledWith('Product 2');
  });

  it('should handle products without logos', () => {
    const mockProducts: IProductForTable[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        date_release: '2023/01/01',
        date_revision: '2023/01/10',
        logo: '',
      },
    ];

    sharedServiceSpy.getInitials.and.returnValue('P1');

    const transformedProduct =
      service.transformProductsToTableData(mockProducts);
    expect(transformedProduct[0].logo).toBe('P1');

    expect(sharedServiceSpy.getInitials).toHaveBeenCalledWith('Product 1');
  });

  it('should handle empty product array', () => {
    const transformedProducts = service.transformProductsToTableData([]);
    expect(transformedProducts).toEqual([]);
  });
});

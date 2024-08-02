import { TestBed } from '@angular/core/testing';

import { PaginationService } from './pagination.service';
import { IProductForTable } from '@features/products/interfaces/IProduct';

describe('PaginationService', () => {
  let service: PaginationService<IProductForTable[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { DomSanitizer } from '@angular/platform-browser';
import { PaginationService } from '@shared/services/pagination.service';
import { ProductsService } from '@features/products/services/products.service';
import { ModalService } from '@shared/services/modal.service';
import { NgClass } from '@angular/common';
import { MenuDropdownComponent } from '../menu-dropdown/menu-dropdown.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { IHeader } from '../../interfaces/ITable';
import { of } from 'rxjs';
import { IProductForTable } from '@features/products/interfaces/IProduct';
import { signal } from '@angular/core';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let paginationServiceSpy: jasmine.SpyObj<PaginationService<IProductForTable[]>>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    const paginationSpy = jasmine.createSpyObj('PaginationService', ['setItemsPerPage', 'setPage'], {
      currentPage: 1,
      itemsPerPage: 10
    });
    const productsSpy = jasmine.createSpyObj('ProductsService', [], {
      products: signal([])
    });
    const modalSpy = jasmine.createSpyObj('ModalService', ['showConfirmDialog']);

    await TestBed.configureTestingModule({
      imports: [
        TableComponent,
        NgClass,
        MenuDropdownComponent,
        ConfirmationModalComponent
      ],
      providers: [
        { provide: PaginationService, useValue: paginationSpy },
        { provide: ProductsService, useValue: productsSpy },
        { provide: ModalService, useValue: modalSpy },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val,
          },
        },
      ]
    }).compileComponents();

    paginationServiceSpy = TestBed.inject(PaginationService) as jasmine.SpyObj<PaginationService<IProductForTable[]>>;
    productsServiceSpy = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    modalServiceSpy = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render table when items are provided', () => {
    component.items = [{ id: 1, name: 'Test' }];
    component.headers = [{ key: 'name', value: 'Name' }];
    fixture.detectChanges();
    const tableElement = fixture.nativeElement.querySelector('table');
    expect(tableElement).toBeTruthy();
  });

  it('should render "No hay datos" when items are empty', () => {
    component.items = [];
    fixture.detectChanges();
    const noDataElement = fixture.nativeElement.querySelector('p');
    expect(noDataElement.textContent).toContain('No hay datos');
  });

  it('should call setItemsPerPage when limit changes', () => {
    const event = { target: { value: '10' } } as unknown as Event;
    component.onChangeLimit(event);
    expect(paginationServiceSpy.setItemsPerPage).toHaveBeenCalledWith(10);
  });

  it('should emit onChangeItemsPerPage when limit changes', () => {
    spyOn(component.onChangeItemsPerPage, 'emit');
    const event = { target: { value: '10' } } as unknown as Event;
    component.onChangeLimit(event);
    expect(component.onChangeItemsPerPage.emit).toHaveBeenCalledWith(10);
  });

  it('should call setPage with decreased page number when prevPage is called', () => {
    paginationServiceSpy.setPage(1);
    component.prevPage();
    expect(paginationServiceSpy.setPage).toHaveBeenCalledWith(1);
  });

  it('should call setPage with increased page number when nextPage is called', () => {
    paginationServiceSpy.setPage(2);
    component.nextPage();
    expect(paginationServiceSpy.setPage).toHaveBeenCalledWith(2);
  });

  it('should emit onPageChange when prevPage is called', () => {
    spyOn(component.onPageChange, 'emit');
    component.prevPage();
    expect(component.onPageChange.emit).toHaveBeenCalledWith(true);
  });

  it('should emit onPageChange when nextPage is called', () => {
    spyOn(component.onPageChange, 'emit');
    component.nextPage();
    expect(component.onPageChange.emit).toHaveBeenCalledWith(true);
  });
});

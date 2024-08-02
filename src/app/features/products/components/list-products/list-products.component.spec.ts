import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListProductsComponent } from './list-products.component';
import { ProductsService } from '@features/products/services/products.service';
import { ApiProductsService } from '@api/products.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoaderService } from '@shared/services/loader.service';
import { DataTransformationService } from '@features/products/services/data-transformation.service';
import { RouteService } from '@features/products/services/route.service';
import { ModalService } from '@shared/services/modal.service';
import { PaginationService } from '@shared/services/pagination.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ListProductsComponent', () => {
  let component: ListProductsComponent;
  let fixture: ComponentFixture<ListProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListProductsComponent, HttpClientTestingModule],
      providers: [
        ProductsService,
        ApiProductsService,
        LoaderService,
        DataTransformationService,
        RouteService,
        ModalService,
        PaginationService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ListProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

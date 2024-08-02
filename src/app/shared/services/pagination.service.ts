import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  public currentPage = 1;
  public itemsPerPage = 5;

  constructor() {}

  public getPaginatedData<T>(data: T[]): T[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    return data.slice(start, end);
  }

  public setPage(page: number): void {
    this.currentPage = page;
  }

  public setItemsPerPage(items: number): void {
    this.itemsPerPage = items;
  }
}

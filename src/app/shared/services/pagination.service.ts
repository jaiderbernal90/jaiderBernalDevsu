import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService<T> {
  private currentPageSignal: WritableSignal<number> = signal(1);
  private itemsPerPageSignal: WritableSignal<number> = signal(5);
  public paginatedData = signal<T[]>([]);

  constructor() {}

  public get currentPage(): number {
    return this.currentPageSignal();
  }

  public get itemsPerPage(): number {
    return this.itemsPerPageSignal();
  }

  public getPaginatedData(data: T[]): T[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    return data.slice(start, end);
  }

  public updatePaginatedData(data: T[]): void {
    this.paginatedData.set(this.getPaginatedData(data));
  }

  public setPage(page: number): void {
    this.currentPageSignal.set(page);
  }

  public setItemsPerPage(items: number): void {
    this.itemsPerPageSignal.set(items);
  }

  public getTotalPages(totalItems: number): number {
    return Math.ceil(totalItems / this.itemsPerPage);
  }

  public hasNextPage(totalItems: number): boolean {
    return this.currentPage < this.getTotalPages(totalItems);
  }

  public hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }
}

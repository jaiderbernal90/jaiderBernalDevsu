import { Pipe, PipeTransform } from '@angular/core';
import { IProductForTable } from '../interfaces/IProduct';

@Pipe({
  name: 'filterProducts',
  standalone: true,
})
export class FilterProductsPipe implements PipeTransform {
  transform(items: IProductForTable[], searchText: string): IProductForTable[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter((item) => {
      return (
        item?.name?.toLowerCase().includes(searchText) ||
        item?.description?.toLowerCase().includes(searchText)
      );
    });
  }
}

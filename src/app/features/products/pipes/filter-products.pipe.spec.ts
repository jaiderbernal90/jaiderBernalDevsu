import { FilterProductsPipe } from './filter-products.pipe';
import { IProductForTable } from '../interfaces/IProduct';

describe('FilterProductsPipe', () => {
  let pipe: FilterProductsPipe;

  beforeEach(() => {
    pipe = new FilterProductsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty array when items is null or undefined', () => {
    expect(pipe.transform(null as any, 'test')).toEqual([]);
    expect(pipe.transform(undefined as any, 'test')).toEqual([]);
  });

  it('should return all items when searchText is empty', () => {
    const items: IProductForTable[] = [
      { id: 1, name: 'Product 1', description: 'Description 1' },
      { id: 2, name: 'Product 2', description: 'Description 2' },
    ];
    expect(pipe.transform(items, '')).toEqual(items);
  });

  it('should filter items based on name', () => {
    const items: IProductForTable[] = [
      { id: 1, name: 'Apple', description: 'Fruit' },
      { id: 2, name: 'Banana', description: 'Fruit' },
      { id: 3, name: 'Orange', description: 'Fruit' },
    ];
    const filtered = pipe.transform(items, 'ban');
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Banana');
  });

  it('should filter items based on description', () => {
    const items: IProductForTable[] = [
      { id: 1, name: 'Apple', description: 'Red fruit' },
      { id: 2, name: 'Banana', description: 'Yellow fruit' },
      { id: 3, name: 'Orange', description: 'Orange fruit' },
    ];
    const filtered = pipe.transform(items, 'yellow');
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Banana');
  });

  it('should be case insensitive', () => {
    const items: IProductForTable[] = [
      { id: 1, name: 'Apple', description: 'Red fruit' },
      { id: 2, name: 'BANANA', description: 'Yellow fruit' },
      { id: 3, name: 'Orange', description: 'Orange fruit' },
    ];
    const filtered = pipe.transform(items, 'bAnAnA');
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('BANANA');
  });

  it('should handle items with null or undefined properties', () => {
    const items: IProductForTable[] = [
      { id: 1, name: null, description: 'Description' },
      { id: 2, name: 'Name', description: undefined },
      { id: 3, name: 'Complete', description: 'Item' },
    ];
    expect(pipe.transform(items, 'complete')).toEqual([items[2]]);
    expect(pipe.transform(items, 'description')).toEqual([items[0]]);
  });
});

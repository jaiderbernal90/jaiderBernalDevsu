import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}
  public getInitials(str: string): string {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  }
}

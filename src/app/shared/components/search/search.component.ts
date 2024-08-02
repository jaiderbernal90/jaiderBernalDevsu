import { Component, output } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  onSearchChange = output<string>();

  public handleBlur(event: Event){
    const inputElement = event?.target as HTMLInputElement;
    if(!inputElement.value){
      this.onSearchChange.emit('');
      return
    }
    this.onSearchChange.emit(inputElement.value);
  }
}

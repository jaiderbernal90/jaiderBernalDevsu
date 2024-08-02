import { FormControl } from "@angular/forms";

export interface IProduct {
  id: number;
  name: string;
  description: string;
  logo: string;
  date_release: Date;
  date_revision: Date;
}

export interface IProductForTable  {
  id?: number | null;
  name?: string | null;
  description?: string | null;
  logo?: string | null;
  date_release?: Date | string | null;
  date_revision?: Date | string | null;
}

export interface IProductForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  logo:  FormControl<string | null>;
  date_release: FormControl<Date | null>;
  date_revision: FormControl<Date | string | null>;
}

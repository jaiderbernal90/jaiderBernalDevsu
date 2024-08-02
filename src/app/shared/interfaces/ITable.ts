export interface IHeader {
  key:string;
  value:string;
  iconInformation?:boolean;
  class?:string;
  type?:string;
  actions?:Array<{ name: string; callback: (index:number) => void }>;
}

export type GenericObject = { [key: string]: any };

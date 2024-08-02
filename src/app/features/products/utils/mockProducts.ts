import { IProduct } from "../interfaces/IProduct";

export const mockProducts:IProduct[] = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description 1',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
    date_release: new Date('2020-07-10 15:00:00.000'),
    date_revision: new Date('2020-07-10 15:00:00.000'),
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Description 2',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
    date_release: new Date('2020-07-10 15:00:00.000'),
    date_revision: new Date('2020-07-10 15:00:00.000'),
  },
];

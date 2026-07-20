import type { Product, ProductData } from '../types/product';

export const products: Product[] = [
  {
    id: 'camera',
    categoryId: 'cameras',
    name: 'Camera',
    basePrice: 25,
    compareAtPrice: 30,
    variants: [
      { id: 'white', label: 'White', image: '/white.png' },
      { id: 'black', label: 'Black', image: '/black.png' },
    ],
  },
  {
    id: 'sensor',
    categoryId: 'sensors',
    name: 'Sensor',
    basePrice: 10,
    variants: [{ id: 'default', label: 'Default', image: '/sensor.png' }],
  },
];

export const productData: ProductData = {
  products,
  initialCart: {
    camera_white: 2,
    sensor_default: 1,
  },
};
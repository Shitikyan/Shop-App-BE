export enum ValidProductTypes {
  WOMEN = 'women',
  MEN = 'men',
  KID = 'kid',
}

export enum ValidProductSizes {
  S = 'S',
  M = 'M',
  L = 'L',
  X = 'X',
  XL = 'XL',
}

export enum ValidProductColors {
  RED = 'Red',
  BLUE = 'Blue',
  BLACK = 'Black',
  WHITE = 'White',
  PURPLE = 'Purple',
  PINK = 'Pink',
  GREEN = 'Green',
  BROWN = 'Brown',
}

export enum ValidProductBrands {
  NIKE = 'Nike',
  CONVERSE = 'Converse',
}

export enum SortOrderValues {
  DESC = 'desc',
  asc = 'asc',
}

export const validProductTypes = Object.values(ValidProductTypes);
export const validProductSizes = Object.values(ValidProductSizes);
export const validProductColors = Object.values(ValidProductColors);
export const validProductBrands = Object.values(ValidProductBrands);
export const sortOrderValues = Object.values(SortOrderValues);

export type Options = {
  id: number;
  name: string;
};

export type OptionsSort = Options & { value: string; order: string };

export const For = [
  { id: 1, name: "Sell" },
  { id: 2, name: "Rent" },
];

export const Type = [
  { id: 1, name: "Apartments" },
  { id: 2, name: "Houses" },
];

export const City = [
  { id: 1, name: "Arizona" },
  { id: 2, name: "Los Angeles" },
  { id: 3, name: "New York" },
];

export const Sort = [
  { id: 1, name: "Largest Price", value: "price", order: "desc" },
  { id: 2, name: "Lowest Price", value: "price", order: "asc" },
];

export type Options = {
  id: number;
  name: string;
};

export type OptionsSort = Options & { value: string; order: string };

export const forOptions = [
  { id: 1, name: "Apartments" },
  { id: 2, name: "Houses" },
];

export const sortOptions = [
  { id: 1, name: "Largest Price", value: "price", order: "desc" },
  { id: 2, name: "Lowest Price", value: "price", order: "asc" },
];

export type Options = {
  id: number;
  name: string;
};

export type OptionsSort = Options & { value: string; order: string };

export const options = {
  for: [
    { id: 1, name: "Sell" },
    { id: 2, name: "Rent" },
  ],
  type: [
    { id: 1, name: "Apartments" },
    { id: 2, name: "Houses" },
  ],
  city: [
    { id: 1, name: "Arizona" },
    { id: 2, name: "Los Angeles" },
    { id: 3, name: "New York" },
  ],
  sort: [
    { id: 1, name: "Largest Price", value: "price", order: "desc" },
    { id: 2, name: "Lowest Price", value: "price", order: "asc" },
  ],
};

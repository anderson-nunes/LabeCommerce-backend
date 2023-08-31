import { TProducts, TUser } from "./types";

export { TUser } from "./types";

export const users: TUser[] = [
  {
    id: "and",
    name: "Anderson",
    email: "teste@example.com",
    password: 12345,
    createdAt: new Date().toISOString(),
  },

  {
    id: "eve",
    name: "Everton",
    email: "teste@example.com",
    password: 54321,
    createdAt: new Date().toISOString(),
  },
];

export const products: TProducts[] = [
  {
    id: "eve",
    name: "Everton",
    price: 50,
    description: "chablau",
    imageUrl: "http://",
  },

  {
    id: "pat",
    name: "Patricia",
    price: 70,
    description: "chablau",
    imageUrl: "http://",
  },
];

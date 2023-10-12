// import { TProducts, TUser } from "./types";

// export { TUser } from "./types";

// export const users: TUser[] = [
//   {
//     id: "001",
//     name: "Anderson",
//     email: "anderson@example.com",
//     password: 12345,
//     createdAt: new Date().toISOString(),
//   },

//   {
//     id: "002",
//     name: "Everton",
//     email: "everton@example.com",
//     password: 54321,
//     createdAt: new Date().toISOString(),
//   },
// ];

// export const products: TProducts[] = [
//   {
//     id: "001",
//     name: "Cadeira",
//     price: 450,
//     description: "Cadeira de Escritório",
//     imageUrl: "http://",
//   },

//   {
//     id: "002",
//     name: "Monitor",
//     price: 950,
//     description: "Monitor FULL HD 27",
//     imageUrl: "http://",
//   },
// ];

// export function createUser(
//   id: string,
//   name: string,
//   email: string,
//   password: number
// ): string {
//   const createdAt = new Date().toISOString();
//   const newUser: TUser = {
//     id,
//     name,
//     email,
//     password,
//     createdAt,
//   };

//   users.push(newUser);
//   return "Cadastro realizado com sucesso";
// }

// export function getAllUsers(): TUser[] {
//   return users;
// }

// export function createProduct(
//   id: string,
//   name: string,
//   price: number,
//   description: string,
//   imageUrl: string
// ): string {
//   const newProduct: TProducts = {
//     id,
//     name,
//     price,
//     description,
//     imageUrl,
//   };

//   products.push(newProduct);
//   return "Produto cadastrado com sucesso";
// }

// export function getAllProduct(): TProducts[] {
//   return products;
// }

// export function searchProductsByName(name: string): TProducts[] {
//   return products.filter((product) =>
//     product.name.toLowerCase().includes(name.toLowerCase())
//   );
// }

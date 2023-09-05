import {
  users,
  products,
  createUser,
  getAllUsers,
  createProduct,
  getAllProduct,
  searchProductsByName,
} from "./database";

// console.log(users, products, getAllUsers, getAllProduct);

// console.log(createUser("u003", "Astrodev", "astrodev@email.com", 123399));

// console.log(
//   createProduct(
//     "prod003",
//     "SSD gamer",
//     349.99,
//     "Acelere seu sistema com velocidades incríveis de leitura e gravação.",
//     "https://images.unsplash.com/photo"
//   )
// );

console.log(searchProductsByName("cadeira"));

import {
  users,
  products,
  createUser,
  getAllUsers,
  createProduct,
  getAllProduct,
  searchProductsByName,
  TUser,
} from "./database";

import express, { Request, Response } from "express";

import cors from "cors";
import { TProducts } from "./types";

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/teste", (req: Request, res: Response) => {
  // console.log(req.body);
  res.send("testado!");
});

/////////////////////////////////////////////////////////////////////////////

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

// console.log(searchProductsByName("cadeira"));

/////////////////////////////////////////////////////////

app.get("/users", (req: Request, res: Response) => {
  const result: TUser[] = users;

  res.status(200).send(result);
});

app.post("/users", (req: Request, res: Response) => {
  const { id, name, email, password, createdAt }: TUser = req.body;

  const newUsers: TUser = {
    id,
    name,
    email,
    password,
    createdAt,
  };

  users.push(newUsers);
  res.status(2001).send("Usuário registrado com sucesso");
});

////////////////////////////////////////////////////////////////////////////////////////

app.get("/products", (req: Request, res: Response) => {
  const result: TProducts[] = products;

  res.status(200).send(result);
});

app.get("/products/search", (req: Request, res: Response) => {
  const query: string = req.query.q as string;

  const productsByProducts: TProducts[] = products.filter(
    (product) => product.name.toLowerCase() === query.toLowerCase()
  );

  res.status(200).send(productsByProducts);
});

app.post("/products", (req: Request, res: Response) => {
  const { id, name, price, description, imageUrl }: TProducts = req.body;

  const newProducts: TProducts = {
    id,
    name,
    price,
    description,
    imageUrl,
  };

  products.push(newProducts);
  res.status(2001).send("Produto registrado com sucesso");
});

app.delete("/users/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const indexToDelete = users.findIndex((user) => user.id === id);

  if (indexToDelete >= 0) {
    users.splice(indexToDelete, 1);
  }
  res.status(200).send({ message: "Usuário deletado com sucesso!" });
});

app.delete("/products/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const indexToDelete = products.findIndex((user) => user.id === id);

  if (indexToDelete >= 0) {
    products.splice(indexToDelete, 1);
  }
  res.status(200).send({ message: "Produto deletado com sucesso!" });
});

app.put("/products/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const newName = req.body.name as string | undefined;
  const newPrice = req.body.price as number | undefined;
  const newDescription = req.body.description as string | undefined;
  const newImageUrl = req.body.imageUrl as string | undefined;

  const product = products.find((product) => product.id === id);

  if (product) {
    product.name = newName || product.name;
    product.price = newPrice || product.price;
    product.description = newDescription || product.description;
    product.imageUrl = newImageUrl || product.imageUrl;

    res.status(200).send({ message: "O item foi alterado com sucesso" });
  } else {
    res.status(404).send({ message: "Produto não encontrado" });
  }
});

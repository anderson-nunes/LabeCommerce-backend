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
  try {
    const result: TUser[] = users;

    res.status(200).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

app.post("/users", (req: Request, res: Response): void => {
  try {
    const { id, name, email, password, createdAt }: TUser = req.body;

    const userWithSame = users.find((user) => user.id === id);

    if (userWithSame) {
      res.statusCode = 404;
      throw new Error(`Já existe conta com o mesmo ${id}`);
    }

    const emailWithSame = users.find((user) => user.email === email);

    if (emailWithSame) {
      res.statusCode = 404;
      throw new Error(`Já existe conta com o mesmo ${email}`);
    }

    const newUsers: TUser = {
      id,
      name,
      email,
      password,
      createdAt,
    };

    users.push(newUsers);
    res.status(2001).send("Usuário registrado com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

app.delete("/users/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const idAccountExist = users.find((user) => user.id === id);

    if (!idAccountExist) {
      res.statusCode = 404;
      throw new Error(`Não existe uma conta com o id ${id}`);
    }

    const indexToDelete = users.findIndex((user) => user.id === id);

    if (indexToDelete >= 0) {
      users.splice(indexToDelete, 1);
    }
    res.status(200).send({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

////////////////////////////////////////////////////////////////////////////////////////

app.get("/products", (req: Request, res: Response): void => {
  const result: TProducts[] = products;

  res.status(200).send(result);
});

app.get("/products/search", (req: Request, res: Response): void => {
  try {
    const query: string = req.query.q as string;

    if (query.length === 0) {
      res.statusCode = 404;
      throw new Error("Query deve possuir pelo menos 1 caractere");
    }

    const productsByProducts: TProducts[] = products.filter(
      (product) => product.name.toLowerCase() === query.toLowerCase()
    );

    if (productsByProducts.length === 0) {
      res.statusCode = 404;
      throw new Error("Nenhum produto encontrado para a query");
    }

    res.status(200).send(productsByProducts);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

app.post("/products", (req: Request, res: Response) => {
  try {
    const { id, name, price, description, imageUrl }: TProducts = req.body;

    const productWithSame = products.find((product) => product.id === id);

    if (productWithSame) {
      res.statusCode = 404;
      throw new Error(`Já existe produto com o mesmo ${id}`);
    }

    const newProducts: TProducts = {
      id,
      name,
      price,
      description,
      imageUrl,
    };

    products.push(newProducts);
    res.status(201).send("Produto registrado com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

app.delete("/products/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const idAccountExist = products.find((product) => product.id === id);

    if (!idAccountExist) {
      res.statusCode = 404;
      throw new Error(`Não existe um produto com o id ${id}`);
    }

    const indexToDelete = products.findIndex((user) => user.id === id);

    if (indexToDelete >= 0) {
      products.splice(indexToDelete, 1);
    }
    res.status(200).send({ message: "Produto deletado com sucesso!" });
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

app.put("/products/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const newName = req.body.name as string | undefined;
    const newPrice = req.body.price as number | undefined;
    const newDescription = req.body.description as string | undefined;
    const newImageUrl = req.body.imageUrl as string | undefined;

    const product = products.find((product) => product.id === id);

    if (!product) {
      res.statusCode = 404;
      throw new Error(`Esse produto já existe`);
    }

    if (newName?.length === 0) {
      res.statusCode = 404;
      throw new Error("Novo produto deve ter mais que 1 caracter");
    }

    if (newPrice !== undefined && newPrice <= 0) {
      res.statusCode = 404;
      throw new Error("Preço maior que 1");
    }

    if (newDescription?.length === 0) {
      res.statusCode = 404;
      throw new Error("Nova descrição deve ter mais que 1 caracter");
    }

    const validUrlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

    if (newImageUrl && !validUrlRegex.test(newImageUrl)) {
      res.statusCode = 404;
      throw new Error("nova imagem possui um formato invÃ¡lido");
    }

    if (product) {
      product.name = newName || product.name;
      product.price = newPrice || product.price;
      product.description = newDescription || product.description;
      product.imageUrl = newImageUrl || product.imageUrl;

      res.status(200).send({ message: "O item foi alterado com sucesso" });
    } else {
      res.status(404).send({ message: "Produto não encontrado" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

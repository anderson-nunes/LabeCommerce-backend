import express, { Request, Response } from "express";

import cors from "cors";
import { TProducts, TUser } from "./types";
import { db } from "./database/knex";

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

// Não precisa de validação, basta refatorar para o uso do try/catch

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result: TUser[] = await db.raw(`SELECT * FROM users`);

    res.status(200).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// Validar o body
// Não deve ser possível criar mais de uma conta com a mesma id
// Não deve ser possível criar mais de uma conta com o mesmo e-mail

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, name, email, password }: TUser = req.body;

    if (!id) {
      res.statusCode = 404;
      throw new Error(`O campo do 'id' é obrigatório`);
    }

    if (typeof name !== "string" || name.length < 2) {
      res.statusCode = 404;
      throw new Error(`O campo do 'name' é obrigatório`);
    }

    if (!email || !email.includes("@")) {
      res.statusCode = 404;
      throw new Error(`O campo 'email' deve ser um endereço de e-mail válido`);
    }

    if (typeof password !== "string" || password.length < 6) {
      res.statusCode = 404;
      throw new Error(`O campo 'password' deve ter pelo menos 6 caracteres.`);
    }

    const [isId] = await db.raw(`SELECT id FROM users WHERE id = "${id}"`);

    console.log("@isId==>>", isId);

    if (isId) {
      // NÃO POSSO CADASTRAR
      res.status(400);
      throw new Error(`Id inválido`);
    } else {
      await db.raw(`INSERT INTO users(id, name, email, password)
      VALUES("${id}", "${name}", "${email}", "${password}")
      `);

      res.status(200).send("Cadastro realizado com sucesso");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// Validar que a conta existe antes de deletá-la

app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const userExists = await db.raw("SELECT * FROM users WHERE id = ?", [id]);

    if (userExists[0].length === 0) {
      res.status(404).send({ message: `Não existe uma conta com o id ${id}` });
      return;
    }

    await db.raw("DELETE FROM users WHERE id = ?", [id]);

    res.status(200).send({ message: "O usuário foi deletado com sucesso" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(400).send("Erro ao deletar usuário");
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

app.get("/products", async (req: Request, res: Response) => {
  try {
    const result: TProducts[] = await db.raw(`SELECT * FROM products`);

    res.status(200).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// se query params for recebido, deve possuir pelo menos um caractere

app.get("/products/search", async (req, res) => {
  try {
    const query: string = req.query.q as string;

    if (query.length === 0) {
      res.statusCode = 404;
      throw new Error("Query deve possuir pelo menos um caractere");
    }

    const productsByName: TProducts[] = await db("products").where(
      "name",
      "like",
      `${query}`
    );

    if (productsByName.length === 0) {
      res.statusCode = 404;
      throw new Error(`Nenhum produto encontrado para a query "${query}"`);
    }

    res.status(200).send(productsByName);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro: a query deve possuir pelo menos um caractere");
    }
  }
});

// Validar o body
// Não deve ser possível criar mais de um produto com a mesma id

app.post("/products", async (req: Request, res: Response) => {
  try {
    const { id, name, price, description, imageUrl }: TProducts = req.body;

    if (!id) {
      res.statusCode = 404;
      throw new Error(`O campo do 'id' é obrigatório`);
    }

    if (!name) {
      res.statusCode = 404;
      throw new Error(`O campo do 'name' é obrigatório`);
    }

    if (typeof price !== "number" || price <= 1) {
      res.statusCode = 404;
      throw new Error(`O campo do 'preço' é obrigatório`);
    }

    if (typeof description !== "string" || description.length < 2) {
      res.statusCode = 404;
      throw new Error(`O campo de 'descrição' é obrigatório`);
    }

    const validUrlRegex = /^http:\/\//;

    if (imageUrl && !validUrlRegex.test(imageUrl)) {
      res.statusCode = 404;
      throw new Error("nova imagem possui um formato inválido");
    }

    // Verificar se o produto já existe
    const productWithSameId = await db.raw(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (productWithSameId.length > 0) {
      res.status(400).send(`Já existe um produto com o mesmo ID ${id}.`);
      return;
    }

    await db.raw(`INSERT INTO products
    VALUES("${id}", "${name}", "${price}", "${description}", "${imageUrl}")
    `);

    res.status(200).send("Produto cadastrado com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// Validar que o produto existe antes de editá-lo
// Validar os dados opcionais do body se eles forem recebidos

app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const newId = req.body.newId as string | undefined;
    const newName = req.body.newName as string | undefined;
    const newPrice = req.body.newPrice as number | undefined;
    const newDescription = req.body.newDescription as string | undefined;
    const newImageUrl = req.body.newImageUrl as string | undefined;

    //REVISAR ESSA LÓGICA

    const [product] = await db.raw("SELECT * FROM products WHERE id = ?", [id]);

    if (product.length === 0) {
      res.statusCode = 404;
      throw new Error(`Esse produto não existe`);
    }

    if (newName?.length === 0) {
      res.statusCode = 404;
      throw new Error("Novo produto deve ter mais que 1 caracter");
    }

    if (newPrice !== undefined && newPrice <= 0) {
      res.statusCode = 404;
      throw new Error("Novo preço menor que R$ 1");
    }

    if (newDescription?.length === 0) {
      res.statusCode = 404;
      throw new Error("Nova descrição deve ter mais que 1 caracter");
    }

    const validUrlRegex = /^http:\/\//;

    if (newImageUrl && !validUrlRegex.test(newImageUrl)) {
      res.statusCode = 404;
      throw new Error("Nova imagem possui um formato inválido");
    }

    const [newProduct] = await db.raw(
      `SELECT * FROM products WHERE id = "${id}"`
    );

    if (newProduct) {
      await db.raw(`UPDATE products SET
      id = "${newId || newProduct.id}",
      name = "${newName || newProduct.id}",
      price = "${newPrice || newProduct.price}",
      description = "${newDescription || newProduct.description}",
      image_Url = "${newImageUrl || newProduct.image_Url}"      
      WHERE id = "${id}"
      `);

      res.status(200).send("Produto editado com sucesso");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// Validar que o produto existe antes de deletá-lo

app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const product = await db.raw("SELECT * FROM products WHERE id = ?", [id]);

    if (product[0].length === 0) {
      res.status(404).send({ message: `Não existe uma conta com o id ${id}` });
      return;
    }

    await db.raw("DELETE FROM products WHERE id = ?", [id]);

    res.status(200).send({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).send("Erro ao deletar produto");
  }
});

//////

app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, buyer_id, total_price } = req.body;

    console.log("@===>>>", id, buyer_id, total_price);

    if (typeof id !== "string" || id.length < 4) {
      res.statusCode = 404;
      throw new Error(`O campo do 'id' é obrigatório`);
    }

    if (typeof buyer_id !== "string" || buyer_id.length < 3) {
      res.statusCode = 404;
      throw new Error(`O campo do 'buyer id' é obrigatório`);
    }

    if (typeof total_price !== "number" || total_price <= 1) {
      res.statusCode = 404;
      throw new Error(`O campo do 'preço' é obrigatório`);
    }

    const isPurchase = await db.raw(`INSERT INTO purchases
    (id, buyer_id, total_price)
    VALUES("${id}", "${buyer_id}", "${total_price}")
    `);

    res.status(200).send("Produto cadastrado com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

app.delete("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const purchase = await db.raw("SELECT * FROM purchases WHERE id = ?", [id]);

    if (purchase[0].length === 0) {
      res.status(404).send({ message: `Não existe uma conta com o id ${id}` });
      return;
    }

    await db.raw("DELETE FROM purchases WHERE id = ?", [id]);

    res.status(200).send({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).send("Erro ao deletar produto");
  }
});

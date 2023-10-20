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

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result: TUser[] = await db("users");

    res.status(200).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

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

    const newUsers = {
      id,
      name,
      email,
      password,
    };

    await db("users").insert(newUsers);

    res.status(200).send("Cadastro realizado com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id || typeof id !== "string" || id.length !== 3) {
      res.status(400).send("Informe um 'id' de 3 caracteres.");
      return;
    }

    const [user] = await db("users").where({ id });

    if (user) {
      await db("users").where({ id }).delete();
      res.status(200).send("Usuário deletado com sucesso");
    } else {
      res.status(404).send("Usuário não encontrado");
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error instanceof Error ? error.message : "Erro inesperado");
  }
});

app.get("/products", async (req: Request, res: Response) => {
  try {
    const result: TProducts[] = await db("products");

    res.status(200).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

app.get("/products/search", async (req: Request, res: Response) => {
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

app.post("/products", async (req: Request, res: Response) => {
  try {
    const { id, name, price, description, image_url }: TProducts = req.body;

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

    if (image_url && !validUrlRegex.test(image_url)) {
      res.statusCode = 404;
      throw new Error("nova imagem possui um formato inválido");
    }

    // Verificar se o produto já existe
    const productWithSameId = await db.raw(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (productWithSameId.length > 0) {
      res.status(400).send(`Já existe um produto com o mesmo 'id' ${id}.`);
      return;
    }

    const newProduct = {
      id,
      name,
      price,
      description,
      image_url,
    };

    await db("products").insert(newProduct);

    res.status(200).send("Produto cadastrado com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

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

app.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || id.length !== 2) {
      res.status(400).send({ message: "Informe um 'id' de 2 caracteres." });
      return;
    }

    const product = await db("products").where({ id });

    if (product.length === 0) {
      res
        .status(404)
        .send({ message: `Não existe um produto com o 'id' ${id}` });
    } else {
      await db("products").where({ id }).delete();
      res.status(200).send({ message: "Produto deletado com sucesso" });
    }
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).send("Erro ao deletar produto");
  }
});

app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, buyer_id, id_product, quantity } = req.body;

    if (typeof id !== "string" || id.length < 2) {
      res.statusCode = 404;
      throw new Error(`O campo do 'id' é obrigatório`);
    }

    if (typeof buyer_id !== "string" || buyer_id.length < 3) {
      res.statusCode = 404;
      throw new Error(`O campo do 'buyer id' é obrigatório`);
    }

    if (typeof id_product !== "string" || id_product.length < 2) {
      res.statusCode = 404;
      throw new Error(`O campo 'id' do produto é obrigatório`);
    }

    const [isPriceProduct] = await db("products").where({ id: id_product });

    const sumQuantity = quantity * isPriceProduct.price;

    const newPurchases = {
      id,
      buyer_id,
      total_price: sumQuantity,
    };

    const newPurchasesProducts = {
      purchase_id: id,
      product_id: id_product,
      quantity,
    };

    const [searchIdPurschase] = await db("purchases").where({ id });

    const resultsProducts = await db("products")
      .select("products.price", "purchases_products.quantity")
      .innerJoin(
        "purchases_products",
        "products.id",
        "=",
        "purchases_products.product_id"
      )
      .where({ "purchases_products.purchase_id": id });

    if (searchIdPurschase === undefined) {
      await db("purchases").insert(newPurchases);
      await db("purchases_products").insert(newPurchasesProducts);
    } else {
      const newResultsProducts = resultsProducts
        .map((item) => item.price * item.quantity)
        .reduce((a, b) => a + b);

      const updateValuePurchases =
        newPurchases.total_price + newResultsProducts;

      await db("purchases_products").insert(newPurchasesProducts);
      await db("purchases")
        .update({ total_price: updateValuePurchases })
        .where({ id });
    }

    res.status(200).send("Produto cadastrado com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

app.delete("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const idToDel: string = req.params.id;

    const [searchId] = await db.raw(`
    SELECT id FROM purchases WHERE id = '${idToDel}'
    `);

    if (!searchId) {
      res.statusCode = 404;
      throw new Error("Pedido deletado com sucesso");
    }

    await db.raw(`
    DELETE FROM purchases_products WHERE purchase_id ='${searchId.id}';
    `);
    await db.raw(`
    DELETE FROM purchases WHERE id ='${searchId.id}';
    `);

    res.status(200).send({ message: "Pedido deletado com sucesso" });
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

app.get("/purchases/:id", async (req, res) => {
  try {
    const purchaseId = req.params.id;

    if (!purchaseId) {
      res.statusCode = 404;
      throw new Error(`Pedido com 'id' ${purchaseId} não encontrado`);
    }

    const [purchaseInfo] = await db("purchases")
      .select(
        "purchases.id as purchaseId",
        "users.id as buyerId",
        "users.name as buyerName",
        "users.email as buyerEmail",
        "purchases.total_price as totalPrice",
        "purchases.created_at as createdAt"
      )
      .innerJoin("users", "purchases.buyer_id", "=", "users.id")
      .where({ "purchases.id": purchaseId });

    const resultProducts = await db("purchases_products")
      .select(
        "id as idProduct",
        "name as nameProduct",
        "price as priceProduct",
        "description as descriptionProduct",
        "image_url as imageUrlProducts",
        "quantity as qtnd"
      )
      .innerJoin(
        "products",
        "purchases_products.product_id",
        "=",
        "products.id"
      )
      .where({ "purchases_products.purchase_id": purchaseId });

    const newResult = {
      ...purchaseInfo,
      products: resultProducts,
    };

    res.status(200).send(newResult);
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).send("Erro ao buscar informações do pedido");
  }
});

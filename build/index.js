"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});
app.get("/teste", (req, res) => {
    // console.log(req.body);
    res.send("testado!");
});
/////////////////////////////////////////////////////////
app.get("/users", (req, res) => {
    const result = database_1.users;
    res.status(200).send(result);
});
app.post("/users", (req, res) => {
    const { id, name, email, password, createdAt } = req.body;
    const newUsers = {
        id,
        name,
        email,
        password,
        createdAt,
    };
    database_1.users.push(newUsers);
    res.status(2001).send("Usuário registrado com sucesso");
});
////////////////////////////////////////////////////////////////////////////////////////
app.get("/products", (req, res) => {
    const result = database_1.products;
    res.status(200).send(result);
});
app.get("/products/search", (req, res) => {
    const query = req.query.q;
    const productsByProducts = database_1.products.filter((product) => product.name.toLowerCase() === query.toLowerCase());
    res.status(200).send(productsByProducts);
});
app.post("/products", (req, res) => {
    const { id, name, price, description, imageUrl } = req.body;
    const newProducts = {
        id,
        name,
        price,
        description,
        imageUrl,
    };
    database_1.products.push(newProducts);
    res.status(2001).send("Produto registrado com sucesso");
});
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
//# sourceMappingURL=index.js.map
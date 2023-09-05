"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProductsByName = exports.getAllProduct = exports.createProduct = exports.getAllUsers = exports.createUser = exports.products = exports.users = void 0;
exports.users = [
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
exports.products = [
    {
        id: "eve",
        name: "cadeira",
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
function createUser(id, name, email, password) {
    const createdAt = new Date().toISOString();
    const newUser = {
        id,
        name,
        email,
        password,
        createdAt,
    };
    exports.users.push(newUser);
    return "Cadastro realizado com sucesso";
}
exports.createUser = createUser;
function getAllUsers() {
    return exports.users;
}
exports.getAllUsers = getAllUsers;
function createProduct(id, name, price, description, imageUrl) {
    const newProduct = {
        id,
        name,
        price,
        description,
        imageUrl,
    };
    exports.products.push(newProduct);
    return "Produto cadastrado com sucesso";
}
exports.createProduct = createProduct;
function getAllProduct() {
    return exports.products;
}
exports.getAllProduct = getAllProduct;
function searchProductsByName(name) {
    return exports.products.filter((product) => product.name.toLowerCase().includes(name.toLowerCase()));
}
exports.searchProductsByName = searchProductsByName;
//# sourceMappingURL=database.js.map
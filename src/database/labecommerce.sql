-- Active: 1695853753896@@127.0.0.1@3306

PRAGMA foreign_keys = ON; 
PRAGMA date_class = 'datetime';

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
);

INSERT INTO users (id, name, email, password)
VALUES
  ('001', 'Fulano', 'fulano@email.com', '123456'),
  ('002', 'Ciclano', 'anderson@email.com', '654321'),
  ('003', 'Beltrano', 'beltrano@email.com', '121212'),
  ('004', 'João', 'joao@email.com', '212121');

DELETE FROM users WHERE id = '001';

SELECT * FROM users;
DROP TABLE users

CREATE TABLE products (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL
);

INSERT INTO products (id, name, price, description, image_url) 
VALUES 
    ('p1', 'Produto 1', 70.99, 'Descrição do Produto 1', 'url_imagem_1.jpg'),
    ('p2', 'Produto 2', 59.99, 'Descrição do Produto 2', 'url_imagem_2.jpg'),
    ('p3', 'Produto 3', 299.99, 'Descrição do Produto 3', 'url_imagem_3.jpg'),
    ('p4', 'Produto 4', 1099.99, 'Descrição do Produto 4', 'url_imagem_4.jpg'),
    ('p5', 'Produto 5', 99.99, 'Descrição do Produto 5', 'url_imagem_5.jpg'),
    ('p6', 'Produto 6', 199.99, 'Descrição do Produto 6', 'url_imagem_6.jpg');

SELECT * FROM products;

SELECT * FROM products
WHERE name = 'Produto 1';

DELETE FROM products WHERE id = 'p1';

UPDATE products SET price = 200.99 WHERE id = 'p2'

UPDATE products SET 
  name = 'Produto 7',
  price = 699.79,
  description = 'Descrição do Produto 7',
  image_url = 'novaimagemurl.jpg'
WHERE id = 'p5';

DROP TABLE products;



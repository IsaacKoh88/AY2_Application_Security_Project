-- @block
CREATE TABLE account(
    id INT PRIMARY KEY AUTO_INCREMENT UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR (255) NOT NULL
);

-- @block
INSERT INTO account (email, password)
VALUES (
    'leroytan@mymail.com',
    '123456789'
)

-- @block
INSERT INTO account (email, password)
VALUES
    ('Hongda@mymail.com', '696912340'),
    ('Isaackoh@yourmail.com', '0987654321'),
    ('CChinshuan@ourmail.com', '1029384756');


-- @block
SELECT * FROM account;
-- @block
CREATE TABLE Accounts(
    id INT PRIMARY KEY AUTO_INCREMENT ,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwords VARCHAR (255) NOT NULL
);

-- @block
INSERT INTO Accounts (email, passwords)
VALUES (
    'leroytan@mymail.com',
    '123456789'
)

-- @block
INSERT INTO Accounts (email, passwords)
VALUES
    ('Hongda@mymail.com', '696912340'),
    ('Isaackoh@yourmail.com', '0987654321'),
    ('CChinshuan@ourmail.com', '1029384756');


-- @block
SELECT * FROM Accounts;
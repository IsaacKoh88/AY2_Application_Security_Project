-- @block
CREATE TABLE account(
    id INT PRIMARY KEY AUTO_INCREMENT UNIQUE,
    id VARCHAR(36) PRIMARY KEY NOT NULL UNIQUE,
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
DROP TABLE account;

-- @block
-- Function to create UUID v4
CREATE FUNCTION uuid_v4s()
    RETURNS CHAR(36)
    NO SQL
BEGIN
    -- 1th and 2nd block are made of 6 random bytes
    SET @h1 = HEX(RANDOM_BYTES(4));
    SET @h2 = HEX(RANDOM_BYTES(2));

    -- 3th block will start with a 4 indicating the version, remaining is random
    SET @h3 = SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3);

    -- 4th block first nibble can only be 8, 9 A or B, remaining is random
    SET @h4 = CONCAT(HEX(FLOOR(ASCII(RANDOM_BYTES(1)) / 64)+8),
                SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3));

    -- 5th block is made of 6 random bytes
    SET @h5 = HEX(RANDOM_BYTES(6));

    -- Build the complete UUID
    RETURN LOWER(CONCAT(
        @h1, '-', @h2, '-4', @h3, '-', @h4, '-', @h5
    ));
END


-- @block
-- Procdure to insert data into tables
CREATE PROCEDURE insertdata (IN email VARCHAR(255), IN password VARCHAR(255))
BEGIN
    SET @id = uuid_v4s();
    -- Check if got similar UUID in database
    WHILE ((SELECT count(*) FROM account WHERE id = @id) = 1)
    DO
        SET @id = uuid_v4s();
    END WHILE;
    INSERT INTO account (id, email, password) VALUES (@id, email, password);
END;

-- @block
DROP FUNCTION uuid_v4s

-- @BLOCK
DROP PROCEDURE insertdata

-- @block
-- Got error, but it does insert data into the tables
CALL insertdata('leroytan@mymail.com', '123456789');
CALL insertdata('Hongda@mymail.com', '696912340');
CALL insertdata('Isaackoh@yourmail.com', '0987654321');
CALL insertdata('CChinshuan@ourmail.com', '1029384756')

-- @block
SELECT * FROM account;
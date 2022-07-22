-- @block
DROP TABLE IF EXISTS account, calendar, category, todo;

CREATE TABLE account(
    id  VARCHAR(36) PRIMARY KEY NOT NULL UNIQUE,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR (255) NOT NULL
);

CREATE TABLE events(
    AccountID   VARCHAR(36) NOT NULL,
    ID          VARCHAR(36) NOT NULL,
    Date        DATE NOT NULL,
    StartTime 	TIME NOT NULL,
	EndTime	    TIME NOT NULL,
    Name        VARCHAR(255) NOT NULL,
    Description TEXT NULL,
    CategoryID  VARCHAR(36) NOT NULL
);

CREATE TABLE category(
    AccountID   VARCHAR(36) NOT NULL,
    ID          VARCHAR(36) NOT NULL,
    Name        VARCHAR(255) NOT NULL,
    Color       VARCHAR(7) NOT NULL
);

CREATE TABLE todo(
    AccountID    VARCHAR(36) NOT NULL,
    ID     VARCHAR(36) NOT NULL,
    Name        VARCHAR(255) NOT NULL,
    Date        DATE NOT NULL,
    Checked     TINYINT(4) NOT NULL
);


-- @BLOCK
DROP FUNCTION IF EXISTS uuid_v4s;

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
-- Consists of stored procedure that inserts data
DROP PROCEDURE IF EXISTS insertAccountData;
DROP PROCEDURE IF EXISTS insertCalendarData;
DROP PROCEDURE IF EXISTS insertCategoryData;
DROP PROCEDURE IF EXISTS insertTodoData;
DROP PROCEDURE IF EXISTS insertBudget;

CREATE PROCEDURE insertAccountData (IN email VARCHAR(255), IN password VARCHAR(255))
BEGIN
    SET @email = email;
    SET @password = password;

    SET @id = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM account where id=? INTO @count'; 
    EXECUTE stmt USING @id;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @id = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM account where id=? INTO @count'; 
        EXECUTE stmt USING @id;
        DEALLOCATE PREPARE stmt;
    END WHILE;
    
    PREPARE stmt FROM 'INSERT INTO account VALUES (?, ?, ?)';
    EXECUTE stmt USING @id, @email, @password;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE insertCalendarData (IN acct_id VARCHAR(36), date DATE, startTime TIME, endTime TIME, eventName VARCHAR(255), description VARCHAR(255), category_id VARCHAR(36))
BEGIN
    SET @acct_id = acct_id;
    SET @date = date;
    SET @startTime = startTIme;
    SET @endTime = endTime;
    SET @eventName = eventName;
    SET @description = description;
    set @category_id = category_id;

    SET @event_id = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM calendar where acct_id = ? and event_id = ? INTO @count'; 
    EXECUTE stmt USING @acct_id, @event_id;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @event_id = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM calendar where acct_id = ? and event_id = ? INTO @count'; 
        EXECUTE stmt USING @acct_id, @event_id;
        DEALLOCATE PREPARE stmt;
    END WHILE;

    PREPARE stmt FROM 'INSERT INTO calendar VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    EXECUTE stmt USING @acct_id, @event_id, @date, @startTime, @endTime, @eventName, @description, @category_id;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE insertCategoryData (IN acct_id VARCHAR(36), categoryName VARCHAR(255), categoryColor VARCHAR(7))
BEGIN
    SET @acct_id = acct_id;
    SET @categoryName = categoryName;
    SET @categoryColor = categoryColor;

    SET @category_id = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM category where acct_id = ? and category_id = ? INTO @count'; 
    EXECUTE stmt USING @acct_id, @category_id;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @category_id = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM category where acct_id = ? and category_id = ? INTO @count'; 
        EXECUTE stmt USING @acct_id, @category_id;
        DEALLOCATE PREPARE stmt;
    END WHILE;

    PREPARE stmt FROM 'INSERT INTO category VALUES (?, ?, ?, ?)';
    EXECUTE stmt USING @acct_id, @category_id, @categoryName, @categoryColor;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE insertTodoData (IN acct_id VARCHAR(36), todoName VARCHAR(255), todoDate DATE)
BEGIN
    SET @acct_id = acct_id;
    SET @todoName = todoName;
    SET @todoDate = todoDate;

    SET @todo_id = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM todo where acct_id = ? and todo_id = ? INTO @count'; 
    EXECUTE stmt USING @acct_id, @todo_id;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @todo_id = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM todo where acct_id = ? and todo_id = ? INTO @count'; 
        EXECUTE stmt USING @acct_id, @todo_id;
        DEALLOCATE PREPARE stmt;
    END WHILE;

    PREPARE stmt FROM 'INSERT INTO todo VALUES (?, ?, ?, ?)';
    EXECUTE stmt USING @acct_id, @todo_id, @todoName, @todoDate;
    DEALLOCATE PREPARE stmt;
END

-- @block
-- Consists of stored procedure that select data
DROP PROCEDURE IF EXISTS selectEmail_Id;
DROP PROCEDURE IF EXISTS selectId_Email;

CREATE PROCEDURE selectEmail_Id (IN id VARCHAR(36))
BEGIN
    SET @id = id;

    PREPARE stmt FROM 'SELECT email FROM account WHERE id=?';
    EXECUTE stmt USING @id;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE selectId_Email (IN email VARCHAR(36))
BEGIN
    SET @email = email;

    PREPARE stmt FROM 'SELECT id FROM account WHERE email=?';
    EXECUTE stmt USING @email;
    DEALLOCATE PREPARE stmt;
END;



-- @block
-- Got error, but it does insert data into the tables
CALL insertAccountData('leroytan@mymail.com', '123456789');
CALL insertAccountData('Hongda@mymail.com', '696912340');
CALL insertAccountData('Isaackoh@yourmail.com', '0987654321');
CALL insertAccountData('CChinshuan@ourmail.com', '1029384756')

-- @block
select * from calendar;

-- @block
SELECT * FROM account;

-- @block
select * from category;

-- @block
select * from todo;
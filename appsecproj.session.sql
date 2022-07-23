-- @block
DROP TABLE IF EXISTS account, events, category, todo, budget, expense;

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
    AccountID   VARCHAR(36) NOT NULL,
    ID          VARCHAR(36) NOT NULL,
    Name        VARCHAR(255) NOT NULL,
    Date        DATE NOT NULL,
    Checked     TINYINT(4) NOT NULL
);

CREATE TABLE budget(
    AccountID   VARCHAR(36) NOT NULL,
    Budget      INT NOT NULL
);

CREATE TABLE expense(
    AccountID   VARCHAR(36) NOT NULL,
    ID          VARCHAR(36) NOT NULL,
    Name        VARCHAR(255) NOT NULL,
    Amount      INT NOT NULL,
    Date        DATE NOT NULL
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
DROP PROCEDURE IF EXISTS insertExpenseData;
DROP PROCEDURE IF EXISTS insertBudgetData;

CREATE PROCEDURE insertAccountData (IN email VARCHAR(255), IN password VARCHAR(255))
BEGIN
    SET @email = email;
    SET @password = password;

    SET @ID = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM account where id=? INTO @count'; 
    EXECUTE stmt USING @ID;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @ID = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM account where id=? INTO @count'; 
        EXECUTE stmt USING @ID;
        DEALLOCATE PREPARE stmt;
    END WHILE;
    
    PREPARE stmt FROM 'INSERT INTO account VALUES (?, ?, ?)';
    EXECUTE stmt USING @ID, @email, @password;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE insertCalendarData (IN AccountID VARCHAR(36), date DATE, startTime TIME, endTime TIME, eventName VARCHAR(255), description VARCHAR(255), category_id VARCHAR(36))
BEGIN
    SET @AccountID= acct_id;
    SET @Date = date;
    SET @StartTime = startTIme;
    SET @EndTime = endTime;
    SET @Name = eventName;
    SET @Description = description;
    set @CategoryID = category_id;

    SET @ID = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM events where AccountID = ? and ID = ? INTO @count'; 
    EXECUTE stmt USING @AccountID, @ID;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @ID = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM events where AccountID = ? and ID = ? INTO @count'; 
        EXECUTE stmt USING @Accout, @ID;
        DEALLOCATE PREPARE stmt;
    END WHILE;

    PREPARE stmt FROM 'INSERT INTO events VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    EXECUTE stmt USING @AccountID, @ID, @Date, @StartTime, @EndTime, @Name, @Description, @CategoryID;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE insertCategoryData (IN AccountID VARCHAR(36), categoryName VARCHAR(255), categoryColor VARCHAR(8))
BEGIN
    SET @AccountID = AccountID;
    SET @Name = categoryName;
    SET @Color = categoryColor;

    SET @ID = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM category where AccountID = ? and ID = ? INTO @count'; 
    EXECUTE stmt USING @AccountID, @ID;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @ID = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM category where AccountID = ? and ID = ? INTO @count'; 
        EXECUTE stmt USING @AccountID, @ID;
        DEALLOCATE PREPARE stmt;
    END WHILE;

    PREPARE stmt FROM 'INSERT INTO category VALUES (?, ?, ?, ?)';
    EXECUTE stmt USING @AccountID, @ID, @Name, @Color;
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
END;


CREATE PROCEDURE insertExpenseData (IN AccountID VARCHAR(36), Name VARCHAR(255), Amount INT, Date DATE)
BEGIN
    SET @AccountID = AccountID;
    SET @Name = Name;
    SET @Amount = Amount;
    SET @Date = Date;

    SET @ID = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM expense where AccountID = ? and ID = ? INTO @count'; 
    EXECUTE stmt USING @AccountID, @ID;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @ID = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM expense where AccountID = ? and ID = ? INTO @count'; 
        EXECUTE stmt USING @AccountID, @ID;
        DEALLOCATE PREPARE stmt;
    END WHILE;

    PREPARE stmt FROM 'INSERT INTO expense VALUES (?, ?, ?, ?, ?)';
    EXECUTE stmt USING @AccountID, @ID, @Name, @Amount, @Date;
    DEALLOCATE PREPARE stmt;
END;
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
-- Consists of stored procedure that update data
DROP PROCEDURE IF EXISTS updateAccount;
DROP PROCEDURE IF EXISTS updateCategory;
DROP PROCEDURE IF EXISTS updateEvent;
DROP PROCEDURE IF EXISTS updateTodo;
DROP PROCEDURE IF EXISTS updateExpense;

CREATE PROCEDURE updateAccount (IN hashedPassword VARCHAR(255), id VARCHAR(36), email VARCHAR(255))
BEGIN
    SET @hashedPassword = hashedPassword;
    SET @id = id;
    SET @email = email;

    PREPARE stmt FROM 'UPDATE account SET password=? WHERE id=? AND email=?';
    EXECUTE stmt using @hashedPassword, @id, @email;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE updateCategory (IN categoryName VARCHAR(255), categoryColor VARCHAR(7), account_id VARCHAR(36), category_id VARCHAR(36))
BEGIN
    SET @categoryName = categoryName;
    SET @categoryColor = categoryColor;
    SET @account_id = account_id;
    SET @category_id = category_id;

    PREPARE stmt FROM 'UPDATE category SET name=?, color=? WHERE account_id=? AND category_id=?';
    EXECUTE stmt using @categoryName, @categoryColor, @account_id, @category_id;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE updateEvent (IN categoryName VARCHAR(255), categoryColor VARCHAR(7), account_id VARCHAR(36), category_id VARCHAR(36))
BEGIN
    SET @categoryName = categoryName;
    SET @categoryColor = categoryColor;
    SET @account_id = account_id;
    SET @category_id = category_id;

    PREPARE stmt FROM 'UPDATE category SET name=?, color=? WHERE account_id=? AND category_id=?';
    EXECUTE stmt using @categoryName, @categoryColor, @account_id, @category_id;
    DEALLOCATE PREPARE stmt;
END;

-- @block
select * from calendar;

-- @block
SELECT * FROM account;

-- @block
select * from category;

-- @block
select * from todo;

-- @block
select * from budget;

-- @block
select * from expense;


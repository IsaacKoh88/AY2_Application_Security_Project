-- Error: cannot destructure properly name of undefined as it is undefined can be ignored, cause the blocks still run
-- @block
DROP TABLE IF EXISTS account, events, category, todo, budget, expense, notes;

CREATE TABLE account(
    id  VARCHAR(36) PRIMARY KEY NOT NULL UNIQUE,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR (255) NOT NULL,
);

CREATE TABLE category(
    AccountID   VARCHAR(36) NOT NULL,
    ID          VARCHAR(36) PRIMARY KEY NOT NULL,
    Name        VARCHAR(255) NOT NULL,
    Color       VARCHAR(7) NOT NULL,
    FOREIGN KEY (AccountID) REFERENCES account(id) ON DELETE CASCADE
);

CREATE TABLE events(
    AccountID   VARCHAR(36) NOT NULL,
    ID          VARCHAR(36) PRIMARY KEY NOT NULL,
    Name        VARCHAR(255) NOT NULL,
    Date        DATE NOT NULL,
    StartTime 	TIME NOT NULL,
	EndTime	    TIME NOT NULL,
    Description TEXT NULL,
    CategoryID  VARCHAR(36) NULL DEFAULT '',
    FOREIGN KEY (AccountID) REFERENCES account(id) ON DELETE CASCADE,
    FOREIGN KEY (CategoryID) REFERENCES category(ID) ON DELETE SET DEFAULT
);

CREATE TABLE todo(
    AccountID   VARCHAR(36) NOT NULL,
    ID          VARCHAR(36) PRIMARY KEY NOT NULL,
    Name        VARCHAR(255) NOT NULL,
    Date        DATE NOT NULL,
    Checked     TINYINT(4) NOT NULL,
    FOREIGN KEY (AccountID) REFERENCES account(id) ON DELETE CASCADE
);

CREATE TABLE budget(
    AccountID   VARCHAR(36) NOT NULL,
    Budget      INT NOT NULL,
    FOREIGN KEY (AccountID) REFERENCES account(id) ON DELETE CASCADE
);

CREATE TABLE expense(
    AccountID   VARCHAR(36) NOT NULL,
    ID          VARCHAR(36) PRIMARY KEY NOT NULL,
    Name        VARCHAR(255) NOT NULL,
    Amount      DECIMAL(65,2) NOT NULL,
    Date        DATE NOT NULL,
    FOREIGN KEY (AccountID) REFERENCES account(id) ON DELETE CASCADE
);

CREATE TABLE notes(
    AccountID   VARCHAR(36) NOT NULL,
    ID          VARCHAR(36)PRIMARY KEY NOT NULL,
    Name        VARCHAR(255) NOT NULL,
    Date        DATE NOT NULL,
    Description TEXT NULL,
    FOREIGN KEY (AccountID) REFERENCES account(id) ON DELETE CASCADE
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
DROP PROCEDURE IF EXISTS insertEventData;
DROP PROCEDURE IF EXISTS insertCategoryData;
DROP PROCEDURE IF EXISTS insertTodoData;
DROP PROCEDURE IF EXISTS insertExpenseData;
DROP PROCEDURE IF EXISTS insertBudgetData;
DROP PROCEDURE IF EXISTS inserTNotesData;

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

    SET @budget = 1000;
    PREPARE stmt FROM 'INSERT INTO budget VALUES(?, ?)'; 
    EXECUTE stmt USING @ID, @budget;
    DEALLOCATE PREPARE stmt;
    
    PREPARE stmt FROM 'INSERT INTO account VALUES (?, ?, ?)';
    EXECUTE stmt USING @ID, @email, @password;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE insertEventData (IN AccountID VARCHAR(36), date DATE, startTime TIME, endTime TIME, eventName VARCHAR(255), description VARCHAR(255), CategoryID VARCHAR(36))
BEGIN
    SET @AccountID= AccountID;
    SET @Date = date;
    SET @StartTime = startTIme;
    SET @EndTime = endTime;
    SET @Name = eventName;
    SET @Description = description;
    set @CategoryID = CategoryID;

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

    PREPARE stmt2 FROM 'INSERT INTO events VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    EXECUTE stmt2 USING @AccountID, @ID, @Date, @StartTime, @EndTime, @Name, @Description, @CategoryID;
    DEALLOCATE PREPARE stmt2;
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

CREATE PROCEDURE insertTodoData (IN AccountID VARCHAR(36), todoName VARCHAR(255), todoDate DATE)
BEGIN
    SET @AccountID = AccountID;
    SET @Name = todoName;
    SET @Date = todoDate;
    SET @Checked = 0;

    SET @ID = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM todo where AccountID = ? and ID = ? INTO @count'; 
    EXECUTE stmt USING @AccountID, @ID;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @ID = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM todo where AccountID = ? and ID = ? INTO @count'; 
        EXECUTE stmt USING @AccountID, @ID;
        DEALLOCATE PREPARE stmt;
    END WHILE;

    PREPARE stmt FROM 'INSERT INTO todo VALUES (?, ?, ?, ?, ?)';
    EXECUTE stmt USING @AccountID, @ID, @Name, @Date, @Checked;
    DEALLOCATE PREPARE stmt;
END;


CREATE PROCEDURE insertExpenseData (IN AccountID VARCHAR(36), Name VARCHAR(255), Amount DECIMAL(65, 2), Date DATE)
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

CREATE PROCEDURE insertNotesData (IN AccountID VARCHAR(36), notesName VARCHAR(255), notesDate DATE, description VARCHAR(255))
BEGIN
    SET @AccountID = AccountID;
    SET @notesName = notesName;
    SET @notesDate = notesDate;
    SET @description = description;

    SET @notes_id = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM notes where AccountID = ? and ID = ? INTO @count'; 
    EXECUTE stmt USING @AccountID, @notes_id;
    DEALLOCATE PREPARE stmt;

    WHILE (@count = 1)
    DO
        SET @notes_id = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM notes where AccountID = ? and ID = ? INTO @count'; 
        EXECUTE stmt USING @AccountID, @notes_id;
        DEALLOCATE PREPARE stmt;
    END WHILE;

    PREPARE stmt FROM 'INSERT INTO notes VALUES (?, ?, ?, ?, ?)';
    EXECUTE stmt USING @AccountID, @notes_id, @notesName, @notesDate, @description;
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
DROP PROCEDURE IF EXISTS updateBudget;
DROP PROCEDURE IF EXISTS updateExpense;
DROP PROCEDURE IF EXISTS updateNotes;


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

CREATE PROCEDURE updateNotes (IN notesName VARCHAR(255), notesDate DATE, account_id VARCHAR(36), notes_id VARCHAR(36))
BEGIN
    SET @notesName = notesName;
    SET @notesDate = notesDate;
    SET @account_id = account_id;
    SET @notes_id = notes_id;

    PREPARE stmt FROM 'UPDATE notes SET name=?, date=? WHERE account_id=? AND notes_id=?';
    EXECUTE stmt using @notesName, @notesDate, @account_id, @notes_id;
    DEALLOCATE PREPARE stmt;
END;


CREATE PROCEDURE updateBudget (IN AccountID VARCHAR(36), Budget INT)
BEGIN
    SET @AccountID = AccountID;
    SET @Budget = Budget;

    PREPARE stmt FROM 'UPDATE budget SET Budget=? WHERE AccountID=?';
    EXECUTE stmt using @Budget, @AccountID;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE updateExpense (IN AccountID VARCHAR(36), ID VARCHAR(36), Name VARCHAR(255), Amount DECIMAL(65, 2) , Date DATE)
BEGIN
    SET @AccountID = AccountID;
    SET @ID = ID;
    SET @Name = Name;
    SET @Amount = Amount;
    SET @Date = Date;

    PREPARE stmt FROM 'UPDATE expense SET Name=?, Amount=?, Date=? WHERE AccountID=? and ID=?';
    EXECUTE stmt using @Name, @Amount, @Date, @AccountID, @ID;
    DEALLOCATE PREPARE stmt;
END;

-- @block
-- Consists of stored procedure that delete data
DROP PROCEDURE IF EXISTS deleteExpenseData;

CREATE PROCEDURE deleteExpenseData (IN AccountID VARCHAR(36), ID VARCHAR(36))
BEGIN
    SET @AccountID = AccountID;
    SET @ID = ID;

    PREPARE stmt FROM 'DELETE FROM expense WHERE AccountID=? and ID=?';
    EXECUTE stmt using @AccountID, @ID;
    DEALLOCATE PREPARE stmt;
END;


-- @block
select * from events;

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

-- @block
select * from notes;

--@block
call updateExpense('5a6048a2-d47e-408d-b38e-cf9ebfa189d5', '348cc4d2-05aa-4acb-940b-7824228faa66', 'q', 1000003.98, '2022-07-24')

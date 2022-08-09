-- @block
DROP TABLE IF EXISTS account, events, category, todo, budget, expense, notes    ;

CREATE TABLE account(
    id  VARCHAR(36) PRIMARY KEY NOT NULL UNIQUE,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR (255) NOT NULL
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
    ID          VARCHAR(36) PRIMARY KEY NOT NULL UNIQUE,
    Name        VARCHAR(255) NOT NULL,
    Date        DATE NOT NULL,
    StartTime 	TIME NOT NULL,
	EndTime	    TIME NOT NULL,
    Description TEXT NULL,
    CategoryID  VARCHAR(36) NULL,
    FOREIGN KEY (AccountID) REFERENCES account(id) ON DELETE CASCADE,
    FOREIGN KEY (CategoryID) REFERENCES category(ID) ON DELETE SET DEFAULT
);

CREATE TABLE todo(
    AccountID   VARCHAR(36) NOT NULL,
    ID          VARCHAR(36) PRIMARY KEY NOT NULL UNIQUE,
    Name        VARCHAR(255) NOT NULL,
    Date        DATE NOT NULL,
    Checked     TINYINT(1) NOT NULL,
    FOREIGN KEY (AccountID) REFERENCES account(id) ON DELETE CASCADE
);

CREATE TABLE budget(
    AccountID   VARCHAR(36) NOT NULL,
    Budget      INT NOT NULL,
    FOREIGN KEY (AccountID) REFERENCES account(id) ON DELETE CASCADE
);

CREATE TABLE expense(
    AccountID   VARCHAR(36) NOT NULL,
    ID          VARCHAR(36) PRIMARY KEY NOT NULL UNIQUE,
    Name        VARCHAR(255) NOT NULL,
    Amount      DECIMAL(65,2) NOT NULL,
    Date        DATE NOT NULL,
    FOREIGN KEY (AccountID) REFERENCES account(id) ON DELETE CASCADE
);

CREATE TABLE notes(
    AccountID   VARCHAR(36) NOT NULL,
    ID          VARCHAR(36)PRIMARY KEY NOT NULL UNIQUE,
    Name        VARCHAR(255) NOT NULL,
    Description TEXT NULL,
    FOREIGN KEY (AccountID) REFERENCES account(id) ON DELETE CASCADE
);


-- @BLOCK
DROP FUNCTION IF EXISTS uuid_v4s;

CREATE FUNCTION uuid_v4s()
    RETURNS CHAR(36)
    NO SQL
BEGIN
    -- 1th and 2nd block are made of 6 random bytyes
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
-- Consists of stored procedure to inserts data
DROP PROCEDURE IF EXISTS insertAccountData;
DROP PROCEDURE IF EXISTS insertCategoryData;
DROP PROCEDURE IF EXISTS insertEventData;
DROP PROCEDURE IF EXISTS insertTodoData;
DROP PROCEDURE IF EXISTS insertExpenseData;
DROP PROCEDURE IF EXISTS insertNotesData;

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

    SET @budget = 1000;
    PREPARE stmt FROM 'INSERT INTO budget VALUES(?, ?)'; 
    EXECUTE stmt USING @ID, @budget;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE insertCategoryData (IN accountID VARCHAR(36), categoryName VARCHAR(255), categoryColor VARCHAR(36))
BEGIN
    SET @accountID = accountID;
    SET @categoryName = categoryName;
    SET @categoryColor = categoryColor;

    SET @ID = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM category where id=? INTO @count'; 
    EXECUTE stmt USING @ID;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @ID = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM category where id=? INTO @count'; 
        EXECUTE stmt USING @ID;
        DEALLOCATE PREPARE stmt;
    END WHILE;
    
    PREPARE stmt FROM 'INSERT INTO category VALUES(?, ?, ?, ?)';
    EXECUTE stmt USING @accountID, @ID, @categoryName, @categoryColor;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE insertEventData (IN accountID VARCHAR(36), eventName VARCHAR(255), date DATE, startTime TIME, endTime TIME, description VARCHAR(255), categoryID VARCHAR(36))
BEGIN
    SET @accountID = accountID;
    SET @eventName = eventName;
    SET @date = date;
    SET @startTime = startTime;
    SET @endTime = endTime;
    SET @description = description;
    SET @categoryID = categoryID;

    SET @ID = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM events where id=? INTO @count'; 
    EXECUTE stmt USING @ID;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @ID = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM events where id=? INTO @count'; 
        EXECUTE stmt USING @ID;
        DEALLOCATE PREPARE stmt;
    END WHILE;
    
    PREPARE stmt FROM 'INSERT INTO events VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
    EXECUTE stmt USING @accountID, @ID, @eventName, @date, @startTime, @endTime, @description, @categoryID;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE insertTodoData (IN accountID VARCHAR(36), todoName VARCHAR(255), date DATE)
BEGIN
    SET @accountID = accountID;
    SET @todoName = todoName;
    SET @date = date;
    SET @checked = 0;

    SET @ID = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM todo where id=? INTO @count'; 
    EXECUTE stmt USING @ID;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @ID = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM todo where id=? INTO @count'; 
        EXECUTE stmt USING @ID;
        DEALLOCATE PREPARE stmt;
    END WHILE;
    
    PREPARE stmt FROM 'INSERT INTO todo VALUES(?, ?, ?, ?, ?)';
    EXECUTE stmt USING @accountID, @ID, @todoName, @date, @checked;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE insertExpenseData (IN AccountID VARCHAR(36), Name VARCHAR(255), Amount DECIMAL(65, 2), Date DATE)
BEGIN
    SET @AccountID = AccountID;
    SET @Name = Name;
    SET @Amount = Amount;
    SET @Date = Date;

    SET @ID = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM expense WHERE ID = ? INTO @count'; 
    EXECUTE stmt USING @ID;
    DEALLOCATE PREPARE stmt;
    
    WHILE (@count = 1)
    DO
        SET @ID = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM expense WHERE ID = ? INTO @count'; 
        EXECUTE stmt USING @ID;
        DEALLOCATE PREPARE stmt;
    END WHILE;

    PREPARE stmt FROM 'INSERT INTO expense VALUES (?, ?, ?, ?, ?)';
    EXECUTE stmt USING @AccountID, @ID, @Name, @Amount, @Date;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE insertNotesData (IN accountID VARCHAR(36), notesName VARCHAR(255), description VARCHAR(255))
BEGIN
    SET @accountID = accountID;
    SET @notesName = notesName;
    SET @description = description;

    SET @ID = uuid_v4s();

    PREPARE stmt FROM 'SELECT count(*) FROM notes WHERE ID = ? INTO @count'; 
    EXECUTE stmt USING @ID;
    DEALLOCATE PREPARE stmt;

    WHILE (@count = 1)
    DO
        SET @ID = uuid_v4s();
        PREPARE stmt FROM 'SELECT count(*) FROM notes WHERE ID = ? INTO @count'; 
        EXECUTE stmt USING @ID;
        DEALLOCATE PREPARE stmt;
    END WHILE;

    PREPARE stmt FROM 'INSERT INTO notes VALUES (?, ?, ?, ?)';
    EXECUTE stmt USING @accountID, @ID, @notesName, @description;
    DEALLOCATE PREPARE stmt;
END;


-- @block
-- Consists of stored procedure to update data
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

CREATE PROCEDURE updateCategory (IN accountID VARCHAR(36), ID VARCHAR(36), categoryName VARCHAR(255), categoryColor VARCHAR(36))
BEGIN
    SET @accountID = accountID;
    SET @ID = ID;
    SET @categoryName = categoryName;
    SET @categoryColor = categoryColor;
    
    PREPARE stmt FROM 'UPDATE category SET Name=?, Color=? WHERE AccountID=? AND ID=?';
    EXECUTE stmt USING @categoryName, @categoryColor, @accountID, @ID;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE updateEvent (IN accountID VARCHAR(36), ID VARCHAR(36), eventName VARCHAR(255), date DATE, startTime TIME, endTime TIME, description VARCHAR(255), categoryID VARCHAR(36))
BEGIN
    SET @accountID = accountID;
    SET @ID = ID;
    SET @eventName = eventName;
    SET @date = date;
    SET @startTime = startTime;
    SET @endTime = endTime;
    SET @description = description;
    SET @categoryID = categoryID;

    PREPARE stmt FROM 'UPDATE events SET Name=?, Date=?, StartTime=?, EndTime=?, Description=?, CategoryID=? WHERE AccountID=? AND ID=?';
    EXECUTE stmt USING @eventName, @date, @startTime, @endTime, @description, @categoryID, @accountID, @ID;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE updateTodo (IN accountID VARCHAR(36), ID VARCHAR(36), todoName VARCHAR(255), date DATE)
BEGIN
    SET @accountID = accountID;
    SET @ID = ID;
    SET @todoName = todoName;
    SET @date = date;

    PREPARE stmt FROM 'UPDATE todo SET Name=?, Date=? WHERE AccountID=? AND ID=?';
    EXECUTE stmt USING @todoName, @date, @accountID, @ID;
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

CREATE PROCEDURE updateNotes (IN accountID VARCHAR(36), notesName VARCHAR(255), description VARCHAR(255))
BEGIN
    SET @accountID = accountID;
    SET @ID = ID;
    SET @notesName = notesName;
    SET @description = description;
    
    PREPARE stmt FROM 'UPDATE notes SET Name=?, Description=? WHERE AccountID=? and ID=?';
    EXECUTE stmt USING @notesName, @description, @accountID, @ID;
    DEALLOCATE PREPARE stmt;
END;

--@block


-- @block
-- Consists of stored procedure to delete data
DROP PROCEDURE IF EXISTS deleteCategoryData;
DROP PROCEDURE IF EXISTS deleteEventData;
DROP PROCEDURE IF EXISTS deleteTodoData;
DROP PROCEDURE IF EXISTS deleteExpenseData;
DROP PROCEDURE IF EXISTS deleteNotesData;

CREATE PROCEDURE deleteCategoryData (IN AccountID VARCHAR(36), ID VARCHAR(36))
BEGIN
    SET @AccountID = AccountID;
    SET @ID = ID;

    PREPARE stmt FROM 'DELETE FROM category WHERE AccountID=? AND ID=?';
    EXECUTE stmt using @AccountID, @ID;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE deleteEventData (IN AccountID VARCHAR(36), ID VARCHAR(36))
BEGIN
    SET @AccountID = AccountID;
    SET @ID = ID;

    PREPARE stmt FROM 'DELETE FROM events WHERE AccountID=? and ID=?';
    EXECUTE stmt using @AccountID, @ID;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE deleteTodoData (IN AccountID VARCHAR(36), ID VARCHAR(36))
BEGIN
    SET @AccountID = AccountID;
    SET @ID = ID;

    PREPARE stmt FROM 'DELETE FROM todo WHERE AccountID=? and ID=?';
    EXECUTE stmt using @AccountID, @ID;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE deleteExpenseData (IN AccountID VARCHAR(36), ID VARCHAR(36))
BEGIN
    SET @AccountID = AccountID;
    SET @ID = ID;

    PREPARE stmt FROM 'DELETE FROM expense WHERE AccountID=? and ID=?';
    EXECUTE stmt using @AccountID, @ID;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE deleteNotesData (IN AccountID VARCHAR(36), ID VARCHAR(36))
BEGIN
    SET @AccountID = AccountID;
    SET @ID = ID;

    PREPARE stmt FROM 'DELETE FROM notes WHERE AccountID=? and ID=?';
    EXECUTE stmt using @AccountID, @ID;
    DEALLOCATE PREPARE stmt;
END;


-- @block
-- Consists of stored procedure to select data
DROP PROCEDURE IF EXISTS selectEmail_Id;
DROP PROCEDURE IF EXISTS selectId_Email;
DROP PROCEDURE IF EXISTS selectTodo_AccountID;
DROP PROCEDURE IF EXISTS selectEvent_AccountID_Date;
DROP PROCEDURE IF EXISTS selectSumExpense_AccountID;
DROP PROCEDURE IF EXISTS selectSumExpense_AccountID_Month;
DROP PROCEDURE IF EXISTS selectExpenseData_Month;
DROP PROCEDURE IF EXISTS selectBudget_AccountID;
DROP PROCEDURE IF EXISTS selectExpenseHistory;

CREATE PROCEDURE selectEmail_Id (IN id VARCHAR(36))
BEGIN
    SET @id = id;

    PREPARE stmt FROM 'SELECT email FROM account WHERE id=?';
    EXECUTE stmt USING @id;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE selectId_Email (IN email VARCHAR(255))
BEGIN
    SET @email = email;

    PREPARE stmt FROM 'SELECT id FROM account WHERE email=?';
    EXECUTE stmt USING @email;
    DEALLOCATE PREPARE stmt;
END;


CREATE PROCEDURE selectTodo_AccountID (IN accountID VARCHAR(36))
BEGIN
    SET @accountID = accountID;

    PREPARE stmt FROM 'SELECT ID, Name, DATE_FORMAT(Date, "%Y-%m-%d") Date, Checked FROM todo WHERE AccountID=?';
    EXECUTE stmt USING @accountID;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE selectEvent_AccountID_Date (IN accountID VARCHAR(36), date DATE)
BEGIN
    SET @accountID = accountID;
    SET @date = date;

    PREPARE stmt FROM 'SELECT ID, Name, DATE_FORMAT(Date, "%Y-%m-%d") Date, StartTime, EndTime, Description, CategoryID FROM events WHERE AccountID=? AND Date=?';
    EXECUTE stmt USING @accountID, @date;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE selectCategory_AccountID (IN accountID VARCHAR(36))
BEGIN
    SET @accountID = accountID;

    PREPARE stmt FROM 'SELECT ID, Name, Color FROM category WHERE AccountID=?';
    EXECUTE stmt USING @accountID;
    DEALLOCATE PREPARE stmt;
END;


CREATE PROCEDURE selectSumExpense_AccountID_Month (IN ID VARCHAR(36), Date DATE)
BEGIN
    SET @ID = ID;
    SET @Date = Date;

    PREPARE stmt FROM 'SELECT sum(amount) TotalExpense FROM expense WHERE AccountId = ? AND DATE_FORMAT(Date, "%Y-%m") = DATE_FORMAT(?, "%Y-%m")';
    EXECUTE stmt USING @ID, @Date;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE selectExpenseData_Month (IN AccountID VARCHAR(36), Date Date)
BEGIN
    SET @AccountID = AccountID;
    SET @Date = Date;

    PREPARE stmt FROM 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? AND DATE_FORMAT(Date, "%Y-%m") = DATE_FORMAT(?, "%Y-%m")';
    EXECUTE stmt USING @AccountID, @Date;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE selectSumExpense_AccountID (IN ID VARCHAR(36))
BEGIN
    SET @ID = ID;

    PREPARE stmt FROM 'SELECT sum(amount) TotalExpense FROM expense WHERE AccountId = ?';
    EXECUTE stmt USING @ID;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE selectBudget_AccountID (IN AccountID VARCHAR(36))
BEGIN
    SET @AccountID = AccountID;

    PREPARE stmt FROM 'SELECT Budget FROM budget WHERE AccountId = ?';
    EXECUTE stmt USING @AccountID;
    DEALLOCATE PREPARE stmt;
END;

CREATE PROCEDURE selectExpenseHistory (IN AccountID VARCHAR(36))
BEGIN
    SET @AccountID = AccountID;

    PREPARE stmt FROM 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? order by Date desc, Name, Amount';
    EXECUTE stmt USING @AccountID;
    DEALLOCATE PREPARE stmt;
END;


-- @block
select * from events;

-- @block
select * FROM account;

-- @blockyes
select * from category;

-- @block
select * from todo;

-- @block
select * from budget;

-- @block
select * from expense;

-- @block
select * from notes;

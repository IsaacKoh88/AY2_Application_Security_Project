This is an application security project developed by 4 students from [Nanyang Polytechnic](https://www.nyp.edu.sg/)

## Getting Started

Ensure that [Docker](https://www.docker.com/), [OpenSSL](https://www.openssl.org/) and [Nodejs](https://nodejs.org/) are installed and set up

#### Step 1: Generate SSL Certificates

Windows:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\generate-ssl-cert.ps1
```

Mac & Linux:

```bash
bash ./generate-ssl-cert.bash
```

#### Step 2: Build Docker Image

```bash
docker-compose build
```

#### Step 3: Run Application

```bash
docker-compose up
```

Open [https://localhost:](https://localhost) with your browser to see the result.

## API Documentation

#### Public

* [Signup API](api-documentation/signup.md)
* [Login API](api-documentation/login.md)
* [Logout API](api-documentation/logout.md)

#### Account Management

* [Get Account Details API](api-documentation/get-account.md)
* [Edit Account Details API](api-documentation/edit-account.md)
* [Change Account Password API](api-documentation/change-password.md)

#### Calendar Events

* [Get Events API](api-documentation/get-event.md)
* [Create Events API](api-documentation/create-event.md)
* [Edit Events API](api-documentation/edit-event.md)
* [Delete Events API](api-documentation/delete-event.md)

#### Calendar Category

* [Get Categories API](api-documentation/get-category.md)
* [Create Categories API](api-documentation/create-category.md)
* [Edit Categories API](api-documentation/edit-category.md)
* [Delete Categories API](api-documentation/delete-category.md)

#### Todos

* [Get Todos API](api-documentation/get-todos.md)
* [Create Todos API](api-documentation/create-todos.md)
* [Edit Todos API](api-documentation/edit-todos.md)
* [Check Todos API](api-documentation/check-todos.md)
* [Delete Todos API](api-documentation/delete-todos.md)
* [Delete Done Todos API](api-documentation/delete-done-todos.md)

#### Notes

* [Get Notes API](api-documentation/get-notes.md)
* [Create Notes API](api-documentation/create-notes.md)
* [Edit Notes API](api-documentation/edit-notes.md)
* [Delete Notes API](api-documentation/delete-notes.md)

#### Budgets

* [Get Budget API](api-documentation/get-budget.md)
* [Edit Budget API](api-documentation/edit-budget.md)

#### Expenses

* [Get Expenses API](api-documentation/get-expenses.md)
* [Get Total Expenses API](api-documentation/get-expenses-total.md)
* [Get Expense History API](api-documentation/get-expenses-history.md)
* [Create Expenses API](api-documentation/create-expenses.md)
* [Edit Expenses API](api-documentation/edit-expenses.md)
* [Delete Expenses API](api-documentation/delete-expenses.md)
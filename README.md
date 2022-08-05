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
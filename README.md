# 🚀 Secure DevSecOps Platform with Containerized Microservices & Distributed Monitoring

## 📌 Project Overview

This project demonstrates the **design and implementation of a secure, production-grade DevSecOps pipeline** using containerized frontend and backend microservices deployed across **multiple Debian Linux machines**.

The system integrates **CI/CD, security scanning, automated deployments, and centralized monitoring**, following **industry-aligned DevSecOps and shift-left security principles**.

The platform enables:

- Secure user registration and authentication
    
- Automated vulnerability detection at code and dependency level
    
- Continuous deployment using Jenkins
    
- End-to-end observability using Prometheus and Grafana
    

* * *

## 🏗️ Infrastructure Layout

| Machine | IP Address | Role |
| --- | --- | --- |
| Machine 1 | `192.168.80.10` | Frontend Container Host |
| Machine 2 | `192.168.80.20` | Backend API + MariaDB |
| Machine 3 | `192.168.80.30` | Jenkins, SonarQube, Trivy, npm audit |
| Machine 4 | `192.168.80.40` | Prometheus & Grafana |

✔ All machines run **Debian Linux**  
✔ Communication occurs over a **private network**  
✔ **Passwordless SSH (key-based authentication)** is configured from Jenkins to all target hosts

* * *

## 🧠 System Architecture (High-Level)
image here 

* * *

## 🔄 User Creation – Full Request Flow (End-to-End)

### 📍 Step-by-Step Flow

1.  **User Interaction**
    
    - User submits registration details (username, email, password) via browser.
        
    - Request is sent to the frontend container.
        
2.  **Frontend Processing**
    
    - Frontend validates input (basic client-side validation).
        
    - Sends a secure REST API request to backend.
        
3.  **Backend Processing**
    
    - Backend validates request payload.
        
    - Password is **hashed** using secure cryptographic functions.
        
    - Business logic checks for duplicate users.
        
4.  **Database Interaction**
    
    - Backend sends SQL query to MariaDB.
        
    - User record is inserted into the database.
        
5.  **Response Propagation**
    
    - Backend sends success/failure response.
        
    - Frontend displays confirmation to the user.
        

### 🔁 Flow Diagram

image here 

* * *

## 🔐 Security Design Principles

- **Shift-Left Security**: Security checks integrated early in CI pipeline
    
- **Container Isolation**: Frontend and backend run in separate containers
    
- **Network Segmentation**: Independent Docker networks
    
- **Key-Based SSH**: Eliminates password-based attack surface
    
- **Automated Vulnerability Detection**: No manual security checks
    

* * *

## ⚙️ DevSecOps CI/CD Architecture

image here

* * *

## 🧪 CI/CD Pipeline Stages (Mapped to Jenkinsfile)

| Stage | Purpose |
| --- | --- |
| Checkout | Fetch source code from GitHub |
| npm audit (FE) | Detect frontend dependency vulnerabilities |
| npm audit (BE) | Detect backend dependency vulnerabilities |
| SonarQube | Static code quality & security analysis |
| Quality Gate | Enforce code quality standards |
| Trivy Scan | Detect vulnerabilities, secrets & misconfigurations |
| Deploy Frontend | Build & run frontend Docker container |
| Deploy Backend | Build backend + ensure MariaDB availability |
| Archive Reports | Preserve security scan results |
| Email Notification | Notify build status |

* * *

## 📊 Monitoring & Observability Architecture

image here

### 📈 Metrics Collected

- CPU utilization
    
- Memory usage
    
- Disk I/O
    
- Container health
    
- Host availability
    

### 🎯 Benefits

- Proactive incident detection
    
- Infrastructure health visibility
    
- Performance bottleneck analysis
    

* * *

## 🛠️ Technologies Used

| Technology | Purpose |
| --- | --- |
| Jenkins | CI/CD Orchestration |
| Docker | Containerization |
| React | Frontend UI |
| Node.js | Backend API |
| MariaDB | Relational Database |
| SonarQube | Static Code Analysis |
| Trivy | Vulnerability & Secret Scanning |
| npm audit | Dependency Security |
| Prometheus | Metrics Collection |
| Grafana | Visualization & Dashboards |
| SSH | Secure Automation |
| Debian Linux | Host OS |

* * *

## ✅ Key Outcomes

- Fully automated **secure CI/CD pipeline**
    
- Zero manual deployment steps
    
- Early detection of vulnerabilities
    
- Scalable microservice architecture
    
- Enterprise-grade monitoring setup

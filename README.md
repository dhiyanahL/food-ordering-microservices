# 📦 BiteCloud — Cloud-Native Food Ordering & Delivery Platform  

## 📖 Project Overview  

**BiteCloud** is a cloud-native food ordering and delivery platform inspired by applications like **PickMe Food** and **UberEats**. The system enables customers to browse a variety of restaurants, place orders online, and have them delivered to their location efficiently. It also provides restaurant administrators with tools to manage their restaurants, menus, and orders, while delivery personnel can manage and track assigned deliveries in real time.

The platform is built using a **Microservices Architecture**, ensuring **scalability**, **modularity**, and **independent service deployment** for each core functionality.

---

## 🎯 Project Objectives  

The primary objectives of this project were to:

- ✅ Provide a **user-friendly web interface** for customers, restaurant admins, and delivery personnel.
- ✅ Develop **independently deployable microservices** for:
  - User Management
  - Order Management  
  - Restaurant Management  
  - Delivery Management  
  - Payment Processing  
  - Notification Management  
- ✅ Integrate a **secure payment gateway** using the **Stripe API**.
- ✅ Implement **real-time notification mechanisms** for order confirmations and delivery updates.
- ✅ Ensure system **scalability and resilience** through containerization and orchestration.
- ✅ Incorporate **authentication and authorization mechanisms**, including:
  - **JWT-based security**
  - **Role-based access control**
  - **Google OAuth integration**

---

## ⚙️ Tech Stack  

| Layer               | Technology / Tools                                                  |
|:-------------------|:-------------------------------------------------------------------|
| **Frontend**         | React.js (with Axios for REST API calls)                           |
| **Backend**          | Node.js, Express.js (RESTful microservices)                        |
| **Database**         | MongoDB (shared cluster with separate collections per service)     |
| **Authentication**   | JWT, Google OAuth                                                  |
| **Payment Gateway**  | Stripe API (Sandbox Environment)                                   |
| **Notifications**    | Nodemailer (Email), Socket.io (App Notifications)                  |
| **Containerization** | Docker, Docker Compose                                             |
| **Orchestration**    | Docker Compose (for multi-container deployment management)         |

---

## 🗂️ Microservices Overview  

- **User Management Service**  
- **Restaurant Management Service**  
- **Order Management Service**  
- **Delivery Management Service**  
- **Payment Service**  
- **Notification Service**  
- **Admin Management Service**  

Each service runs independently while communicating via REST APIs, adhering to a microservices communication model.

---

## 📦 Deployment & Orchestration  

The entire system is containerized using **Docker**, with services orchestrated via **Docker Compose** for easy deployment and multi-service environment management.

### 🚀 To run the system locally:

1. **Clone the repository:**

   ```bash
   git clone [repository-link]
   cd BiteCloud
   ```

2. **Start all services using Docker Compose:**

   ```bash
   docker-compose up --build
   ```

3. **Access the application:**

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend services:** Available on their respective configured ports (refer to `docker-compose.yml`)

---

## 📌 Key Features  

### 📱 Customer Dashboard  

- Browse restaurants and menus  
- Place and manage orders  
- Track delivery status in real time  
- View favorite restaurants  
- Access order history  
- See food facts fetched from an external API  
- Earn loyalty points based on purchases  

### 🏪 Restaurant Admin Dashboard  

- Manage restaurant profiles  
- Create and update menus  
- View and manage orders  
- Post restaurant-specific notifications  

### 🚚 Delivery Personnel Dashboard  

- View and accept assigned delivery orders  
- Update order delivery statuses  

### 🛠️ Admin Dashboard  

- Manage system-wide promotional offers  
- Track user statistics by role  
- View platform activity analytics  

### 💸 Secure Online Payment  

- Process payments via **Stripe API** (Sandbox Environment)

### 📬 Real-time Notifications  

- Email notifications via **Nodemailer**  
- In-app notifications via **Socket.io**

### 🔒 Authentication & Security  

- **JWT-based secure login**  
- **Google OAuth integration**  
- **Role-based access control**




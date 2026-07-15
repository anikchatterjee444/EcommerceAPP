# ShopIT

**Smart Shopping, Simplified**

A production-style full-stack e-commerce platform built during my internship at **Indpro**.

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Bootstrap 5
- Axios
- React Hook Form
- React Toastify

### Backend
- NestJS 11
- TypeScript
- Prisma ORM
- JWT Authentication
- bcrypt

### Database
- PostgreSQL 16

### Infrastructure
- Docker Compose

---

# Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Password Hashing (bcrypt)

## Products

- Product Listing
- Product Details
- Search
- Category Filtering
- Sorting
- Pagination

## Shopping Cart

- Add to Cart
- Update Quantity
- Remove Item
- Cart Summary

## Orders

- Checkout
- Stock Validation
- Order History
- Order Details

## User Profile

- Profile Page
- Authentication Status

---

# Project Structure

app/
├── backend/
│ ├── auth/
│ ├── users/
│ ├── products/
│ ├── cart/
│ ├── orders/
│ └── prisma/
│
├── frontend/
│ ├── app/
│ ├── components/
│ ├── context/
│ ├── hooks/
│ ├── services/
│ └── types/
│
├── docker-compose.yml
└── README.md

---

# Architecture

Frontend (Next.js)

↓

Axios

↓

NestJS REST API

↓

Controllers

↓

Services

↓

Prisma ORM

↓

PostgreSQL

---

# Backend Architecture

Controller

↓

Service

↓

Prisma

↓

PostgreSQL

Business logic is isolated inside Services.

Prisma is the single point of database interaction.

Authentication is handled using JWT Guards.

---

# Getting Started

## 1 Start PostgreSQL

docker compose up -d

## 2 Backend

cd backend

npm install

npx prisma generate

npx prisma db push

npm run start:dev

Backend

http://localhost:3002

## 3 Frontend

cd frontend

npm install

npm run dev

Frontend

http://localhost:3000

---

# Completed Modules

- Authentication
- Products
- Product Details
- Cart
- Checkout
- Orders
- Profile
- Landing Page
- Responsive UI
- Accessibility Improvements

---

# Development Workflow

Feature Branches

main

↓

feature/jwt-auth

↓

feature/products

↓

feature/orders

↓

feature/frontend

↓

Pull Request

↓

Merge

---

# Future Improvements

- Payment Gateway Integration
- Wishlist
- Product Reviews
- Admin Dashboard
- Email Verification
- Inventory Dashboard

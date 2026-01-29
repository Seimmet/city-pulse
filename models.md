# API Schemas & Database Models

This document defines the **database models (PostgreSQL / Neon)** and **API schemas (REST-style)** derived strictly from the PRD. The design enforces **multi-tenancy, city-based isolation, and role-based access control**.

---

## 1. Core Design Principles

* **Multi-tenant by city** (`city_id` is mandatory on most tables)
* **One publisher per city** (enforced at DB + API level)
* **RBAC enforced at API layer**
* **Backend-agnostic frontend** (clean API contracts)
* **Scalable & auditable** (timestamps everywhere)

---

## 2. Database Models (PostgreSQL)

### 2.1 Users

```sql
users (
  id UUID PRIMARY KEY,
  full_name VARCHAR(150),
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT,
  role ENUM('SUPER_ADMIN', 'PUBLISHER', 'EDITOR', 'READER'),
  city_id UUID NULL,
  status ENUM('ACTIVE', 'SUSPENDED', 'PENDING'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

Notes:

* `city_id` is NULL for Super Admin
* All other roles must belong to a city

---

### 2.2 Cities

```sql
cities (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  country VARCHAR(100),
  slug VARCHAR(120) UNIQUE,
  status ENUM('ACTIVE', 'INACTIVE'),
  created_at TIMESTAMP
);
```

---

### 2.3 Publishers (City License Holder)

```sql
publishers (
  id UUID PRIMARY KEY,
  city_id UUID UNIQUE REFERENCES cities(id),
  company_name VARCHAR(150),
  license_status ENUM('ACTIVE', 'SUSPENDED', 'EXPIRED'),
  revenue_share_percent INT,
  created_at TIMESTAMP
);
```

Rule:

* `city_id` is UNIQUE → enforces one publisher per city

---

### 2.4 Editions (Monthly Magazines)

```sql
editions (
  id UUID PRIMARY KEY,
  city_id UUID REFERENCES cities(id),
  title VARCHAR(150),
  month VARCHAR(20),
  year INT,
  pdf_url TEXT,
  preview_pages INT,
  status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
  published_at TIMESTAMP,
  created_at TIMESTAMP
);
```

---

### 2.5 Articles / Content

```sql
contents (
  id UUID PRIMARY KEY,
  city_id UUID REFERENCES cities(id),
  edition_id UUID REFERENCES editions(id),
  type ENUM('EVENT', 'PROFILE', 'INTERVIEW', 'FASHION', 'SPONSORED'),
  title VARCHAR(200),
  body TEXT,
  cover_image TEXT,
  author_id UUID REFERENCES users(id),
  status ENUM('DRAFT', 'REVIEW', 'PUBLISHED'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

### 2.6 Media Assets

```sql
media (
  id UUID PRIMARY KEY,
  city_id UUID REFERENCES cities(id),
  type ENUM('IMAGE', 'VIDEO', 'PDF'),
  url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP
);
```

---

### 2.7 Subscriptions

```sql
subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  city_id UUID REFERENCES cities(id),
  stripe_subscription_id TEXT,
  plan ENUM('MONTHLY', 'YEARLY'),
  status ENUM('ACTIVE', 'CANCELLED', 'EXPIRED'),
  started_at TIMESTAMP,
  ends_at TIMESTAMP
);
```

---

### 2.8 Advertisements

```sql
ads (
  id UUID PRIMARY KEY,
  city_id UUID REFERENCES cities(id),
  type ENUM('BANNER', 'FULL_PAGE', 'SPONSORED_ARTICLE'),
  asset_url TEXT,
  link_url TEXT,
  start_date DATE,
  end_date DATE,
  status ENUM('ACTIVE', 'PAUSED'),
  created_at TIMESTAMP
);
```

---

### 2.9 Analytics (Simplified)

```sql
analytics (
  id UUID PRIMARY KEY,
  city_id UUID,
  entity_type VARCHAR(50),
  entity_id UUID,
  metric VARCHAR(50),
  value INT,
  recorded_at TIMESTAMP
);
```

---

## 3. API Schemas (REST)

### 3.1 Authentication

```
POST   /auth/login
POST   /auth/register
POST   /auth/forgot-password
```

---

### 3.2 Cities (Admin Only)

```
GET    /admin/cities
POST   /admin/cities
PATCH  /admin/cities/{id}
DELETE /admin/cities/{id}
```

---

### 3.3 Publishers (Admin Only)

```
GET    /admin/publishers
POST   /admin/publishers
PATCH  /admin/publishers/{id}
```

---

### 3.4 Editions

```
GET    /cities/{cityId}/editions
POST   /publisher/editions
PATCH  /publisher/editions/{id}
GET    /editions/{id}
```

---

### 3.5 Content Management

```
GET    /publisher/contents
POST   /publisher/contents
PATCH  /publisher/contents/{id}
GET    /contents/{id}
```

---

### 3.6 Subscriptions

```
POST   /subscriptions/create
GET    /subscriptions/me
POST   /subscriptions/cancel
```

---

### 3.7 Ads

```
GET    /publisher/ads
POST   /publisher/ads
PATCH  /publisher/ads/{id}
```

---

### 3.8 Analytics

```
GET    /admin/analytics
GET    /publisher/analytics
```

---

## 4. Access Control Summary

| Role        | Scope              |
| ----------- | ------------------ |
| Super Admin | All cities         |
| Publisher   | Assigned city only |
| Editor      | Content only       |
| Reader      | Read-only          |

---

## 5. Notes for Trae / Antigravity

* Enforce `city_id` on every query
* Validate role before controller execution
* Use middleware for tenant isolation
* Stripe & Cloudinary IDs stored as references only

---

**End of API & Database Specification**

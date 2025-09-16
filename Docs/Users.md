# User-Role-Permission Design Documentation

## Overview

This document outlines the MongoDB database design for the **User**, **Role**, and **Permission** collections in the Library Management System, focusing on authentication, authorization, and access control.

The design uses **references** instead of embedding to ensure flexibility and scalability, since users are linked to roles, and roles are linked to permissions.

---

## Collections Design

### 1. Users Collection

**Purpose:** Stores user account information and their assigned role.

**Schema Structure:**
```json
{
  "_id": ObjectId,
  "userId": String,         // Unique identifier for user
  "firstName": String,      // Required
  "lastName": String,       // Required
  "username": String,       // Required, unique
  "dateOfBirth": Date,
  "email": String,          // Required, unique, validated format
  "password": String,       // Hashed password
  "address": String,
  "status": String,         // Enum: ["ACTIVE", "INACTIVE", "SUSPENDED"]
  "roleId": String,         // References roles._id
  "createdAt": Date,
  "updatedAt": Date
}
```

**Business Rules:**
- `username` and `email` must be unique.  
- `status` must be `ACTIVE` for login and access.  
- Passwords must always be stored **hashed**.  

---

### 2. Roles Collection

**Purpose:** Defines different user roles and their associated permissions.

**Schema Structure:**
```json
{
  "_id": String,           // Unique role identifier (e.g., "R1")
  "roleName": String,      // Role name (e.g., "Librarian", "Admin")
  "description": String,   // Description of responsibilities
  "permissionIds": [String], // References permissions._id
  "createdAt": Date,
  "updatedAt": Date
}
```

**Business Rules:**
- `roleName` must be unique.  
- Each role can have one or more permissions.  

---

### 3. Permissions Collection

**Purpose:** Defines specific actions allowed in the system.

**Schema Structure:**
```json
{
  "_id": String,             // Unique permission identifier (e.g., "P1")
  "permissionName": String,  // Action (e.g., "CREATE_BOOK")
  "description": String,     // Explanation of permission
  "createdAt": Date,
  "updatedAt": Date
}
```

**Example Permissions:**
- **P1** → CREATE_BOOK  
- **P2** → UPDATE_BOOK  
- **P3** → DELETE_BOOK  
- **P4** → ISSUE_BOOK  
- **P5** → RETURN_BOOK  
- **P6** → MANAGE_USERS  

---

## Relationships

### 1. Users ↔ Roles (Many-to-One)
- Each user has exactly **one role**.  
- A role can be assigned to **many users**.  
- Implementation: `users.roleId` references `roles._id`.  

**Query Example:** Get a user with role details
```js
db.users.aggregate([
  { $match: { "username": "admin_user" } },
  { $lookup: {
      from: "roles",
      localField: "roleId",
      foreignField: "_id",
      as: "roleDetails"
    }
  }
])
```

---

### 2. Roles ↔ Permissions (Many-to-Many)
- Each role can have **multiple permissions**.  
- Each permission can belong to **multiple roles**.  
- Implementation: `roles.permissionIds` references `permissions._id`.  

**Query Example:** Get permissions of a user
```js
db.users.aggregate([
  { $match: { "username": "admin_user" } },
  { $lookup: {
      from: "roles",
      localField: "roleId",
      foreignField: "_id",
      as: "userRoles"
    }
  },
  { $unwind: "$userRoles" },
  { $lookup: {
      from: "permissions",
      localField: "userRoles.permissionIds",
      foreignField: "_id",
      as: "userPermissions"
    }
  }
])
```

---

## Sample Documents

**User Sample:**
```json
{
  "userId": "U12345",
  "firstName": "Nimal",
  "lastName": "Perera",
  "username": "nimal",
  "dateOfBirth": "2000-05-15",
  "email": "nimal@example.com",
  "password": "<hashed_password>",
  "address": "123 Library Street, Colombo",
  "status": "ACTIVE",
  "roleId": "R1",
  "createdAt": "2025-09-15T00:00:00Z",
  "updatedAt": "2025-09-15T00:00:00Z"
}
```

**Role Sample:**
```json
{
  "_id": "R1",
  "roleName": "Librarian",
  "description": "Manages library books and user accounts",
  "permissionIds": ["P1", "P2", "P3"],
  "createdAt": "2025-09-15T00:00:00Z",
  "updatedAt": "2025-09-15T00:00:00Z"
}
```

**Permission Sample:**
```json
{
  "_id": "P1",
  "permissionName": "CREATE_BOOK",
  "description": "Ability to add new books to the library",
  "createdAt": "2025-09-15T00:00:00Z",
  "updatedAt": "2025-09-15T00:00:00Z"
}
```

---

## Common Queries

**Find active users**
```js
db.users.find({ "status": "ACTIVE" })
```

**Get roles assigned to a user**
```js
db.users.findOne({ "username": "admin_user" })
```

**Check if user has a specific role**
```js
db.users.findOne({ "username": "admin_user", "roleId": "R1" })
```

---

## Database Indexes

**Users Collection:**
- `{ "username": 1 }` (Unique)  
- `{ "email": 1 }` (Unique)  
- `{ "roleId": 1 }`  

**Roles Collection:**
- `{ "roleName": 1 }` (Unique)  

**Permissions Collection:**
- `{ "permissionName": 1 }` (Unique)  

---

# Business Rules & Constraints

## 1. User Rules
- Usernames and emails must be unique across all users.  
- A user can have only one role assigned.  
- User account status must be **ACTIVE** to log in and perform actions.  
- Passwords must always be stored in a **hashed** format.  
- Users must have valid role assignments before access is granted.  

---

## 2. Role & Permission Rules
- Role names must be unique.  
- A role must exist before assigning it to any user.  
- A role can have one or more permissions.  
- A permission must exist before linking it to a role.  
- Invalid role or permission references must be prevented.  

---

## 3. Data Integrity Rules
- User IDs follow the format: **USR + YEAR + sequential number**.  
- Role IDs follow the format: **R + sequential number** (e.g., R1, R2).  
- Permission IDs follow the format: **P + sequential number** (e.g., P1, P2).  
- Email and username uniqueness must be enforced at both **application** and **database** levels.  

---

# Integration Considerations

## 1. Future Collections
- **Borrowings Collection**: Will reference `users.userId` for tracking who borrowed books.  
- **Books Collection**: Permission checks required (`CREATE_BOOK`, `UPDATE_BOOK`, `DELETE_BOOK`).  
- **Fines/Payments Collection**: Only users with `MANAGE_USERS` or `ADMIN` role can update fines.  
- **Reservations Collection**: Restricted by role-based access control (RBAC).  

## 2. Application Layer Integration
- Implement role-based authorization middleware in the application.  
- Cache frequently accessed role & permission data for faster authorization checks.  
- Use MongoDB transactions when assigning users to roles and roles to permissions.  
- Enforce referential integrity at the application level to prevent dangling role/permission references.  

## 3. Data Validation
- **Client-side validation** for signup/login input (email format, password rules).  
- **Server-side validation** before database writes (unique username/email checks).  
- **MongoDB schema validation** to enforce required fields and formats.  
- Regular scheduled **consistency checks** for invalid user-role-permission mappings.  

---

# Technical Challenges & Solutions

## 1. Challenge: Maintaining Role-Permission Consistency
**Problem:** Ensuring that assigned roles always map to valid permissions.  
**Solution:**  
- Use MongoDB transactions for updates.  
- Implement validation checks in the application layer.  
- Run periodic data reconciliation jobs.  

## 2. Challenge: Complex Authorization Queries
**Problem:** Retrieving users with their roles and permissions efficiently.  
**Solution:**  
- Use MongoDB aggregation pipelines with `$lookup`.  
- Create compound indexes on `roleId` and `permissionIds`.  
- Cache frequently accessed role-permission mappings.  

## 3. Challenge: Concurrent Role/Permission Updates
**Problem:** Race conditions when multiple admins update roles/permissions.  
**Solution:**  
- Implement optimistic locking using version fields.  
- Use MongoDB transactions for atomic updates.  
- Add a queue system for high-concurrency administrative operations.  

---

# Performance Considerations

## 1. Indexing Strategy
- Index on `username` (unique).  
- Index on `email` (unique).  
- Index on `roleId` for quick role lookups.  
- Index on `permissionName` for fast permission checks.  

## 2. Query Optimization
- Use projections to return only necessary fields.  
- Implement pagination for large user lists.  
- Cache user-role-permission lookups for faster login/authorization.  
- Optimize aggregation pipelines with selective `$match` stages early.  

## 3. Scaling Considerations
- Consider sharding by `userId` for very large user datasets.  
- Use read replicas for analytics and reporting queries.  
- Archive inactive/suspended user accounts periodically.  
- Monitor collection growth and optimize indexes regularly.

## Maintenance & Monitoring
1. Regular Maintenance Tasks
Weekly data consistency checks
Monthly index performance analysis
Quarterly data archival for old records
Annual schema review and optimization
2. Monitoring Metrics
Collection growth rates
Query performance metrics
Index utilization statistics
Error rates and data validation failures
3. Backup Strategy
Daily automated backups
Point-in-time recovery capability
Cross-region backup replication
Regular restore testing procedures

# Project: Library Management System

**Sprint:** 1  
**Student:** IT23619258  
**Date:** March 15, 2024


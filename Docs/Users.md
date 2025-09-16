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

## Business Rules & Constraints
- User must be **ACTIVE** to perform actions.  
- Role must exist before assigning it to a user.  
- Permissions must exist before linking them to a role.  
- Invalid role or permission references must be prevented.  

---

## Integration Considerations
- **Borrowings Collection**: Only users with `ISSUE_BOOK` or `RETURN_BOOK` can manage borrowings.  
- **Fines Collection**: Only admins can create/update fines.  
- **Books Collection**: Only librarians/admins can add, update, or delete books.  

---

## Technical Challenges & Solutions
- **Data Consistency**: Use validation to prevent invalid role/permission assignments.  
- **Performance**: Add indexes for frequent queries (user lookups, role checks).  
- **Scalability**: Use references to avoid document bloat and allow independent updates.  

---

## Next Steps
1. Validate schema design with lecturer.  
2. Insert sample datasets for users, roles, and permissions.  
3. Test authentication and authorization queries.  
4. Integrate with borrowings, fines, and books collections.  

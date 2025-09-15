# User-Role-Permission Document Relationships

## Overview
For our Library Management System, I need to figure out how to connect users with their roles and permissions. After analyzing different approaches, I decided to use **references instead of embedding** because users can have multiple roles and each role can have multiple permissions.

---

## How the Relationship Works


### Basic Idea
- Each user can have multiple roles.  
- Each role can have multiple permissions.  
- Each permission defines a specific action a user can perform (e.g., add book, delete book, borrow book).  
- User documents store references to their assigned roles.  
- Role documents store references to their assigned permissions.  

### Why This Approach?
- Users can have many roles over time.  
- Roles may change or have permissions updated frequently.  
- Using references keeps documents smaller and easier to manage.  
- Queries for authentication and authorization can be done efficiently.  
- Other team members can easily connect their collections to user roles (e.g., borrowings, fines, reservations).  

---

## Document Examples

### User Document Structure
```json
{
  "_id": ObjectId("..."),
  "username": "admin_user",
  "email": "admin@library.com",
  "passwordHash": "hashed_password_123",
  "roles": [ ObjectId("role_id_here") ],
  "status": "ACTIVE",
  "createdAt": ISODate("2024-02-15")
}

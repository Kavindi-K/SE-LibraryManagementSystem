# User-Role-Permission Document Relationships

## Overview
For our Library Management System, I need to figure out how to connect users with their roles and permissions. After analyzing different approaches, I decided to use **references instead of embedding** because users can have multiple roles and each role can have multiple permissions.

---

## How the Relationship Works


### Basic Idea
- Each user can have one role.  
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
```
Role Document Structure
```json
{
  "_id": ObjectId("..."),
  "name": "Admin",
  "permissions": [
    ObjectId("perm_add_book"),
    ObjectId("perm_delete_book"),
    ObjectId("perm_borrow_book")
  ]
}
```
Permission Document Structure
```json
{
  "_id": ObjectId("..."),
  "name": "ADD_BOOK",
  "description": "Allows adding books to the library"
}
```
## Common Queries
Get all roles assigned to a user
```json
db.users.findOne({ "username": "admin_user" })
```

Get permissions of a user
```json
db.users.aggregate([
  { $match: { "username": "admin_user" } },
  { $lookup: {
      from: "roles",
      localField: "roles",
      foreignField: "_id",
      as: "userRoles"
    }
  },
  { $unwind: "$userRoles" },
  { $lookup: {
      from: "permissions",
      localField: "userRoles.permissions",
      foreignField: "_id",
      as: "userPermissions"
    }
  }
])
```
Check if a user has a specific role
```json
db.users.findOne({
  "username": "admin_user",
  "roles": ObjectId("role_id_here")
})
```
## Business Rules to Implement
- User must have **ACTIVE** status.  
- User must have the **required role** for the action.  
- Role must include the **permission needed** for the action.  
- Passwords should always be stored **hashed**.  

---

## Integration with Other Collections
- **Borrowings Collection:** User actions (like borrowing books) are controlled by their role and permissions.  
- **Fines Collection:** Admins can create/update fines; members can only view their own fines.  
- **Books Collection:** Only authorized roles can add, delete, or update books.

Database Indexes Needed
```json
// Users collection
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "roles": 1 })

// Roles collection
db.roles.createIndex({ "name": 1 }, { unique: true })

// Permissions collection
db.permissions.createIndex({ "name": 1 }, { unique: true })
```

---

## Benefits
- Fast login lookups  
- Efficient role-based queries  
- Ensures unique usernames, emails, roles, and permissions  

---

## Challenges I Anticipate
- **Data Consistency:** Ensuring user-role-permission references are always valid.  
- **Performance:** Queries joining multiple collections may be slow for many users/roles.  
- **Validation:** Prevent assigning invalid roles or permissions to users.  

---

## Next Steps
1. Wait for schema validation approval from lecturer.  
2. Create sample **users, roles, and permissions** data.  
3. Test relationship queries (authentication & role-permission checks).  
4. Coordinate with teammates on connecting other collections (e.g., borrowings, fines).



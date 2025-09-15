# Member-Borrowing Document Relationships

## Overview
For our library management system, I need to figure out how to connect member data with borrowing records. After researching different approaches, I've decided to use references instead of embedding because members can have many borrowings over time.

## How the Relationship Works

### Basic Idea
- Each member can borrow multiple books
- Each borrowing record belongs to one member
- I'll store the member's ID in each borrowing document to link them

### Why This Approach?
I chose references over embedding because:
- Members might have hundreds of borrowings over time
- Embedding would make member documents huge
- It's easier to query borrowing history separately
- Other team members can easily connect their collections to mine

## Document Examples

### Member Document Structure
```json
{
  "_id": ObjectId("..."),
  "memberNumber": "LIB2024001",
  "firstName": "Kasun",
  "lastName": "Perera",
  "email": "kasun.perera@email.com",
  "phone": "0771234567",
  "address": {
    "street": "45 Galle Road",
    "city": "Colombo",
    "district": "Western",
    "postalCode": "00300"
  },
  "membershipType": "STUDENT",
  "registrationDate": ISODate("2024-02-15"),
  "status": "ACTIVE",
  "maxBooksAllowed": 3,
  "currentBooksCount": 1
}
```

### Borrowing Document Structure
```json
{
  "_id": ObjectId("..."),
  "borrowingNumber": "BR2024001",
  "memberId": ObjectId("..."), // Links to member document
  "bookId": ObjectId("..."),   // Links to book document
  "borrowDate": ISODate("2024-03-10"),
  "dueDate": ISODate("2024-03-24"),
  "returnDate": null,
  "status": "ACTIVE",
  "renewCount": 0,
  "lateFee": 0
}
```

## Common Queries I'll Need

### Finding a member's current borrowings
```javascript
// Get all books currently borrowed by a member
db.borrowings.find({
  "memberId": ObjectId("member_id_here"),
  "status": "ACTIVE"
})
```

### Getting member info with borrowing history
```javascript
// Join member data with their borrowing records
db.members.aggregate([
  { $match: { "memberNumber": "LIB2024001" } },
  {
    $lookup: {
      from: "borrowings",
      localField: "_id",
      foreignField: "memberId",
      as: "allBorrowings"
    }
  }
])
```

### Checking if member can borrow more books
```javascript
// Check borrowing eligibility
db.members.findOne({
  "memberNumber": "LIB2024001",
  "status": "ACTIVE",
  "$expr": { "$lt": ["$currentBooksCount", "$maxBooksAllowed"] }
})
```

## Business Rules to Implement

### Before allowing new borrowing:
- Member must have ACTIVE status
- Member shouldn't exceed their book limit
- Member shouldn't have overdue books
- Member must have valid membership

### For managing returns:
- Update borrowing status to RETURNED
- Decrease member's current book count
- Calculate any late fees
- Check if there are reservations for the returned book

## Integration with Other Collections

### With Books Collection (Member 1's work):
- Store bookId in borrowing records
- Update book availability when borrowed/returned

### With Fines Collection (Member 3's work):  
- Generate fine records for overdue borrowings
- Link fines to specific borrowing records

### With Reservations (Member 3's work):
- Check member eligibility before creating reservations
- Convert reservations to borrowings when books available

## Database Indexes Needed

```javascript
// For better query performance
db.borrowings.createIndex({ "memberId": 1 })
db.borrowings.createIndex({ "status": 1 })
db.borrowings.createIndex({ "dueDate": 1 })
db.members.createIndex({ "memberNumber": 1 }, { unique: true })
db.members.createIndex({ "email": 1 }, { unique: true })
```

## Challenges I Anticipate

1. **Data Consistency**: Making sure member book counts stay accurate
2. **Performance**: Queries might be slow with lots of borrowing records
3. **Validation**: Ensuring referential integrity between collections

## Next Steps

- Wait for schema validation approval from lecturer
- Create sample member and borrowing data
- Test the relationship queries
- Coordinate with teammates on their collection connections

---

**Project**: Library Management System  
**Sprint**: 1  
**Task**: SCRUM-22B  
**Student**: IT23596634  
**Date**: March 15, 2024

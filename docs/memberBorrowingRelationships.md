# Library Management System - MongoDB Design Documentation

## Overview
This document outlines the MongoDB database design for the Library Management System, focusing on Members, Membership Types, and Borrowing relationships.

---

## Collections Design

### 1. MembershipTypes Collection

**Purpose**: Stores different types of library memberships available to users.

**Schema Structure**:
```javascript
{
  "_id": ObjectId,
  "membershipTypeId": String,    // Unique identifier (e.g., "STUDENT", "ADULT")
  "name": String,                // Display name
  "description": String,         // Membership description
  "maxBooksAllowed": Number,     // Max books that can be borrowed simultaneously
  "borrowingPeriodDays": Number, // Days books can be kept
  "lateFeePerDay": Number,       // Daily late fee amount
  "membershipFee": Number,       // Membership cost
  "isActive": Boolean,           // Active status
  "createdAt": Date,
  "updatedAt": Date
}
```

**Business Rules**:
- `membershipTypeId` must be unique across all membership types
- `maxBooksAllowed` range: 1-50 books
- `borrowingPeriodDays` range: 1-365 days
- `lateFeePerDay` and `membershipFee` must be non-negative

### 2. Members Collection

**Purpose**: Stores library member information and account details.

**Schema Structure**:
```javascript
{
  "_id": ObjectId,
  "memberId": String,           // Unique member identifier
  "personalInfo": {
    "firstName": String,        // Required, 1-50 characters
    "lastName": String,         // Required, 1-50 characters
    "dateOfBirth": Date,        // For age verification
    "gender": String,           // Enum: ["Male", "Female", "Other", "Prefer not to say"]
    "phoneNumber": String,      // Required, unique
    "email": String,            // Required, unique, validated format
    "address": {
      "street": String,
      "city": String,
      "state": String,
      "zipCode": String,
      "country": String
    }
  },
  "membershipInfo": {
    "membershipTypeId": String, // References membershipTypes.membershipTypeId
    "membershipStartDate": Date,
    "membershipEndDate": Date,
    "membershipStatus": String, // Enum: ["ACTIVE", "EXPIRED", "SUSPENDED", "CANCELLED"]
    "renewalCount": Number
  },
  "libraryInfo": {
    "currentBorrowedBooks": Number,     // Current borrowed count
    "totalBooksEverBorrowed": Number,   // Lifetime borrowing count
    "totalLateFees": Number,            // Outstanding fees
    "totalFeesPaid": Number,            // Historical payments
    "lastVisitDate": Date,
    "notes": String                     // Staff notes (max 500 chars)
  },
  "preferences": {
    "preferredGenres": [String],        // Array of genre preferences
    "notificationPreferences": {
      "email": Boolean,
      "sms": Boolean,
      "dueDateReminders": Boolean
    }
  },
  "accountInfo": {
    "isActive": Boolean,
    "createdAt": Date,
    "updatedAt": Date,
    "createdBy": String                 // Staff member who created account
  }
}
```

**Business Rules**:
- `memberId`, `email`, and `phoneNumber` must be unique
- Email must follow valid email format pattern
- Phone number must be 10-15 digits
- `membershipStatus` determines borrowing privileges
- `currentBorrowedBooks` must not exceed membership type limit

### 3. Borrowing Collection

**Purpose**: Tracks all book borrowing transactions and their current status.

**Schema Structure**:
```javascript
{
  "_id": ObjectId,
  "borrowingId": String,        // Unique transaction identifier
  "memberId": String,           // References members.memberId
  "bookId": String,             // References books.bookId (future collection)
  "borrowDate": Date,           // When book was borrowed
  "dueDate": Date,              // Return due date
  "returnDate": Date,           // Actual return date (null if not returned)
  "borrowingStatus": String,    // Enum: ["BORROWED", "RETURNED", "OVERDUE", "LOST", "RENEWED"]
  "renewalCount": Number,       // Number of renewals (max 3)
  "lateFee": Number,            // Accumulated late fees
  "isLateFeesPaid": Boolean,    // Payment status of late fees
  "borrowingNotes": String,     // Transaction notes (max 300 chars)
  "createdAt": Date,
  "updatedAt": Date,
  "processedBy": String         // Staff member who processed transaction
}
```

**Business Rules**:
- `borrowingId` must be unique
- `renewalCount` maximum is 3
- `lateFee` calculated based on membership type's `lateFeePerDay`
- Status changes: BORROWED → RETURNED/OVERDUE/LOST
- Members cannot borrow if they have unpaid late fees above threshold

---

## Relationships

### 1. Members ↔ MembershipTypes (Many-to-One)
- **Relationship**: Many members can have the same membership type
- **Implementation**: `members.membershipInfo.membershipTypeId` references `membershipTypes.membershipTypeId`
- **Query Example**: Get membership details for a member
```javascript
db.members.aggregate([
  { $lookup: {
      from: "membershipTypes",
      localField: "membershipInfo.membershipTypeId",
      foreignField: "membershipTypeId",
      as: "membershipDetails"
    }
  }
])
```

### 2. Members ↔ Borrowing (One-to-Many)
- **Relationship**: One member can have many borrowing records
- **Implementation**: `borrowing.memberId` references `members.memberId`
- **Query Example**: Get member's borrowing history
```javascript
db.borrowing.find({ "memberId": "LIB2024001" })
```

---

## Sample Documents

### MembershipTypes Sample:
```javascript
{
  "membershipTypeId": "STUDENT",
  "name": "Student Membership",
  "description": "Discounted membership for students with valid ID",
  "maxBooksAllowed": 3,
  "borrowingPeriodDays": 14,
  "lateFeePerDay": 0.5,
  "membershipFee": 10.0,
  "isActive": true,
  "createdAt": new Date("2024-01-01"),
  "updatedAt": new Date("2024-01-01")
}
```

### Members Sample:
```javascript
{
  "memberId": "LIB2024001",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": new Date("2000-05-15"),
    "phoneNumber": "1234567890",
    "email": "john.doe@email.com"
  },
  "membershipInfo": {
    "membershipTypeId": "STUDENT",
    "membershipStartDate": new Date("2024-01-15"),
    "membershipEndDate": new Date("2024-12-31"),
    "membershipStatus": "ACTIVE"
  },
  "libraryInfo": {
    "currentBorrowedBooks": 2,
    "totalBooksEverBorrowed": 25,
    "totalLateFees": 0.0,
    "totalFeesPaid": 10.0
  },
  "accountInfo": {
    "isActive": true,
    "createdAt": new Date("2024-01-15")
  }
}
```

### Borrowing Sample:
```javascript
{
  "borrowingId": "BOR2024001",
  "memberId": "LIB2024001",
  "bookId": "BOOK001",
  "borrowDate": new Date("2024-09-01"),
  "dueDate": new Date("2024-09-15"),
  "returnDate": null,
  "borrowingStatus": "BORROWED",
  "renewalCount": 0,
  "lateFee": 0.0,
  "isLateFeesPaid": false,
  "createdAt": new Date("2024-09-01"),
  "processedBy": "librarian_sarah"
}
```

---

## Common Queries

### 1. Member Management Queries

**Find active members:**
```javascript
db.members.find({ "membershipInfo.membershipStatus": "ACTIVE" })
```

**Search members by name or email:**
```javascript
db.members.find({
  $or: [
    { "personalInfo.firstName": { $regex: "John", $options: "i" } },
    { "personalInfo.email": { $regex: "john", $options: "i" } }
  ]
})
```

**Find members with outstanding fees:**
```javascript
db.members.find({ "libraryInfo.totalLateFees": { $gt: 0 } })
```

### 2. Borrowing Queries

**Member's current borrowed books:**
```javascript
db.borrowing.find({ 
  "memberId": "LIB2024001", 
  "borrowingStatus": "BORROWED" 
})
```

**Find overdue books:**
```javascript
db.borrowing.find({
  "dueDate": { $lt: new Date() },
  "borrowingStatus": "BORROWED"
})
```

**Member's complete borrowing history:**
```javascript
db.members.aggregate([
  { $match: { "memberId": "LIB2024001" } },
  { $lookup: {
      from: "borrowing",
      localField: "memberId",
      foreignField: "memberId",
      as: "borrowingHistory"
    }
  }
])
```

### 3. Analytics Queries

**Most active borrowers:**
```javascript
db.borrowing.aggregate([
  { $group: {
      _id: "$memberId",
      totalBorrowings: { $sum: 1 }
    }
  },
  { $sort: { totalBorrowings: -1 } },
  { $limit: 10 }
])
```

**Late fee statistics:**
```javascript
db.borrowing.aggregate([
  { $group: {
      _id: null,
      totalLateFees: { $sum: "$lateFee" },
      averageLateFee: { $avg: "$lateFee" }
    }
  }
])
```

---

## Database Indexes

### MembershipTypes Collection:
```javascript
{ "membershipTypeId": 1 }  // Unique index
```

### Members Collection:
```javascript
{ "memberId": 1 }                    // Unique index
{ "personalInfo.email": 1 }          // Unique index
{ "personalInfo.phoneNumber": 1 }    // Unique index
{ "personalInfo.firstName": 1, "personalInfo.lastName": 1 }  // Compound index for name searches
```

### Borrowing Collection:
```javascript
{ "borrowingId": 1 }                 // Unique index
{ "memberId": 1 }                    // Index for member lookups
{ "bookId": 1 }                      // Index for book lookups
{ "memberId": 1, "borrowingStatus": 1 }  // Compound index for member's active borrowings
{ "dueDate": 1 }                     // Index for overdue checks
{ "borrowDate": -1 }                 // Index for date range queries
```

---

## Business Rules & Constraints

### 1. Membership Rules
- Members cannot exceed their membership type's `maxBooksAllowed` limit
- Expired memberships cannot borrow new books
- Suspended members cannot perform any borrowing activities
- Senior citizens (65+) automatically qualify for senior membership discounts

### 2. Borrowing Rules
- Books can be renewed maximum 3 times
- Cannot renew if book is overdue beyond grace period (7 days)
- Cannot borrow new books if outstanding late fees exceed $25
- Borrowing period calculated based on membership type
- Late fees accrue daily after due date

### 3. Data Integrity Rules
- Email addresses must be unique across all members
- Phone numbers must be unique across all members
- Member IDs follow format: LIB + YEAR + sequential number
- Borrowing IDs follow format: BOR + YEAR + sequential number

---

## Integration Considerations

### 1. Future Collections
- **Books Collection**: Will reference `borrowing.bookId`
- **Staff Collection**: Will reference `members.accountInfo.createdBy`
- **Payments Collection**: Will track fee payments and membership renewals
- **Reservations Collection**: For book reservations and hold requests

### 2. Application Layer Integration
- Implement referential integrity checks in application code
- Cache frequently accessed membership type data
- Implement optimistic locking for concurrent borrowing operations
- Use MongoDB transactions for multi-collection operations

### 3. Data Validation
- Client-side validation for user input
- Server-side validation before database operations
- MongoDB schema validation as final safeguard
- Regular data consistency checks via scheduled jobs

---

## Technical Challenges & Solutions

### 1. Challenge: Maintaining Data Consistency
**Problem**: Ensuring member's `currentBorrowedBooks` count stays synchronized with actual borrowing records.

**Solution**: 
- Use MongoDB transactions for borrowing operations
- Implement periodic reconciliation jobs
- Add validation triggers in application layer

### 2. Challenge: Complex Queries Across Collections
**Problem**: Joining data from multiple collections efficiently.

**Solution**:
- Use MongoDB aggregation pipelines with `$lookup`
- Create appropriate compound indexes
- Consider embedding frequently accessed related data

### 3. Challenge: Handling Concurrent Borrowing Operations
**Problem**: Race conditions when multiple users try to borrow the same book.

**Solution**:
- Implement optimistic locking with version fields
- Use MongoDB transactions for atomic operations
- Queue system for high-concurrency scenarios

---

## Performance Considerations

### 1. Indexing Strategy
- Index all fields used in WHERE clauses
- Use compound indexes for multi-field queries
- Monitor slow query logs and add indexes as needed
- Consider partial indexes for status-based queries

### 2. Query Optimization
- Use projection to limit returned fields
- Implement pagination for large result sets
- Cache frequently accessed data (membership types)
- Use aggregation pipelines efficiently

### 3. Scaling Considerations
- Consider sharding strategy for large datasets
- Implement read replicas for reporting queries
- Archive old borrowing records periodically
- Monitor collection sizes and growth patterns

---

## Next Steps

### Phase 1: Core Implementation ✅
- [x] Design membership types collection
- [x] Design members collection  
- [x] Design borrowing collection
- [x] Establish relationships between collections

### Phase 2: Sample Data & Testing
- [ ] Create comprehensive sample datasets
- [ ] Implement automated testing for all queries
- [ ] Performance testing with realistic data volumes
- [ ] Validate all business rules with test cases

### Phase 3: Advanced Features
- [ ] Design books and authors collections
- [ ] Implement reservation system
- [ ] Add payment tracking
- [ ] Create reporting and analytics framework

### Phase 4: System Integration
- [ ] API development for frontend integration
- [ ] Authentication and authorization system
- [ ] Backup and recovery procedures
- [ ] Monitoring and alerting setup

---

## Maintenance & Monitoring

### 1. Regular Maintenance Tasks
- Weekly data consistency checks
- Monthly index performance analysis
- Quarterly data archival for old records
- Annual schema review and optimization

### 2. Monitoring Metrics
- Collection growth rates
- Query performance metrics
- Index utilization statistics
- Error rates and data validation failures

### 3. Backup Strategy
- Daily automated backups
- Point-in-time recovery capability
- Cross-region backup replication
- Regular restore testing procedures

---

**Document Version**: 1.0  
**Last Updated**: September 2024  
**Next Review**: December 2024

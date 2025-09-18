# Library Management System - Member Management Module

## Overview
This is the Member Management module of the Library Management System, implemented as part of the SE course assignment. This module handles complete CRUD operations for library members with different membership types.

## Technology Stack
- **Backend**: Spring Boot 3.5.5, MongoDB, Spring Security
- **Frontend**: React 19.1.1, Vite, Axios
- **Database**: MongoDB (using MongoDB Atlas)

## Features Implemented

### Backend Features
- ✅ Member CRUD operations (Create, Read, Update, Delete)
- ✅ MongoDB integration with proper indexing
- ✅ Member search and filtering capabilities
- ✅ Membership type management (STUDENT, FACULTY, REGULAR, PREMIUM)
- ✅ RESTful API endpoints with proper error handling
- ✅ Sample data initialization
- ✅ Email validation and duplicate prevention
- ✅ CORS configuration for frontend integration

### Frontend Features  
- ✅ Responsive Member management UI
- ✅ Add/Edit/Delete member functionality
- ✅ Search members by name, email, or phone
- ✅ Filter members by membership type
- ✅ Form validation with error messaging
- ✅ Membership type information display
- ✅ Active/Inactive member status management

## Project Structure

### Backend (Spring Boot)
```
backend/src/main/java/com/management/library/
├── model/
│   ├── Member.java              # Member entity/document
│   └── MembershipType.java      # Membership type enum
├── repository/
│   └── MemberRepository.java    # MongoDB repository
├── service/
│   ├── MemberService.java       # Business logic layer
│   └── DataInitializationService.java # Sample data creation
├── controller/
│   └── MemberController.java    # REST API endpoints
├── config/
│   └── SecurityConfig.java      # Security configuration
└── LibraryApplication.java     # Main application class
```

### Frontend (React + Vite)
```
frontend/src/
├── components/
│   ├── MemberList.jsx          # Member list and search UI
│   ├── MemberList.css         # Member list styles
│   ├── MemberForm.jsx         # Add/Edit member form
│   └── MemberForm.css         # Form styles
├── services/
│   └── memberService.js       # API service layer
├── App.jsx                    # Main app component with routing
├── App.css                    # Global app styles
└── main.jsx                   # App entry point
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/members` | Get all members |
| GET | `/api/members/{id}` | Get member by ID |
| POST | `/api/members` | Create new member |
| PUT | `/api/members/{id}` | Update member |
| DELETE | `/api/members/{id}` | Delete member |
| GET | `/api/members/search?q={term}` | Search members |
| GET | `/api/members/type/{type}` | Get members by type |
| GET | `/api/members/active` | Get active members |
| GET | `/api/members/membership-types` | Get all membership types |

## Membership Types

| Type | Display Name | Duration | Borrowing Limit | Daily Fine Rate |
|------|--------------|----------|-----------------|-----------------|
| STUDENT | Student | 1 year | 5 books | $0.50 |
| FACULTY | Faculty | 2 years | 10 books | $0.25 |
| REGULAR | Regular | 1 year | 3 books | $1.00 |
| PREMIUM | Premium | 2 years | 15 books | $0.10 |

## Setup and Installation

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   ./mvnw clean install
   ```

3. **Configure MongoDB connection:**
   Update `src/main/resources/application.properties` with your MongoDB connection string:
   ```properties
   spring.data.mongodb.uri=your_mongodb_connection_string
   spring.data.mongodb.database=LibraryDatabase
   ```

4. **Run the backend:**
   ```bash
   ./mvnw spring-boot:run
   ```
   Backend will start on http://localhost:8080

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend will start on http://localhost:5173

## Usage

### Adding a New Member
1. Click "Add New Member" button
2. Fill in all required fields:
   - First Name and Last Name
   - Email (must be unique)
   - Phone number
   - Address
   - Date of Birth
   - Select Membership Type
3. Click "Add Member" to save

### Editing a Member
1. Click "Edit" button next to any member
2. Modify the desired fields
3. Click "Update Member" to save changes

### Searching Members
- Use the search bar to find members by name, email, or phone
- Use the dropdown filter to show only specific membership types
- Combine search and filter for refined results

### Deleting a Member
1. Click "Delete" button next to any member
2. Confirm the deletion in the popup dialog

## Sample Data
The system automatically creates 5 sample members on first startup:
- John Doe (Student) - Active
- Jane Smith (Faculty) - Active with small fine
- Bob Johnson (Regular) - Active
- Alice Wilson (Premium) - Active
- Charlie Brown (Student) - Inactive with fine

## Database Schema (MongoDB)

### Members Collection
```json
{
  "_id": "ObjectId",
  "firstName": "String",
  "lastName": "String", 
  "email": "String (indexed, unique)",
  "phone": "String (indexed)",
  "address": "String",
  "dateOfBirth": "Date",
  "membershipType": "String (STUDENT|FACULTY|REGULAR|PREMIUM)",
  "membershipStartDate": "DateTime",
  "membershipEndDate": "DateTime", 
  "isActive": "Boolean",
  "fineAmount": "Number",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

### Indexes Created
- `firstName` (text index for search)
- `lastName` (text index for search)  
- `email` (unique index)
- `phone` (index for search)

## Testing

### Backend Testing
Test the API endpoints using tools like Postman or curl:

```bash
# Get all members
curl http://localhost:8080/api/members

# Search members
curl "http://localhost:8080/api/members/search?q=john"

# Get membership types
curl http://localhost:8080/api/members/membership-types
```

### Frontend Testing
1. Open http://localhost:5173 in your browser
2. Test all CRUD operations through the UI
3. Verify search and filtering functionality
4. Test form validation by submitting invalid data

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Verify MongoDB URI in application.properties
   - Check if MongoDB Atlas IP whitelist includes your IP

2. **CORS Errors:**
   - Ensure frontend is running on http://localhost:5173
   - Check SecurityConfig.java CORS configuration

3. **Port Already in Use:**
   - Backend: Change server.port in application.properties
   - Frontend: Vite will automatically suggest alternative port

4. **Build Errors:**
   - Ensure Java 17+ is installed
   - Run `./mvnw clean install` to refresh dependencies

## Future Enhancements (For Other Sprints)
- Integration with Books module for borrowing limits
- Advanced search with date ranges
- Member photo uploads
- Email notifications for membership expiry
- Export member data to CSV/PDF
- Member statistics dashboard

## Assignment Completion Status

### SCRUM Stories Completed:
- ✅ Create Member CRUD endpoints
- ✅ Create Member management UI (Add/Edit/Delete/Search members)  
- ✅ Display membership type in form/table
- ✅ Member search & filtering
- ✅ Member validation + form validation

### Ready for Implementation:
- 📋 SCRUM-21B: Design Members and Membership Collections and Schemas
- 📋 SCRUM-22B: Define Member-Borrowing Document Structures and References
- 📋 SCRUM-23B: Create sample member data ✅
- 📋 SCRUM-24B: Create MongoDB Indexes for Member Search Fields ✅  
- 📋 SCRUM-25C: Document backup/recovery procedures
- 📋 SCRUM-27B: Implement membership type management ✅
- 📋 SCRUM-27C: Add member search & filtering ✅
- 📋 SCRUM-27D: Member validation + notifications ✅

## Contributors
- Ravidu Ravisara - Member Management Module Developer

## License
This project is part of an academic assignment for SE course.

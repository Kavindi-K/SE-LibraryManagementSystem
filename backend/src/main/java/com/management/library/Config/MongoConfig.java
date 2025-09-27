package com.management.library.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = {
    "com.management.library.UserManagement.Repository",
    "com.management.library.MemberManagement.Repository",
    "com.management.library.BorrowingReservation.repository",
        "com.management.library.BookManagement.repository"
})
public class MongoConfig {
    // MongoDB's configuration is handled by application.properties
    // This class enables auditing for @CreatedDate and @LastModifiedDate
}
package com.management.library.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = "com.management.library.UserManagement.Repository")
public class MongoConfig {
    // MongoDB's configuration is handled by application.properties
    // This class enables auditing for @CreatedDate and @LastModifiedDate
}
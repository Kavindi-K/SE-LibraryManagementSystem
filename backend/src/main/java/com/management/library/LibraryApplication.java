package com.management.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class LibraryApplication {

	public static void main(String[] args) {
		SpringApplication.run(LibraryApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		System.out.println("\n" +
			"===============================================\n" +
			"🚀 LIBRARY MANAGEMENT SYSTEM STARTED SUCCESSFULLY!\n" +
			"===============================================\n" +
			"📍 Backend URL: http://localhost:8080\n" +
			"📍 API Base: http://localhost:8080/api/members\n" +
			"📍 Health Check: http://localhost:8080/api/members/membership-types\n" +
			"===============================================\n" +
			"✅ Ready to accept requests from frontend!\n" +
			"===============================================\n");
	}
}

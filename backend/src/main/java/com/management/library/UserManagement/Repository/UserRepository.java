package com.management.library.UserManagement.Repository;

import com.management.library.UserManagement.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<User> findByRole(User.UserRole role);

    List<User> findByStatus(User.UserStatus status);

    @Query("{ 'role': ?0, 'status': ?1 }")
    List<User> findByRoleAndStatus(User.UserRole role, User.UserStatus status);

    @Query("{ $or: [ { 'firstName': { $regex: ?0, $options: 'i' } }, { 'lastName': { $regex: ?0, $options: 'i' } }, { 'username': { $regex: ?0, $options: 'i' } }, { 'email': { $regex: ?0, $options: 'i' } } ] }")
    List<User> findBySearchQuery(String searchQuery);

    long countByRole(User.UserRole role);

    long countByStatus(User.UserStatus status);
}
package com.management.library.repository;

import com.management.library.model.Member;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends MongoRepository<Member, String> {

    Optional<Member> findByEmail(String email);

    List<Member> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName);

    List<Member> findByPhone(String phone);

    List<Member> findByMembershipType(String membershipType);

    List<Member> findByIsActive(boolean isActive);

    @Query("{ '$or': [ " +
           "{ 'firstName': { '$regex': ?0, '$options': 'i' } }, " +
           "{ 'lastName': { '$regex': ?0, '$options': 'i' } }, " +
           "{ 'email': { '$regex': ?0, '$options': 'i' } }, " +
           "{ 'phone': { '$regex': ?0, '$options': 'i' } } ] }")
    List<Member> searchMembers(String searchTerm);

    @Query("{ 'membershipType': ?0, 'isActive': ?1 }")
    List<Member> findByMembershipTypeAndIsActive(String membershipType, boolean isActive);
}

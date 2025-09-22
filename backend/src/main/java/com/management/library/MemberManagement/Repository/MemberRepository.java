package com.management.library.MemberManagement.Repository;

import com.management.library.MemberManagement.Entity.Member;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends MongoRepository<Member, String> {

    Optional<Member> findByMemberId(String memberId);

    Optional<Member> findByUserId(String userId);

    Optional<Member> findByEmail(String email);

    boolean existsByMemberId(String memberId);

    boolean existsByUserId(String userId);

    boolean existsByEmail(String email);

    List<Member> findByMembershipType(Member.MembershipType membershipType);

    List<Member> findByStatus(Member.MemberStatus status);

    @Query("{ 'membershipType': ?0, 'status': ?1 }")
    List<Member> findByMembershipTypeAndStatus(Member.MembershipType membershipType, Member.MemberStatus status);

    @Query("{ $or: [ { 'firstName': { $regex: ?0, $options: 'i' } }, { 'lastName': { $regex: ?0, $options: 'i' } }, { 'email': { $regex: ?0, $options: 'i' } }, { 'phoneNumber': { $regex: ?0, $options: 'i' } }, { 'memberId': { $regex: ?0, $options: 'i' } } ] }")
    List<Member> findBySearchQuery(String searchQuery);

    long countByMembershipType(Member.MembershipType membershipType);

    long countByStatus(Member.MemberStatus status);

    // Find members whose membership is about to expire
    @Query("{ 'expiryDate': { $lte: ?0 } }")
    List<Member> findMembersExpiringBefore(java.time.LocalDate date);

    // Find members with outstanding fines
    @Query("{ 'fineAmount': { $gt: 0 } }")
    List<Member> findMembersWithFines();
}
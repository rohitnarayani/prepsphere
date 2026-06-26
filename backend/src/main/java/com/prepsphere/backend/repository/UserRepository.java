package com.prepsphere.backend.repository;

import com.prepsphere.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// MongoRepository<User, String>:
//   - First type param  → the Model class this repo manages (User)
//   - Second type param → the type of the @Id field (String)
//
// By extending MongoRepository, Spring auto-generates implementations for:
//   save(), findById(), findAll(), deleteById(), count(), existsById() — and more.
//   You don't write a single line of CRUD code yourself!

@Repository  // Tells Spring this is a data-access bean; also enables exception translation
public interface UserRepository extends MongoRepository<User, String> {

    // Spring Data automatically translates method names into MongoDB queries.
    // "findByEmail" → db.users.findOne({ email: <value> })
    Optional<User> findByEmail(String email);

    // "existsByEmail" → checks if any document with that email exists
    boolean existsByEmail(String email);
}

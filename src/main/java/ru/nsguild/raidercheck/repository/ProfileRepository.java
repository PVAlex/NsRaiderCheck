package ru.nsguild.raidercheck.repository;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.nsguild.raidercheck.dao.Profile;

import java.util.Set;

/**
 * Репозиторий данных о персонаже.
 */
@Repository
public interface ProfileRepository extends PagingAndSortingRepository<Profile, String> {

    @Query("distinct('name')")
    Set<String> getAllNames();

    Profile findByName(String name);
}

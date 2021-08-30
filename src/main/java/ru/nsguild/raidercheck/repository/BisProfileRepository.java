package ru.nsguild.raidercheck.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.nsguild.raidercheck.dao.BisProfile;

import java.util.Optional;

@Repository
public interface BisProfileRepository extends PagingAndSortingRepository<BisProfile, String> {

    Optional<BisProfile> getByName(String name);

}

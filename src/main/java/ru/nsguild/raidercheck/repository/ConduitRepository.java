package ru.nsguild.raidercheck.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.nsguild.raidercheck.dao.blizzard.Conduit;

import java.util.Optional;

@Repository
public interface ConduitRepository extends PagingAndSortingRepository<Conduit, String> {

    Optional<Conduit> findById(Integer id);

}

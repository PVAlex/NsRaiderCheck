package ru.nsguild.raidercheck.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.nsguild.raidercheck.dao.blizzard.TechTalent;

import java.util.Optional;

@Repository
public interface TechTalentRepository extends PagingAndSortingRepository<TechTalent, String> {
    Optional<TechTalent> findById(Integer id);
}

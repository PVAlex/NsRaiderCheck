package ru.nsguild.raidercheck.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.nsguild.raidercheck.dao.IconMedia;

import java.util.Optional;

@Repository
public interface IconRepository extends PagingAndSortingRepository<IconMedia, String> {

    Optional<IconMedia> findById(Integer id);
    Optional<IconMedia> findBySharedIdContaining(Integer id);
}

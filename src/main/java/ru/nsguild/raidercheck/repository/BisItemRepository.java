package ru.nsguild.raidercheck.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.nsguild.raidercheck.dao.BisItem;

import java.util.List;
import java.util.Optional;

@Repository
public interface BisItemRepository extends PagingAndSortingRepository<BisItem, String> {

    Optional<BisItem> findById(Integer id);
    List<BisItem> findByInstanceId(Integer id);
    List<BisItem> findByEncounterId(Integer id);

}

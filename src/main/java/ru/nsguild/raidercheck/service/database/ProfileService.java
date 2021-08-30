package ru.nsguild.raidercheck.service.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import ru.nsguild.raidercheck.CacheConfig;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.repository.ProfileRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Сервис получения профилей из БД.
 */
@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    /**
     * Получить все.
     *
     * @return список профилей
     */
    @Cacheable(cacheNames = CacheConfig.PROFILES, key = "'allProfiles'", sync = true)
    public List<Profile> findAllProfiles() {
        return StreamSupport.stream(profileRepository.findAll().spliterator(), false)
            .collect(Collectors.toList());
    }

    public Optional<Profile> findByName(String name) {
        return Optional.ofNullable(profileRepository.findByName(name));
    }

    /**
     * Сохранить всех.
     *
     * @param profiles список для сохранения
     */
    @CacheEvict(cacheNames = CacheConfig.PROFILES, allEntries = true)
    public void saveAll(List<Profile> profiles) {
        profileRepository.saveAll(profiles);
    }

    /**
     * Удалить все.
     *
     * @param profiles список для удаления
     */
    @CacheEvict(cacheNames = CacheConfig.PROFILES, allEntries = true)
    public void delete(List<Profile> profiles) {
        profileRepository.deleteAll(profiles);
    }

}

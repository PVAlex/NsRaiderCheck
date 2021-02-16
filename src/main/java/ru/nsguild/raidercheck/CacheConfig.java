package ru.nsguild.raidercheck;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

/**
 * Клонфигурация кэша.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    public static final String BLIZZARD_AUTH = "blizzardAuth";
    public static final String PROFILES = "profiles";

//
//    @Bean
//    public CacheManager cacheManager() {
//        // TODO scheduler to clear ?
//        final CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager(BLIZZARD_AUTH, ProfileService.CACHE_NAME);
//        caffeineCacheManager.setCaffeine(Caffeine.newBuilder().expireAfterWrite(60*23, TimeUnit.MINUTES));
//        return caffeineCacheManager;
//    }
}

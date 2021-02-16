package ru.nsguild.raidercheck.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.nsguild.raidercheck.CacheConfig;
import ru.nsguild.raidercheck.dao.blizzard.Token;

/**
 * Сервис авторизации в api.
 */
@Service
public class ApiAuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(ApiAuthenticationService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.blizzard.clientId:}")
    private String clientId;
    @Value("${api.blizzard.clientSecret:}")
    private String clientSecret;

    /**
     * Получить токен авторизации в Blizzard api.
     *
     * @return токен
     */
    @Cacheable(cacheNames = {CacheConfig.BLIZZARD_AUTH}, key = "'token'", sync = true)
    public String getToken() {
        try {
            final HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setBasicAuth(clientId, clientSecret);
            httpHeaders.setContentType(MediaType.valueOf("application/x-www-form-urlencoded;charset=UTF-8"));
            final HttpEntity<String> entity = new HttpEntity<>("grant_type=client_credentials", httpHeaders);
            final ResponseEntity<Token> result =
                restTemplate.exchange("https://eu.battle.net/oauth/token", HttpMethod.POST, entity, Token.class);
            if (result.hasBody()) {
                final Token token = result.getBody();
                logger.info("Authenticated. Token: " + token.getAccessToken());
                return token.getAccessToken();
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        //TODO не сохранять null в кэш
        logger.warn("Authentication is null");
        return "";
    }

    /**
     * Очистка кэша каждые 23 часа.
     */
    @Scheduled(fixedDelayString = "${authService.cacheClearDuration:82800000}")
    @CacheEvict(cacheNames = CacheConfig.BLIZZARD_AUTH, key = "'token'")
    public void clearAuthCache() {
        logger.debug("Auth cache cleared");
    }
}

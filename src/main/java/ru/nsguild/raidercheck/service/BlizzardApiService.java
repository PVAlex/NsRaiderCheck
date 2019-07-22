package ru.nsguild.raidercheck.service;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.nsguild.raidercheck.api.blizzard.Character;
import ru.nsguild.raidercheck.api.blizzard.Guild;
import ru.nsguild.raidercheck.api.blizzard.Token;
import ru.nsguild.raidercheck.api.blizzard.newapi.Equipment;
import ru.nsguild.raidercheck.api.blizzard.newapi.Essence;
import ru.nsguild.raidercheck.entity.Member;

/**
 * Получение информации из api Blizzard.
 */
@Service
public class BlizzardApiService {

    private static final Logger logger = LoggerFactory.getLogger(BlizzardApiService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.blizzard.clientId:}")
    private String clientId;
    @Value("${api.blizzard.clientSecret:}")
    private String clientSecret;
    @Value("${guild.realm:}")
    private String realm;
    @Value("${guild.realmSlug:}")
    private String realmSlug;
    @Value("${guild.name:}")
    private String guildName;
    @Value("${locale:en_EU}")
    private String locale;

    private Token token;

    /**
     * Получение токена для авторизации.
     *
     * @return токен
     */
    private Token getToken() {
        if (token == null || token.getExpiresIn().after(Date.from(Instant.now()))) {
            try {
                final HttpHeaders httpHeaders = new HttpHeaders();
                httpHeaders.setBasicAuth(clientId, clientSecret);
                httpHeaders.setContentType(MediaType.valueOf("application/x-www-form-urlencoded;charset=UTF-8"));
                final HttpEntity<String> entity = new HttpEntity<>("grant_type=client_credentials", httpHeaders);
                final ResponseEntity<Token> result =
                        restTemplate.exchange("https://eu.battle.net/oauth/token", HttpMethod.POST, entity, Token.class);
                if (result.hasBody()) {
                    token = result.getBody();
                    final Date expires = Date.from(Instant.now().plusSeconds((token.getExpiresIn().getTime() - 3000)));
                    token.setExpiresIn(expires);
                }
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        }
        return token;
    }

    /**
     * Получение списка персонажей 120 уровня из выбранной гильдии.
     *
     * @return список персонажей.
     */
    public List<Member> getMembers() {
        final String url = "https://eu.api.blizzard.com/wow/guild/" + realm + "/" + guildName
                + "?fields=members&locale=" + locale
                + "&access_token=" + getToken().getAccessToken();
        final Guild guild = restTemplate.getForObject(url, Guild.class);
        return guild.getMembers().stream()
                .filter(member -> member.getCharacter().getLevel() == 120)
                .collect(Collectors.toList());
    }

    /**
     * Получение информации об экипировке, талантах и проблемах персонажей.
     *
     * @param names список имён персонажей.
     * @return список персонажей.
     */
    public List<Character> getGear(List<String> names) {
        return names.stream().map(this::getGear).filter(Objects::nonNull).collect(Collectors.toList());
    }

    /**
     * Получение информации об экипировке, талантах и проблемах персонажа.
     *
     * @param name имя персонажа.
     * @return персонаж.
     */
    public Character getGear(String name) {
        final String url = "https://eu.api.blizzard.com/wow/character/" + realm + "/" + name
                + "?fields=items,audit,talents,reputation,professions&locale=" + locale + "&access_token=" + getToken().getAccessToken();
        try {
            return restTemplate.getForObject(url, Character.class);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return null;
    }

    /**
     * Получить экипированные эссенции (BFA neck)
     *
     * @param name имя персонажа
     * @return список эссенций
     */
    public List<Essence> getEssences(String name) {
        final String url = "https://eu.api.blizzard.com/profile/wow/character/" + realmSlug + "/" + name.toLowerCase()
                + "/equipment?namespace=profile-eu&locale=ru_RU&access_token=" + getToken().getAccessToken();
        try {
            final Equipment equipment = restTemplate.getForObject(url, Equipment.class);
            return equipment.getEquippedItems().stream()
                    .filter(item -> item.getSlot().getType().equals("NECK")).findFirst()
                    .get().getAzeriteDetails().getSelectedEssences();
        } catch (Exception e) {
            logger.error("Эссенция не получена для персонажа " + name + ": " + e.getMessage());
        }
        return null;
    }
}

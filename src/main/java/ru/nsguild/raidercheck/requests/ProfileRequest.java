package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import ru.nsguild.raidercheck.dao.Profile;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Получение участников гильдии.
 */
@Component
public class ProfileRequest extends BlizzardApiRequest implements EntityRequest<List<Profile>> {

    private static final Logger logger = LoggerFactory.getLogger(ProfileRequest.class);

    private final static String rosterApi = "https://eu.api.blizzard.com/data/wow/guild/{realm}/{guildName}/roster"
        + "?namespace=profile-eu&locale={locale}";

    @Override
    public List<Profile> getEntity() {
        try {
            final JsonNode apiResponse = getResponse(rosterApi, getParameters());
            if (apiResponse != null && apiResponse.has("members")) {
                return StreamSupport.stream(apiResponse.get("members").spliterator(), false)
                    .map(node -> {
                        final JsonNode character = node.get("character");
                        final Profile profile = new Profile();
                        profile.setId(character.get("id").intValue());
                        profile.setName(character.get("name").textValue());
                        profile.setLevel(character.get("level").intValue());
                        profile.setRace(character.get("playable_race").get("id").intValue());
                        profile.setCharacterClass(character.get("playable_class").get("id").intValue());
                        profile.setRank(node.get("rank").intValue());
                        return profile;
                    })
                    .filter(profile -> profile.getLevel() == 60)
                    .collect(Collectors.toList());
            }
        } catch (Exception e) {
            if ( e instanceof HttpClientErrorException
                    && ((HttpClientErrorException)e).getStatusCode().equals(HttpStatus.UNAUTHORIZED)) {
                logger.warn("Unauthorized. Token: {}", authenticationService.getToken());
                authenticationService.clearAuthCache();
                logger.warn("Token cache cleared.");
            } else if (e instanceof RestClientException) {
                logger.warn("Profiles not found: {}", e.getMessage());
            } else {
                logger.error(e.getMessage(), e);
            }
        }
        return Collections.emptyList();
    }
}

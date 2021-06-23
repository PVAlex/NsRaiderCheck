package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.dao.blizzard.Reputation;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Получение информации о репутации.
 */
@Component
public class ReputationsRequest extends BlizzardApiRequest implements FieldRequest<Profile> {

    private static final Logger logger = LoggerFactory.getLogger(ReputationsRequest.class);
    private static final String reputationsApi = "https://eu.api.blizzard.com/profile/wow/character/{realm}/{name}"
        + "/reputations?namespace=profile-eu&locale={locale}";

    @Override
    public void fill(Profile entity) {
        try {
            final JsonNode apiResponse = getResponse(reputationsApi, getParameters(entity.getName()));
            if (apiResponse != null && apiResponse.has("reputations")) {
                entity.setReputations(StreamSupport.stream(apiResponse.get("reputations").spliterator(), false)
                    .map(node -> mapper.convertValue(node, Reputation.class)).collect(Collectors.toList()));
            }

        } catch (Exception e) {
            logger.error("Reputations not found for '{}' : {}", entity.getName(), e.getMessage());
            logger.debug(e.getMessage(), e);
        }
    }
}

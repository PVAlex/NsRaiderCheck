package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.dao.blizzard.Profession;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Получение информации о профессиях.
 */
@Component
public class ProfessionsRequest extends BlizzardApiRequest implements FieldRequest<Profile>{

    private static final Logger logger = LoggerFactory.getLogger(ProfessionsRequest.class);
    private static final String professionsApi = "https://eu.api.blizzard.com/profile/wow/character/{realm}/{name}"
        + "/professions?namespace=profile-eu&locale={locale}";

    @Override
    public void fill(Profile entity) {
        try {
            final JsonNode apiResponse = getResponse(professionsApi, getParameters(entity.getName()));
            if (apiResponse != null
                && apiResponse.has("primaries")
                && apiResponse.has("secondaries")) {
                entity.setPrimaryProfessions(StreamSupport.stream(apiResponse.get("primaries").spliterator(), false)
                    .map(node -> mapper.convertValue(node, Profession.class)).collect(Collectors.toList()));
                entity.setSecondaryProfessions(StreamSupport.stream(apiResponse.get("secondaries").spliterator(), false)
                    .map(node -> mapper.convertValue(node, Profession.class)).collect(Collectors.toList()));
            }
        } catch (Exception e) {
            logger.error("Professions not found for '{}' : {}", entity.getName(), e.getMessage());
            logger.debug(e.getMessage(), e);
        }
    }
}

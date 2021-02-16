package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.dao.blizzard.Detail;
import ru.nsguild.raidercheck.dao.blizzard.Specialization;

import java.util.stream.StreamSupport;

/**
 * Получение информации о выбранной специализации.
 */
@Component
public class SpecializationsRequest extends BlizzardApiRequest implements FieldRequest<Profile> {

    private static final Logger logger = LoggerFactory.getLogger(SpecializationsRequest.class);
    private static final String specializationsApi = "https://eu.api.blizzard.com/profile/wow/character/{realm}/{name}"
        + "/specializations?namespace=profile-eu&locale={locale}";

    @Override
    public void fill(Profile entity) {
        try {
            final JsonNode apiResponse = getResponse(specializationsApi, getParameters(entity.getName()));
            if (apiResponse != null
                && apiResponse.has("specializations")
                && apiResponse.has("active_specialization")) {
                final Detail active = mapper.convertValue(apiResponse.get("active_specialization"), Detail.class);
                StreamSupport.stream(apiResponse.get("specializations").spliterator(), false)
                    .map(node -> mapper.convertValue(node, Specialization.class))
                    .filter(specialization -> specialization.getSpecialization().equals(active))
                    .findFirst().ifPresent(entity::setSpecialization);
            }
        } catch (Exception e) {
            logger.error("Specializations not found for '{}' : {}", entity.getName(), e.getMessage());
        }
    }
}

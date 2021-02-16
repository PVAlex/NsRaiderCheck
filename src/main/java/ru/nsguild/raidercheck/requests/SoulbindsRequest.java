package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.dao.blizzard.Detail;
import ru.nsguild.raidercheck.dao.blizzard.Soulbind;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Получение информации о выбранном ковенанте.
 */
@Component
public class SoulbindsRequest extends BlizzardApiRequest implements FieldRequest<Profile> {

    private static final Logger logger = LoggerFactory.getLogger(SpecializationsRequest.class);
    private static final String soulbindsApi = "https://eu.api.blizzard.com/profile/wow/character/{realm}/{name}"
        + "/soulbinds?namespace=profile-eu&locale={locale}";

    @Override
    public void fill(Profile entity) {
        try {
            final JsonNode apiResponse = getResponse(soulbindsApi, getParameters(entity.getName()));
            if (apiResponse != null
                && apiResponse.has("chosen_covenant")) {
                entity.setChosenCovenant(mapper.convertValue(apiResponse.get("chosen_covenant"), Detail.class));
                entity.setRenownLevel(apiResponse.get("renown_level").asInt());
                if (apiResponse.has("soulbinds")) {
                    entity.setSoulbinds(StreamSupport.stream(apiResponse.get("soulbinds").spliterator(), false)
                        .map(node -> mapper.convertValue(node, Soulbind.class))
                        .collect(Collectors.toList()));
                }
            }
        } catch (Exception e) {
            logger.error("Soulbinds not found for '{}' : {}", entity.getName(), e.getMessage());
        }
    }
}

package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.dao.blizzard.*;
import ru.nsguild.raidercheck.service.database.ConduitService;
import ru.nsguild.raidercheck.service.database.IconService;
import ru.nsguild.raidercheck.service.database.TechTalentService;

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

    @Autowired
    private ConduitService conduitService;
    @Autowired
    private TechTalentService techTalentService;
    @Autowired
    private IconService iconService;

    @Override
    public void fill(Profile entity) {
        try {
            final JsonNode apiResponse = getResponse(soulbindsApi, getParameters(entity.getName()));
            if (apiResponse != null
                && apiResponse.has("chosen_covenant")) {
                entity.setChosenCovenant(mapper.convertValue(apiResponse.get("chosen_covenant"), Detail.class));
                entity.setRenownLevel(apiResponse.get("renown_level").asInt());
                if (apiResponse.has("soulbinds")) {
                    entity.setSoulbinds(StreamSupport.stream(apiResponse.get("soulbinds").spliterator(), true)
                        .map(node -> mapper.convertValue(node, Soulbind.class))
                        .peek(soulbind -> soulbind.getTraits().forEach(trait -> {
                            if (trait.getConduitSocket() != null && trait.getConduitSocket().getSocket() != null) {
                                trait.setSpell(conduitService.getSpell(trait.getConduitSocket().getSocket().getConduit().getId()));
                            }
                            if (trait.getTrait() != null && trait.getTrait().getId() != null) {
                                trait.setSpell(techTalentService.getSpell(trait.getTrait().getId()));
                            }
                            if (trait.getSpell() != null) {
                                trait.getSpell().setIcon(iconService.getSpellIcon(trait.getSpell().getSpell().getId()));
                            }
                        }))
                        .collect(Collectors.toList()));

                }
            }
        } catch (Exception e) {
            logger.error("Soulbinds not found for '{}' : {}", entity.getName(), e.getMessage());
            logger.debug(e.getMessage(), e);
        }
    }
}

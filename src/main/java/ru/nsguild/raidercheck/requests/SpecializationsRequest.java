package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.dao.blizzard.Detail;
import ru.nsguild.raidercheck.dao.blizzard.Specialization;
import ru.nsguild.raidercheck.service.database.IconService;

import java.util.stream.StreamSupport;

/**
 * Получение информации о выбранной специализации.
 */
@Component
public class SpecializationsRequest extends BlizzardApiRequest implements FieldRequest<Profile> {

    private static final Logger logger = LoggerFactory.getLogger(SpecializationsRequest.class);
    private static final String specializationsApi = "https://eu.api.blizzard.com/profile/wow/character/{realm}/{name}"
        + "/specializations?namespace=profile-eu&locale={locale}";

    @Autowired
    private IconService iconService;

    @Override
    public void fill(Profile entity) {
        try {
            final JsonNode apiResponse = getResponse(specializationsApi, getParameters(entity.getName()));
            if (apiResponse != null
                && apiResponse.has("specializations")
                && apiResponse.has("active_specialization")) {
                final Detail active = mapper.convertValue(apiResponse.get("active_specialization"), Detail.class);
                StreamSupport.stream(apiResponse.get("specializations").spliterator(), true)
                    .map(node -> mapper.convertValue(node, Specialization.class))
                    .filter(specialization -> specialization.getSpecialization().equals(active))
                    .peek(spec ->
                        spec.getTalents().forEach(talent ->
                            talent.getSpellTooltip()
                                    .setIcon(iconService.getSpellIcon(talent.getSpellTooltip().getSpell().getId()))))
                    .peek(spec ->
                            spec.getPvpTalentSlots().forEach(pvpTalent -> {
                                if (pvpTalent.getSelected() != null) {
                                    pvpTalent.getSelected().getSpellTooltip()
                                            .setIcon(iconService
                                                    .getSpellIcon(pvpTalent.getSelected().getSpellTooltip().getSpell().getId()));
                                }
                            }))
                    .findFirst().ifPresent(entity::setSpecialization);
            }
        } catch (Exception e) {
            logger.error("Specializations not found for '{}' : {}", entity.getName(), e.getMessage());
            logger.debug(e.getMessage(), e);
        }
    }
}

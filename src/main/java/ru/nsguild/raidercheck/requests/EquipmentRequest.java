package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.dao.blizzard.EquippedItem;
import ru.nsguild.raidercheck.service.IconService;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Получение информации об экипировке.
 */
@Component
public class EquipmentRequest extends BlizzardApiRequest implements FieldRequest<Profile> {

    private static final Logger logger = LoggerFactory.getLogger(EquipmentRequest.class);
    private static final String equipmentApi = "https://eu.api.blizzard.com/profile/wow/character/{realm}/{name}"
        + "/equipment?namespace=profile-eu&locale={locale}";

    @Autowired
    private IconService iconService;

    @Override
    public void fill(Profile entity) {
        try {
            final JsonNode apiResponse = getResponse(equipmentApi, getParameters(entity.getName()));
            if (apiResponse != null && apiResponse.has("equipped_items")) {
                entity.setEquippedItems(StreamSupport.stream(apiResponse.get("equipped_items").spliterator(), true)
                    .map(node -> mapper.convertValue(node, EquippedItem.class))
                    .peek(item -> item.setIcon(iconService.getItemIcon(item.getItem().getId())))
                    .collect(Collectors.toList()));
            }
        } catch(Exception e) {
            logger.error("Equipment not found for '{}' : {}", entity.getName(), e.getMessage());
            logger.debug(e.getMessage(), e);
        }
    }
}

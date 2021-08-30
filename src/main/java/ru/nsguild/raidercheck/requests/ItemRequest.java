package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.blizzard.Item;

import java.util.Map;

@Component
public class ItemRequest extends BlizzardApiRequest implements EntityRequest<Item> {

    private static final Logger logger = LoggerFactory.getLogger(ItemRequest.class);
    private static final String itemApi = "https://us.api.blizzard.com/data/wow/item/{id}?namespace=static-us&locale={locale}";

    @Override
    public Item getEntity(Map<String, String> params) {
        final Map<String, String> parameters = getParameters(params);

        try {
            final JsonNode apiResponse = getResponse(itemApi, parameters);
            if (apiResponse != null && apiResponse.has("preview_item")) {
                return mapper.convertValue(apiResponse.get("preview_item"), Item.class);
            }

        } catch (Exception e) {
            logger.error("Item {} not found: {}", params.get("id"), e.getMessage());
            logger.debug(e.getMessage(), e);
        }
        return null;
    }
}

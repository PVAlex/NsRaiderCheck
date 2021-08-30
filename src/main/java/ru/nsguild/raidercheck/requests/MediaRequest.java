package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.blizzard.Asset;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.StreamSupport;

@Component
public class MediaRequest extends BlizzardApiRequest implements EntityRequest<Asset> {

    private static final Logger logger = LoggerFactory.getLogger(MediaRequest.class);

    private final String mediaApi = "https://us.api.blizzard.com/data/wow/media/{type}/{id}?namespace=static-us&locale={locale}";

    @Override
    public Asset getEntity(Map<String, String> params) {
        final Map<String, String> parameters = new HashMap<>(params);
        parameters.put("locale", locale);

        try {
            final JsonNode apiResponse = getResponse(mediaApi, parameters);
            if (apiResponse != null && apiResponse.has("assets")) {
                return StreamSupport.stream(apiResponse.get("assets").spliterator(), false)
                        .filter(node -> node.get("key").asText("").equals("icon"))
                        .map(node -> mapper.convertValue(node, Asset.class))
                        .findFirst().orElse(null);
            }
        } catch (Exception e) {
            logger.error("Media {} {} not found: {}", params.get("type"), params.get("id"), e.getMessage());
            logger.debug(e.getMessage(), e);
        }
        return null;
    }
}

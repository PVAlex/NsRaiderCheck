package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.blizzard.Conduit;

import java.util.HashMap;
import java.util.Map;

@Component
public class ConduitRequest extends BlizzardApiRequest implements EntityRequest<Conduit> {

    private static final Logger logger = LoggerFactory.getLogger(ConduitRequest.class);

    private final static String conduitApi = "https://eu.api.blizzard.com/data/wow/covenant/conduit/{id}?namespace=static-eu&locale={locale}";

    @Override
    public Conduit getEntity(Map<String, String> params) {
        final Map<String, String> parameters = new HashMap<String, String>(params) {
            {
                put("locale", locale);
            }
        };
        try {
            final JsonNode apiResponse = getResponse(conduitApi, parameters);
            if (apiResponse != null) {
                return mapper.convertValue(apiResponse, Conduit.class);
            }

        } catch (Exception e) {
            logger.error("Conduit {} not found.", params.get("id"));
            logger.debug(e.getMessage(), e);
        }
        return null;
    }
}

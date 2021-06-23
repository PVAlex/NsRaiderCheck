package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.blizzard.TechTalent;

import java.util.HashMap;
import java.util.Map;

@Component
public class TechTalentRequest extends BlizzardApiRequest implements EntityRequest<TechTalent> {

    private static final Logger logger = LoggerFactory.getLogger(TechTalentRequest.class);

    private static final String techTalentApi = "https://us.api.blizzard.com/data/wow/tech-talent/{id}?namespace=static-us&locale={locale}";

    @Override
    public TechTalent getEntity(Map<String, String> params) {
        final Map<String, String> parameters = new HashMap<String, String>(params) {
            {
                put("locale", locale);
            }
        };
        try {
            final JsonNode apiResponse = getResponse(techTalentApi, parameters);
            if (apiResponse != null) {
                return mapper.convertValue(apiResponse, TechTalent.class);
            }

        } catch (Exception e) {
            logger.error("TechTalent {} not found.", params.get("id"));
            logger.debug(e.getMessage(), e);
        }
        return null;
    }
}

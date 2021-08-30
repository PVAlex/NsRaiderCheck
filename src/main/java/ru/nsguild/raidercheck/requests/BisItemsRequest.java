package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.BisItem;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
public class BisItemsRequest extends BlizzardApiRequest implements EntityRequest<List<BisItem>> {

    private static final Logger logger = LoggerFactory.getLogger(BisItemsRequest.class);
    //todo отдельный запрос на инст
    private static final String journalInstanceApi = "https://us.api.blizzard.com/data/wow/journal-instance/{id}?namespace=static-us&locale={locale}";
    private static final String journalEncounterApi = "https://us.api.blizzard.com/data/wow/journal-encounter/{id}?namespace=static-us&locale={locale}";

    @Autowired
    private ItemRequest itemRequest;

    @Override
    public List<BisItem> getEntity(Map<String, String> params) {
        final Map<String, String> instanceParameters = getParameters(params);
        try {
            final JsonNode apiResponse = getResponse(journalInstanceApi, instanceParameters);
            if (apiResponse != null) {
                return StreamSupport.stream(apiResponse.get("encounters").spliterator(), true)
                        .map(jsonNode -> jsonNode.get("id").asInt())
                        .map(this::getBisItems)
                        .peek(bisItems -> bisItems.forEach(bisItem ->
                                bisItem.setInstanceId(Integer.parseInt(params.get("id")))))
                        .flatMap(List::stream)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            logger.error("Instance " + params.get("id") + " error", e);
        }
        return Collections.emptyList();
    }

    private List<BisItem> getBisItems(Integer id) {
        final Map<String, String> encounterParameters = getParameters();
        encounterParameters.put("id", id.toString());
        try {
            final JsonNode apiResponse = getResponse(journalEncounterApi, encounterParameters);
            if (apiResponse != null) {
                return StreamSupport.stream(apiResponse.get("items").spliterator(), false)
                        .map(jsonNode -> {
                            try {
                                // Too fast for 100 req/s
                                Thread.sleep(20);
                            } catch (InterruptedException e) {
                                logger.debug("Can`t sleep TT", e);
                            }
                            final Map<String, String> itemParams = new HashMap<>();
                            itemParams.put("id", jsonNode.get("item").get("id").asText());
                            return itemRequest.getEntity(itemParams);
                        })
                        .filter(item -> item != null &&
                                (item.getItemClass().getId() == 4 || item.getItemClass().getId() == 2))
                        .map(item -> {
                            final BisItem bisItem = new BisItem();
                            bisItem.setItem(item);
                            bisItem.setEncounterId(id);
                            bisItem.setId(item.getItem().getId());
                            return bisItem;
                        })
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            logger.error("Encounter " + id + " error.", e);
        }
        return Collections.emptyList();
    }
}

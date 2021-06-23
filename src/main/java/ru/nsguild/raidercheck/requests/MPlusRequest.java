package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.dao.rio.Mythic;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Получение информации о пройденных мификах+
 */
@Component
public class MPlusRequest extends RioApiRequest implements FieldRequest<Profile> {

    private static final Logger logger = LoggerFactory.getLogger(MPlusRequest.class);
    private static final String rioApi = "https://raider.io/api/v1/characters/profile?region=eu"
        + "&realm={realm}&name={name}&fields="
            + "mythic_plus_weekly_highest_level_runs,"
            + "mythic_plus_highest_level_runs,"
            + "mythic_plus_previous_weekly_highest_level_runs,"
            + "mythic_plus_scores";

    @Override
    public void fill(Profile entity) {
        try {
            final JsonNode apiResponse = getResponse(rioApi, getParameters(entity.getName()));
            if (apiResponse != null) {
                if (apiResponse.has("mythic_plus_weekly_highest_level_runs")) {
                    entity.setMythicWeeklyHighest(StreamSupport.stream(apiResponse.get("mythic_plus_weekly_highest_level_runs").spliterator(), false)
                            .map(node -> mapper.convertValue(node, Mythic.class))
                            .collect(Collectors.toList()));
                }
                if (apiResponse.has("mythic_plus_previous_weekly_highest_level_runs")) {
                    entity.setMythicLastWeek(StreamSupport.stream(apiResponse.get("mythic_plus_previous_weekly_highest_level_runs").spliterator(), false)
                            .map(node -> mapper.convertValue(node, Mythic.class))
                            .collect(Collectors.toList()));
                }
                if (apiResponse.has("mythic_plus_highest_level_runs")) {
                    entity.setMythicMax(StreamSupport.stream(apiResponse.get("mythic_plus_highest_level_runs").spliterator(), false)
                            .map(node -> mapper.convertValue(node, Mythic.class))
                            .collect(Collectors.toList()));
                }
                if (apiResponse.has("mythic_plus_scores")){
                    entity.setMythicScore(apiResponse.get("mythic_plus_scores").get("all").asDouble());
                }
            }
        } catch (Exception e) {
            logger.error("MPlus not found for '{}' : {}", entity.getName(), e.getMessage());
            logger.debug(e.getMessage(), e);
        }
    }
}

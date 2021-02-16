package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import ru.nsguild.raidercheck.service.ApiAuthenticationService;

import java.util.HashMap;
import java.util.Map;

/**
 * Базовый класс для запросов в Blizzard api.
 */
abstract class BlizzardApiRequest extends ApiRequest {

    private static final Logger logger = LoggerFactory.getLogger(BlizzardApiRequest.class);

    @Autowired
    protected ApiAuthenticationService authenticationService;

    @Value("${guild.name:}")
    protected String guildName;
    @Value("${guild.realm:}")
    protected String realm;
    @Value("${locale:en_EU}")
    protected String locale;

    /**
     * Получение параметров для запроса.
     *
     * @param name имя персонажа
     * @return параметры
     */
    protected Map<String, String> getParameters(String name) {
        final Map<String, String> parameters = getParameters();
        parameters.put("name", name.toLowerCase());
        return parameters;
    }

    /**
     * Получение параметров для запроса.
     *
     * @return параметры
     */
    protected Map<String, String> getParameters() {
        return new HashMap<String, String>() {
            {
                put("realm", realm);
                put("locale", locale);
                put("guildName", guildName.toLowerCase().replaceAll(" ", "-"));
            }
        };
    }

    @Override
    protected JsonNode getResponse(String url, Map<String, String> parameters) {
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", "Bearer " + authenticationService.getToken());
        return getResponse(url, parameters, httpHeaders);
    }
}

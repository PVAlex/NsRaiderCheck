package ru.nsguild.raidercheck.requests;

import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.Map;

/**
 * Базовый класс для запросов в Raider.io.
 */
abstract class RioApiRequest extends ApiRequest {

    @Value("${guild.realm}")
    private String realm;

    protected Map<String, String> getParameters(String name) {
        return new HashMap<String, String>() {
            {
                put("realm", realm);
                put("name", name);
            }
        };
    }
}

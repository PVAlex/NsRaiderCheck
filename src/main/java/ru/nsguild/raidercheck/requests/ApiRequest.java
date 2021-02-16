package ru.nsguild.raidercheck.requests;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Базовый класс для запросов.
 */
abstract class ApiRequest {

    @Autowired
    protected RestTemplate restTemplate;

    protected ObjectMapper mapper = new ObjectMapper();

    /**
     * Запрос.
     *
     * @param url        api url
     * @param parameters параметры запроса
     * @return ответ на запрос
     */
    protected ResponseEntity<JsonNode> getResponseEntity(String url, Map<String, String> parameters) {
        return getResponseEntity(url, parameters, new HttpHeaders());
    }

    /**
     * Запрос.
     *
     * @param url        api url
     * @param parameters параметры запроса
     * @return ответ на запрос
     */
    protected ResponseEntity<JsonNode> getResponseEntity(String url, Map<String, String> parameters, HttpHeaders headers) {
        final HttpEntity<Object> entity = new HttpEntity<>(headers);
        return restTemplate.exchange(url, HttpMethod.GET, entity, JsonNode.class, parameters);
    }

    /**
     * Запрос.
     *
     * @param url        api url
     * @param parameters параметры запроса
     * @return ответ на запрос
     */
    protected JsonNode getResponse(String url, Map<String, String> parameters) {
        final ResponseEntity<JsonNode> response = getResponseEntity(url, parameters);
        return response.hasBody() ? response.getBody() : null;
    }

    /**
     * Запрос.
     *
     * @param url        api url
     * @param parameters параметры запроса
     * @return ответ на запрос
     */
    protected JsonNode getResponse(String url, Map<String, String> parameters, HttpHeaders headers) {
        final ResponseEntity<JsonNode> response = getResponseEntity(url, parameters, headers);
        return response.hasBody() ? response.getBody() : null;
    }
}

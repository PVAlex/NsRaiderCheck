package ru.nsguild.raidercheck.requests;

import java.util.Map;

/**
 * Интерфейс для получения сущностей из ответа.
 * @param <T> тип сущности
 */
public interface EntityRequest<T> {

    /**
     * Получить сущность.
     * @return сущность
     */
    default T getEntity() {
        return getEntity(null);
    };

    /**
     * Получить сущность.
     *
     * @param params параметры
     * @return сущность
     */
    T getEntity(Map<String, String> params);
}

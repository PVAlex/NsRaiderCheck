package ru.nsguild.raidercheck.requests;

/**
 * Интерфейс для получения сущностей из ответа.
 * @param <T> тип сущности
 */
public interface EntityRequest<T> {

    /**
     * Получить сущность.
     * @return сущность
     */
    T getEntity();
}

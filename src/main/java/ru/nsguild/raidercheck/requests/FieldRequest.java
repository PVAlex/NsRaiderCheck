package ru.nsguild.raidercheck.requests;

/**
 * Интерфейс для заполнения полей сущности
 * @param <T> тип сущности
 */
public interface FieldRequest<T> {

    /**
     * Заполнить поля.
     *
     * @param entity сущность для заполнения
     */
    void fill(T entity);
}

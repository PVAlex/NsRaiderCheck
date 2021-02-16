package ru.nsguild.raidercheck.support;

import java.util.HashMap;
import java.util.Map;

public class RaceConverter {
    private static Map<Integer, String> races = new HashMap<Integer, String>() {
        {
            put(1, "Человек");
            put(2, "Орк");
            put(3, "Дворф");
            put(4, "Ночной эльф");
            put(5, "Нежить");
            put(6, "Таурен");
            put(7, "Гном");
            put(8, "Тролль");
            put(9, "Гоблин");
            put(10, "Эльф крови");
            put(11, "Дреней");
            put(22, "Ворген");
            put(24, "Пандарен");
            put(25, "Пандарен");
            put(26, "Пандарен");
            put(27, "Ночнорожденный");
            put(29, "Эльф Бездны");
            put(30, "Озаренный дреней");
            put(31, "Зандалар");
            put(32, "Култирасец");
            put(34, "Дворф из клана Черного Железа");
            put(35, "Вульпера");
            put(36, "Маг'хар");
            put(37, "Механогном");
        }
    };

    public String getById(Integer id) {
        return races.getOrDefault(id, "");
    }
}

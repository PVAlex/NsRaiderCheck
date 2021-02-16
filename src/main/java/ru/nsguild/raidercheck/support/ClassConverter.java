package ru.nsguild.raidercheck.support;

import java.util.HashMap;
import java.util.Map;

public class ClassConverter {

    private static Map<Integer, String> classes = new HashMap<Integer, String>() {
        {
            put(1, "Воин");
            put(2, "Паладин");
            put(3, "Охотник");
            put(4, "Разбойник");
            put(5, "Жрец");
            put(6, "Рыцарь смерти");
            put(7, "Шаман");
            put(8, "Маг");
            put(9, "Чернокнижник");
            put(10, "Монах");
            put(11, "Друид");
            put(12, "Охотник на демонов");
        }
    };

    public static String getById(Integer id) {
        return classes.getOrDefault(id, "");
    }
}

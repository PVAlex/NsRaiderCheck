package ru.nsguild.raidercheck.dao;

public enum Instance {

    SANCTUM_OF_DOMINATION(1193),
    CASTLE_NATHRIA(1190);

    public final Integer id;

    private Instance(Integer id) {
        this.id = id;
    }

}

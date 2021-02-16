
package ru.nsguild.raidercheck.dao;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import ru.nsguild.raidercheck.dao.blizzard.*;
import ru.nsguild.raidercheck.dao.rio.Mythic;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Сущность для хранения данных о персонаже.
 */
@Document
public class Profile {
    @Id
    private Integer id;
    private String name;
    private Integer level;
    private Integer rank;
    private Integer race;
    private Integer characterClass;
    private List<EquippedItem> equippedItems = new ArrayList<EquippedItem>();
    private Specialization specialization;
    private List<Reputation> reputations;
    private List<Profession> primaryProfessions;
    private List<Profession> secondaryProfessions;
    private List<Mythic> mythicWeeklyHighest;
    private List<Mythic> mythicLastWeek;
    private List<Mythic> mythicMax;
    private Double mythicScore;
    private Detail chosenCovenant;
    private List<Soulbind> soulbinds;
    private Integer renownLevel;

    public Integer getMedianIlvl() {
        final List<Integer> ilvls = equippedItems.stream()
            .filter(equippedItem -> !(equippedItem.getSlot().getType().equals("SHIRT") || equippedItem.getSlot().getType().equals("TABARD")))
            .map(equippedItem -> Integer.valueOf(equippedItem.getLevel().getValue()))
            .collect(Collectors.toList());
        return ilvls.stream().mapToInt(Integer::intValue).sum() / ilvls.size();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getRace() {
        return race;
    }

    public void setRace(Integer race) {
        this.race = race;
    }

    public Integer getCharacterClass() {
        return characterClass;
    }

    public void setCharacterClass(Integer characterClass) {
        this.characterClass = characterClass;
    }

    public List<EquippedItem> getEquippedItems() {
        return equippedItems;
    }

    public void setEquippedItems(List<EquippedItem> equippedItems) {
        this.equippedItems = equippedItems;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Specialization getSpecialization() {
        return specialization;
    }

    public void setSpecialization(Specialization specialization) {
        this.specialization = specialization;
    }

    public List<Reputation> getReputations() {
        return reputations;
    }

    public void setReputations(List<Reputation> reputations) {
        this.reputations = reputations;
    }

    public List<Profession> getPrimaryProfessions() {
        return primaryProfessions;
    }

    public void setPrimaryProfessions(List<Profession> primaryProfessions) {
        this.primaryProfessions = primaryProfessions;
    }

    public List<Profession> getSecondaryProfessions() {
        return secondaryProfessions;
    }

    public void setSecondaryProfessions(List<Profession> secondaryProfessions) {
        this.secondaryProfessions = secondaryProfessions;
    }

    public List<Mythic> getMythicWeeklyHighest() {
        return mythicWeeklyHighest;
    }

    public void setMythicWeeklyHighest(List<Mythic> mythicWeeklyHighest) {
        this.mythicWeeklyHighest = mythicWeeklyHighest;
    }

    public List<Mythic> getMythicLastWeek() {
        return mythicLastWeek;
    }

    public void setMythicLastWeek(List<Mythic> mythicLastWeek) {
        this.mythicLastWeek = mythicLastWeek;
    }

    public List<Mythic> getMythicMax() {
        return mythicMax;
    }

    public void setMythicMax(List<Mythic> mythicMax) {
        this.mythicMax = mythicMax;
    }

    public Detail getChosenCovenant() {
        return chosenCovenant;
    }

    public void setChosenCovenant(Detail chosenCovenant) {
        this.chosenCovenant = chosenCovenant;
    }

    public List<Soulbind> getSoulbinds() {
        return soulbinds;
    }

    public void setSoulbinds(List<Soulbind> soulbinds) {
        this.soulbinds = soulbinds;
    }

    public Integer getRenownLevel() {
        return renownLevel;
    }

    public void setRenownLevel(Integer renownLevel) {
        this.renownLevel = renownLevel;
    }

    public Double getMythicScore() {
        return mythicScore;
    }

    public void setMythicScore(Double mythicScore) {
        this.mythicScore = mythicScore;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null || getClass() != o.getClass()) return false;

        Profile profile = (Profile) o;

        return new EqualsBuilder()
                .append(id, profile.id)
                .append(name, profile.name)
                .append(level, profile.level)
                .append(rank, profile.rank)
                .append(race, profile.race)
                .append(characterClass, profile.characterClass)
                .append(equippedItems, profile.equippedItems)
                .append(specialization, profile.specialization)
                .append(reputations, profile.reputations)
                .append(primaryProfessions, profile.primaryProfessions)
                .append(secondaryProfessions, profile.secondaryProfessions)
                .append(mythicWeeklyHighest, profile.mythicWeeklyHighest)
                .append(mythicLastWeek, profile.mythicLastWeek)
                .append(mythicMax, profile.mythicMax)
                .append(mythicScore, profile.mythicScore)
                .append(chosenCovenant, profile.chosenCovenant)
                .append(soulbinds, profile.soulbinds)
                .append(renownLevel, profile.renownLevel)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(id)
                .append(name)
                .append(level)
                .append(rank)
                .append(race)
                .append(characterClass)
                .append(equippedItems)
                .append(specialization)
                .append(reputations)
                .append(primaryProfessions)
                .append(secondaryProfessions)
                .append(mythicWeeklyHighest)
                .append(mythicLastWeek)
                .append(mythicMax)
                .append(mythicScore)
                .append(chosenCovenant)
                .append(soulbinds)
                .append(renownLevel)
                .toHashCode();
    }
}

package ru.nsguild.raidercheck.dao;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

public class BisItemData {
    private Integer itemId;
    private String itemName;
    private Integer currentItemId;
    private String currentItemName;
    private Integer ilvl;
    private String itemSlot;
    private String stat1Type;
    private String stat2Type;
    private Boolean stat1Compare;
    private Boolean stat2Compare;
    private Boolean analog;

    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public Integer getCurrentItemId() {
        return currentItemId;
    }

    public void setCurrentItemId(Integer currentItemId) {
        this.currentItemId = currentItemId;
    }

    public String getCurrentItemName() {
        return currentItemName;
    }

    public void setCurrentItemName(String currentItemName) {
        this.currentItemName = currentItemName;
    }

    public String getItemSlot() {
        return itemSlot;
    }

    public void setItemSlot(String itemSlot) {
        this.itemSlot = itemSlot;
    }

    public String getStat1Type() {
        return stat1Type;
    }

    public void setStat1Type(String stat1Type) {
        this.stat1Type = stat1Type;
    }

    public String getStat2Type() {
        return stat2Type;
    }

    public void setStat2Type(String stat2Type) {
        this.stat2Type = stat2Type;
    }

    public Boolean getStat1Compare() {
        return stat1Compare;
    }

    public void setStat1Compare(Boolean stat1Compare) {
        this.stat1Compare = stat1Compare;
    }

    public Boolean getStat2Compare() {
        return stat2Compare;
    }

    public void setStat2Compare(Boolean stat2Compare) {
        this.stat2Compare = stat2Compare;
    }

    public Boolean getAnalog() {
        return analog;
    }

    public void setAnalog(Boolean analog) {
        this.analog = analog;
    }

    public Integer getIlvl() {
        return ilvl;
    }

    public void setIlvl(Integer ilvl) {
        this.ilvl = ilvl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null || getClass() != o.getClass()) return false;

        BisItemData that = (BisItemData) o;

        return new EqualsBuilder()
                .append(itemId, that.itemId)
                .append(itemName, that.itemName)
                .append(currentItemId, that.currentItemId)
                .append(currentItemName, that.currentItemName)
                .append(ilvl, that.ilvl)
                .append(itemSlot, that.itemSlot)
                .append(stat1Type, that.stat1Type)
                .append(stat2Type, that.stat2Type)
                .append(stat1Compare, that.stat1Compare)
                .append(stat2Compare, that.stat2Compare)
                .append(analog, that.analog)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(itemId)
                .append(itemName)
                .append(currentItemId)
                .append(currentItemName)
                .append(ilvl)
                .append(itemSlot)
                .append(stat1Type)
                .append(stat2Type)
                .append(stat1Compare)
                .append(stat2Compare)
                .append(analog)
                .toHashCode();
    }
}

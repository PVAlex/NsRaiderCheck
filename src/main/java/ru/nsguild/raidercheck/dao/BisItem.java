package ru.nsguild.raidercheck.dao;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.springframework.data.mongodb.core.mapping.Document;
import ru.nsguild.raidercheck.dao.blizzard.Item;

@Document
public class BisItem {
    private Integer id;
    private Integer instanceId;
    private Integer encounterId;
    private Item item;

    public Integer getInstanceId() {
        return instanceId;
    }

    public BisItem setInstanceId(Integer instanceId) {
        this.instanceId = instanceId;
        return this;
    }

    public Integer getEncounterId() {
        return encounterId;
    }

    public BisItem setEncounterId(Integer encounterId) {
        this.encounterId = encounterId;
        return this;
    }

    public Integer getId() {
        return id;
    }

    public BisItem setId(Integer id) {
        this.id = id;
        return this;
    }

    public Item getItem() {
        return item;
    }

    public BisItem setItem(Item item) {
        this.item = item;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null || getClass() != o.getClass()) return false;

        BisItem bisItem = (BisItem) o;

        return new EqualsBuilder()
                .append(id, bisItem.id)
                .append(instanceId, bisItem.instanceId)
                .append(encounterId, bisItem.encounterId)
                .append(item, bisItem.item)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(id)
                .append(instanceId)
                .append(encounterId)
                .append(item)
                .toHashCode();
    }
}

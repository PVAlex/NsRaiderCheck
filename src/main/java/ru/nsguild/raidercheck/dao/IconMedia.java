package ru.nsguild.raidercheck.dao;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import ru.nsguild.raidercheck.dao.blizzard.Asset;

import java.util.ArrayList;
import java.util.List;

@Document
public class IconMedia {
    @Id
    private Integer id;
    private List<Integer> sharedId;
    private Asset media;

    public Integer getId() {
        return id;
    }

    public IconMedia setId(Integer id) {
        this.id = id;
        return this;
    }

    public List<Integer> getSharedId() {
        if (sharedId == null) {
            sharedId = new ArrayList<>();
        }
        return sharedId;
    }

    public IconMedia setSharedId(List<Integer> sharedId) {
        this.sharedId = sharedId;
        return this;
    }

    public Asset getMedia() {
        return media;
    }

    public IconMedia setMedia(Asset media) {
        this.media = media;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null || getClass() != o.getClass()) return false;

        IconMedia iconMedia = (IconMedia) o;

        return new EqualsBuilder()
                .append(id, iconMedia.id)
                .append(sharedId, iconMedia.sharedId)
                .append(media, iconMedia.media)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(id)
                .append(sharedId)
                .append(media)
                .toHashCode();
    }
}

package ru.nsguild.raidercheck.entity;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import ru.nsguild.raidercheck.api.blizzard.Character;
import ru.nsguild.raidercheck.api.rio.Rio;

/**
 * Сущность для хранения данных в MongoDB.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "name",
        "character",
        "rio",
        "rank",
        "guildMembership"
})
public class Member {

    @JsonIgnore
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("character")
    private Character character;
    @JsonProperty("rio")
    private Rio rio;
    @JsonProperty("rank")
    private Integer rank;
    @JsonProperty("guildMembership")
    private GuildMembership guildMembership;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Character getCharacter() {
        return character;
    }

    public void setCharacter(Character character) {
        this.character = character;
    }

    public Rio getRio() {
        return rio;
    }

    public void setRio(Rio rio) {
        this.rio = rio;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public GuildMembership getGuildMembership() {
        return guildMembership;
    }

    public void setGuildMembership(GuildMembership guildMembership) {
        this.guildMembership = guildMembership;
    }

    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(Member.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this))).append('[');
        sb.append("name");
        sb.append('=');
        sb.append(((this.name == null)?"<null>":this.name));
        sb.append(',');
        sb.append("character");
        sb.append('=');
        sb.append(((this.character == null)?"<null>":this.character));
        sb.append(',');
        sb.append("rank");
        sb.append('=');
        sb.append(((this.rank == null)?"<null>":this.rank));
        sb.append(',');
        sb.append("additionalProperties");
        sb.append('=');
        sb.append(((this.additionalProperties == null)?"<null>":this.additionalProperties));
        sb.append(',');
        if (sb.charAt((sb.length()- 1)) == ',') {
            sb.setCharAt((sb.length()- 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

    @Override
    public int hashCode() {
        int result = 1;
        result = ((result* 31)+((this.name == null)? 0 :this.name.hashCode()));
        result = ((result* 31)+((this.rank == null)? 0 :this.rank.hashCode()));
        result = ((result* 31)+((this.character == null)? 0 :this.character.hashCode()));
        result = ((result* 31)+((this.additionalProperties == null)? 0 :this.additionalProperties.hashCode()));
        return result;
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof Member)) {
            return false;
        }
        Member rhs = ((Member) other);
        return (this.name.equals(rhs.name)
                || this.name.equals(rhs.name)) && (this.rank.equals(rhs.rank)
                || this.rank.equals(rhs.rank)) && (this.character == rhs.character
                || this.character != null && this.character.equals(rhs.character))
                && (this.additionalProperties == rhs.additionalProperties
                || this.additionalProperties != null && this.additionalProperties.equals(rhs.additionalProperties));
    }

}

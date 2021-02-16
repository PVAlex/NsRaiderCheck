package ru.nsguild.raidercheck.graphql;

import com.coxautodev.graphql.tools.GraphQLResolver;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.blizzard.Detail;
import ru.nsguild.raidercheck.dao.blizzard.EquippedItem;

@Component
public class EquippedItemResolver implements GraphQLResolver<EquippedItem> {

    public String nameDescription(EquippedItem equippedItem) {
        if (equippedItem.getNameDescription() instanceof Detail) {
            return ((Detail) equippedItem.getNameDescription()).getName();
        } else {
            return equippedItem.getNameDescription().toString();
        }
    }

}

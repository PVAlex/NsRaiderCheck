package ru.nsguild.raidercheck.graphql;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.execution.AbortExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.BisItemData;
import ru.nsguild.raidercheck.dao.BisProfile;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.service.database.BisService;
import ru.nsguild.raidercheck.service.database.ProfileService;
import ru.nsguild.raidercheck.service.support.TaskService;

@Component
public class Mutations implements GraphQLMutationResolver {

    private static final Logger logger = LoggerFactory.getLogger(Mutations.class);

    @Autowired
    private TaskService taskService;
    @Autowired
    private BisService bisService;
    @Autowired
    private ProfileService profileService;

    public boolean refreshProfiles() {
        taskService.refreshProfiles();
        return true;
    }

    public BisProfile setBisItem(String name, String slot, Integer itemId) {
        final BisProfile bisProfile = bisService.findProfileByName(name);
        if (itemId == null) {
            bisProfile.getItems().removeIf(itemData -> itemData.getItemSlot().equals(slot));
            bisService.saveProfile(bisProfile);
            return bisProfile;
        }

        final Profile profile = profileService.findByName(name).orElseThrow(() -> new AbortExecutionException("Profile not found"));
        final BisItemData bisItemData;
        if (bisProfile.getItems().stream().anyMatch(item -> item.getItemSlot().equalsIgnoreCase(slot))) {
            bisItemData = bisProfile.getItems().stream()
                    .filter(item -> item.getItemSlot().equalsIgnoreCase(slot))
                    .findFirst().orElseThrow(() -> new AbortExecutionException("Item not found"));
            bisItemData.setItemId(itemId);
        } else {
            bisItemData = new BisItemData();
            bisItemData.setItemId(itemId);
            bisItemData.setItemSlot(slot);
            bisProfile.getItems().add(bisItemData);
        }
        bisService.checkItem(profile, bisItemData);

        bisService.saveProfile(bisProfile);
        return bisProfile;
    }
}

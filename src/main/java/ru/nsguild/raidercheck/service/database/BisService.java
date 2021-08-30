package ru.nsguild.raidercheck.service.database;

import graphql.execution.AbortExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.nsguild.raidercheck.dao.*;
import ru.nsguild.raidercheck.repository.BisItemRepository;
import ru.nsguild.raidercheck.repository.BisProfileRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class BisService {

    private static final Logger logger = LoggerFactory.getLogger(BisService.class);

    @Autowired
    private BisProfileRepository bisProfileRepository;
    @Autowired
    private BisItemRepository bisItemRepository;

    public List<BisItem> getItemsByInstance(Integer id) {
        return bisItemRepository.findByInstanceId(id);
    }

    public List<BisItem> getItemsByInstance(Instance instance) {
        return getItemsByInstance(instance.id);
    }

    public List<BisItem> getItemsByEncounter(Integer id) {
        return bisItemRepository.findByEncounterId(id);
    }

    public Optional<BisItem> getItemById(Integer id) {
        return bisItemRepository.findById(id);
    }

    public void saveItems(List<BisItem> items) {
        bisItemRepository.saveAll(items);
    }

    public List<BisProfile> findAllProfiles() {
        return StreamSupport.stream(bisProfileRepository.findAll().spliterator(), false).collect(Collectors.toList());
    }

    public BisProfile findProfileByName(String name) {
        return bisProfileRepository.getByName(name).orElse(null);
    }

    public void saveProfile(BisProfile profile) {
        bisProfileRepository.save(profile);
    }

    public void saveProfiles(List<BisProfile> profiles) {
        bisProfileRepository.saveAll(profiles);
    }

    public void checkItems(Profile profile) {
        final BisProfile bisProfile = findProfileByName(profile.getName());
        bisProfile.getItems().forEach(bisItemData -> {
            checkItem(profile, bisItemData);
        });
        saveProfile(bisProfile);
    }

    public void checkItem(Profile profile, BisItemData bisItemData) {
        final Integer itemId = bisItemData.getItemId();
        final String slot = bisItemData.getItemSlot();
        final BisItem bisItem = getItemById(itemId).orElseThrow(() -> new AbortExecutionException("Item not found"));
        bisItemData.setItemName(bisItem.getItem().getName());
        bisItemData.setCurrentItemName(null);
        bisItemData.setCurrentItemId(null);
        bisItemData.setStat1Compare(null);
        bisItemData.setStat2Compare(null);
        bisItemData.setStat1Type(null);
        bisItemData.setStat2Type(null);

        profile.getEquippedItems().stream()
                .filter(item -> item.getInventoryType().getType().equalsIgnoreCase(slot)).findFirst()
                .ifPresent(item -> {
                    bisItemData.setCurrentItemId(item.getItem().getId());
                    bisItemData.setCurrentItemName(item.getName());
                    bisItemData.setIlvl(item.getLevel().getValue());
                    switch (slot) {
                        case "finger_1":
                        case "finger_2":
                            break;
                        case "trinket_1":
                        case "trinket_2":
                            break;
                        case "main_hand":
                        case "off_hand":
                            break;
                        default:
                            break;
                    }
                });
    }
}

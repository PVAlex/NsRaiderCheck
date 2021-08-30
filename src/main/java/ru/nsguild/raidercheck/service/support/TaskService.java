package ru.nsguild.raidercheck.service.support;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ru.nsguild.raidercheck.dao.BisItem;
import ru.nsguild.raidercheck.dao.BisProfile;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.service.api.ApiService;
import ru.nsguild.raidercheck.service.database.BisService;
import ru.nsguild.raidercheck.service.database.ProfileService;
import ru.nsguild.raidercheck.dao.Instance;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Сервис обновления данных о гильдии.
 */
@Service
public class TaskService {

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    @Autowired
    private TaskExecutor taskExecutor;
    @Autowired
    private ApiService apiService;
    @Autowired
    private ProfileService profileService;
    @Autowired
    private BisService bisService;

    @Value("${refreshOnStartup:true}")
    private Boolean refreshOnStartup;

    /**
     * При запуске приложения.
     */
    @PostConstruct
    private void onStartup() {
        if (refreshOnStartup) taskExecutor.execute(this::refreshProfiles);
        if (bisService.getItemsByInstance(Instance.SANCTUM_OF_DOMINATION).isEmpty()) taskExecutor.execute(this::refreshBisItems);
    }

    public void refreshBisItems() {
        final List<BisItem> items = apiService.getBisItems();
        bisService.saveItems(items);
    }

    /**
     * Обновление информации о персонажах.
     */
    @Scheduled(cron = "${cron.refreshGuildInfo:0 30 */2 * * *}")
    public void refreshProfiles() {
        final List<Profile> dbProfiles = profileService.findAllProfiles();
        final List<Profile> apiProfiles = apiService.getProfiles();
        dbProfiles.forEach(profile -> {
            apiProfiles.stream()
                    .filter(p -> p.getName().equalsIgnoreCase(profile.getName()))
                    .findFirst()
                    .ifPresent(p -> {
                        profile.setRank(p.getRank());
                        profile.setRace(p.getRace());
                    });
        });
        apiProfiles.stream()
                .filter(profile -> dbProfiles.stream()
                        .filter(p -> p.getName().equals(profile.getName()))
                        .findFirst().orElse(null) == null)
                .forEach(dbProfiles::add);
        profileService.saveAll(apiService.refreshAll(dbProfiles));
        logger.info("Profiles refresh completed.");

        // Создание профилей для бис листа
        final List<BisProfile> bisProfiles = bisService.findAllProfiles();
        dbProfiles.forEach(profile -> {
                    final BisProfile bisProfile = bisProfiles.stream()
                            .filter(p -> p.getName().equals(profile.getName()))
                            .findFirst()
                            .orElse(new BisProfile());
                    bisProfile.setName(profile.getName());
                    bisProfile.setRank(profile.getRank());
                    bisService.saveProfile(bisProfile);
                });

        // Перепроверка вещей в бислисте
        dbProfiles.forEach(profile -> bisService.checkItems(profile));
    }

    /**
     * Удаление бывших согильдийцев.
     */
    @Scheduled(cron = "${cron.clearNonGuildMembers:0 50 1 * * *}")
    public void clearNonGuildMembers() {
        final List<Profile> profiles = apiService.getProfiles();
        final List<Profile> all = profileService.findAllProfiles();
        if (profiles.isEmpty()) {
            logger.warn("Profiles is empty. Clearing cancelled.");
            return;
        }
        final List<Profile> profilesToDelete = all.stream()
            .filter(profile -> profiles.stream().noneMatch(p -> p.getName().equals(profile.getName())))
            .collect(Collectors.toList());
        if (!profilesToDelete.isEmpty()) {
            profileService.delete(profilesToDelete);
            logger.info(profilesToDelete.stream().map(Profile::getName).collect(Collectors.joining(", ")) + " deleted");
        }
    }
}

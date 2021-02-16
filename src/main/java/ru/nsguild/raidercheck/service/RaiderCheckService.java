package ru.nsguild.raidercheck.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ru.nsguild.raidercheck.dao.Profile;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Сервис обновления данных о гильдии.
 */
@Service
public class RaiderCheckService {

    private static final Logger logger = LoggerFactory.getLogger(RaiderCheckService.class);

    @Autowired
    private TaskExecutor taskExecutor;
    @Autowired
    private ApiService apiService;
    @Autowired
    private ProfileService profileService;

    @Value("${refreshOnStartup:true}")
    private Boolean refreshOnStartup;

    /**
     * При запуске приложения.
     */
    @PostConstruct
    private void onStartup() {
        if (refreshOnStartup) taskExecutor.execute(this::refreshProfiles);
    }

    /**
     * Обновление информации о персонажах.
     */
    @Scheduled(cron = "${cron.refreshGuildInfo:0 30 */2 * * *}")
    public void refreshProfiles() {
        final List<Profile> bdProfiles = profileService.findAllProfiles();
        final List<Profile> apiProfiles = apiService.getProfiles();
        apiProfiles.stream()
                //TODO
                .filter(profile -> bdProfiles.stream()
                        .filter(p -> p.getName().equals(profile.getName()))
                        .findFirst().orElse(null) == null)
                .forEach(bdProfiles::add);
        profileService.saveAll(apiService.getAll(bdProfiles));
        logger.info("Profiles refresh completed.");
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

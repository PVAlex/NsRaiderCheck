package ru.nsguild.raidercheck.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.nsguild.raidercheck.api.rio.Rio;
import ru.nsguild.raidercheck.repository.MemberRepository;
import ru.nsguild.raidercheck.entity.Member;

@Service
public class RaiderIOApiService {

    private static final Logger logger = LoggerFactory.getLogger(RaiderIOApiService.class);

    @Autowired
    private RestTemplate restTemplate;
    @Value("${guild.realm}")
    private String realm;

    public Rio getRioInfo(String name) {
        try {
            final String url = "https://raider.io/api/v1/characters/profile?region=eu"
                    + "&realm=" + realm.replaceAll(" ", "-").toLowerCase()
                    + "&name=" + name
                    + "&fields=mythic_plus_weekly_highest_level_runs,mythic_plus_recent_runs";
            return restTemplate.getForObject(url, Rio.class);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }
}

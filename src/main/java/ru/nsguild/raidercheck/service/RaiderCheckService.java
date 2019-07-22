package ru.nsguild.raidercheck.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ru.nsguild.raidercheck.api.blizzard.Character;
import ru.nsguild.raidercheck.api.blizzard.Spec;
import ru.nsguild.raidercheck.api.blizzard.Talent;
import ru.nsguild.raidercheck.api.rio.Mythic;
import ru.nsguild.raidercheck.api.rio.Rio;
import ru.nsguild.raidercheck.entity.GuildMembership;
import ru.nsguild.raidercheck.entity.Member;
import ru.nsguild.raidercheck.repository.MemberRepository;

/**
 * Сервис получения и обработки данных о гильдии.
 */
@Service
public class RaiderCheckService {

    private static final Logger logger = LoggerFactory.getLogger(RaiderCheckService.class);

    @Autowired
    private BlizzardApiService blizzardApiService;
    @Autowired
    private RaiderIOApiService raiderIOApiService;
    @Autowired
    private MemberRepository memberRepository;

    @Value("${refreshOnStartup:true}")
    private Boolean refreshOnStartup;

    /**
     * При запуске приложения.
     */
    @PostConstruct
    private void onStartup() {
        if (refreshOnStartup) refreshGuildInfo();
    }

    /**
     * Обновление информации о персонажах.
     */
    @Scheduled(cron = "${cron.refreshGuildInfo:0 0 2 * * *}")
    public void refreshGuildInfo() {
        final List<Member> members = blizzardApiService.getMembers();
        members.forEach(member -> {
            try {
                final Character character = blizzardApiService.getGear(member.getCharacter().getName());
                character.setEssences(blizzardApiService.getEssences(character.getName()));
                final Member dbMember = Optional.ofNullable(memberRepository.findByName(character.getName()))
                        .orElse(new Member());
                dbMember.setName(character.getName());
                dbMember.setCharacter(character);
                dbMember.setRank(member.getRank());
                dbMember.setGuildMembership(GuildMembership.GUILD);
                final Spec spec = character.getTalents().stream()
                        .filter(talents -> talents.getSelected() != null ? talents.getSelected() : false)
                        .map(talents -> talents.getTalents().isEmpty() ? null : talents.getTalents().get(0).getSpec())
                        .filter(Objects::nonNull)
                        .findFirst().orElse(null);
                character.setSpec(spec);
                final Rio rio = raiderIOApiService.getRioInfo(member.getCharacter().getName());
                if (rio != null) dbMember.setRio(rio);
                memberRepository.save(dbMember);
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        });
        logger.info("Guild info refresh completed.");
    }

    /**
     * Удаление бывших согильдийцев.
     */
    @Scheduled(cron = "${cron.clearNonGuildMembers:0 50 1 * * *}")
    public void clearNonGuildMembers() {
        final List<String> names = memberRepository.findAll()
                .stream()
                .filter(member -> member.getGuildMembership() != null && member.getGuildMembership().equals(GuildMembership.GUILD))
                .map(Member::getName).collect(Collectors.toList());
        final List<String> nonGuild = blizzardApiService.getMembers()
                .stream()
                .map(Member::getName)
                .filter(s -> !names.contains(s))
                .collect(Collectors.toList());
        if (!nonGuild.isEmpty()) {
            memberRepository.delete(nonGuild);
            logger.info("Non guild members cleared: " + StringUtils.arrayToDelimitedString(nonGuild.toArray(), ","));
        }
    }

    /**
     * Еженедельное обновление информации о пройденных мификах.
     */
    @Scheduled(cron = "0 0 6 * * WED")
    public void weeklyRioUpdate() {
        memberRepository.stream(member -> {
            final List<Mythic> recentRuns = member.getRio().getMythicPlusRecentRuns();
            member.getRio().setLastWeekRun(!recentRuns.isEmpty() ? recentRuns.get(0) : null);
        });
        logger.info("Weekly RIO update completed.");
    }

    /**
     * Обновить информацию о персонаже.
     *
     * @param name имя персонажа
     * @return персонаж
     */
    public Character refreshCharacter(String name) {
        return refreshCharacter(memberRepository.findByName(name)).getCharacter();
    }

    /**
     * Обновить информацию о персонаже.
     *
     * @return список персонажей
     */
    public List<Character> refreshCharacter() {
        memberRepository.stream(member -> {
            try {
                refreshCharacter(member);
            } catch (Exception e) {
                logger.error(member.getName() + ": " + e.getMessage(), e);
            }
        });
        return memberRepository.findAllCharacters();
    }

    /**
     * Обновить информацию о персонаже.
     *
     * @param member персонаж для обновления
     * @return персонаж
     */
    private Member refreshCharacter(Member member) {
        final Character character = blizzardApiService.getGear(member.getName());
        if (character != null) {
            character.setEssences(blizzardApiService.getEssences(member.getName()));
            final Spec spec = character.getTalents().stream()
                    .filter(talents -> talents.getSelected() != null ? talents.getSelected() : false)
                    .map(talents -> talents.getTalents().isEmpty()
                            ? null
                            : talents.getTalents().stream().filter(talent -> talent.getSpec() != null)
                                .findFirst().orElse(new Talent()).getSpec())
                    .filter(Objects::nonNull)
                    .findFirst().orElse(null);
            character.setSpec(spec);
            member.setCharacter(character);
        }
        return memberRepository.save(member);
    }

    /**
     * Обновить информацию о пройденных подземельях.
     *
     * @param name имя персонажа
     * @return
     */
    public Rio refreshRio(String name) {
        final Member member = memberRepository.findByName(name);
        final Rio rio = raiderIOApiService.getRioInfo(name);
        if (rio != null) member.setRio(rio);
        return memberRepository.save(member).getRio();
    }

    /**
     * Обновить всю информацию о пройденных подземельях.
     *
     * @return
     */
    public List<Rio> refreshRio() {
        memberRepository.stream(member -> {
            try {
                final Rio rio = raiderIOApiService.getRioInfo(member.getName());
                if (rio != null) member.setRio(rio);
                memberRepository.save(member);
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        });
        return memberRepository.findAllRio();
    }

    /**
     * Удалить.
     *
     * @param name имя персонажа.
     */
    public void deleteMember(String name) {
        memberRepository.delete(name);
    }
}

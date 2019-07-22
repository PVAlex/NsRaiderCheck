package ru.nsguild.raidercheck.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.nsguild.raidercheck.api.blizzard.Character;
import ru.nsguild.raidercheck.api.rio.Rio;
import ru.nsguild.raidercheck.entity.Member;
import ru.nsguild.raidercheck.repository.MemberRepository;
import ru.nsguild.raidercheck.service.RaiderCheckService;

@RestController
@RequestMapping("rest")
public class RaiderCheckRestController {

    private static final Logger logger = LoggerFactory.getLogger(RaiderCheckRestController.class);

    @Autowired
    private MemberRepository repository;
    @Autowired
    private RaiderCheckService raiderCheckService;

    @GetMapping(value = "/members", produces = "application/json")
    public List<Member> getMembers(@RequestParam Map<String, String> params) {
        return params.isEmpty() ? repository.findAllMembers() : repository.findMembers(params);
    }

    @GetMapping(value = "/characters", produces = "application/json")
    public List<Character> getCharacters(@RequestParam Map<String, String> params) {
        return params.isEmpty() ? repository.findAllCharacters() : repository.findCharacters(params);
    }

    @GetMapping(value = "/rio", produces = "application/json")
    public List<Rio> getRioByRank(@RequestParam Map<String, String> params) {
        return params.isEmpty() ? repository.findAllRio() : repository.findRio(params);
    }

    @PutMapping(value = "/refresh/characters/{name}", produces = "application/json")
    public List<Character> refreshCharacter(@PathVariable String name) {
        return Collections.singletonList(raiderCheckService.refreshCharacter(name));
    }

    @PutMapping(value = "/refresh/characters", produces = "application/json")
    public List<Character> refreshCharacter() {
        return raiderCheckService.refreshCharacter();
    }

    @PutMapping(value = "/refresh/rio/{name}", produces = "application/json")
    public List<Rio> refreshRio(@PathVariable String name) {
        return Collections.singletonList(raiderCheckService.refreshRio(name));
    }

    @PutMapping(value = "/refresh/rio", produces = "application/json")
    public List<Rio> refreshRio() {
        return raiderCheckService.refreshRio();
    }

    @PutMapping(value = "/refresh", produces = "application/json")
    public boolean refreshAll() {
        try {
            raiderCheckService.refreshGuildInfo();
            return true;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return false;
        }
    }

    @DeleteMapping(value = "/delete/{name}")
    public void deleteMember(@PathVariable String name) {
        raiderCheckService.deleteMember(name);
    }
}

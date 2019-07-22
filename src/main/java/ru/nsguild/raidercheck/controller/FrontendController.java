package ru.nsguild.raidercheck.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    @Value("${guild.name:}")
    private String guildName;
    @Value("#{${guild.ranks}}")
    private Map<String, String> ranks;

    @RequestMapping(value = "/*", produces = MediaType.TEXT_HTML_VALUE)
    public String mainPage(Model model) {
        model.addAttribute("guildName", guildName);
        model.addAttribute("guildRanks", ranks);
        return "index";
    }
}

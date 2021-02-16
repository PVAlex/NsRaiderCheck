package ru.nsguild.raidercheck.controller;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;

@Controller
public class FrontendController {

    @RequestMapping(value = "/app/**", produces = MediaType.TEXT_HTML_VALUE)
    public String mainPage(Model model) {
        return "index";
    }


    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView redirect(ModelMap model) {
        return new ModelAndView("redirect:/app", model);
    }

    /**
     * В любой непонятной ситуации редирект на индексный файл.
     *
     * @return /index.html
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ModelAndView handleNotFound() {
        return new ModelAndView("index");
    }
}

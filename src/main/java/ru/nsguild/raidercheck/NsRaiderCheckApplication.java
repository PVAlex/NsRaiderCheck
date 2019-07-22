package ru.nsguild.raidercheck;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"ru.nsguild.raidercheck"})
public class NsRaiderCheckApplication {

    public static void main(String[] args) {
        SpringApplication.run(NsRaiderCheckApplication.class, args);
    }
}

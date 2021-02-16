package ru.nsguild.raidercheck;

import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

/**
 * Конфигурация приложения.
 */
@Configuration
@EnableScheduling
public class SpringConfig {

    private static final Logger logger = LoggerFactory.getLogger(SpringConfig.class);

    private InetAddress getAddress() throws UnknownHostException {
        return InetAddress.getLocalHost();
    }

    @Bean
    public PropertySourcesPlaceholderConfigurer properties() {
        final PropertySourcesPlaceholderConfigurer propertySources = new PropertySourcesPlaceholderConfigurer();
        final List<Properties> properties = new ArrayList<>();
        try {
            properties.add(PropertiesLoaderUtils.loadProperties(
                    new EncodedResource(new ClassPathResource("default.properties"), "UTF-8")));
        } catch (Exception e) {
            logger.error("default.properties not found: " + e.getMessage());
        }
        try {
            final String propsName = getAddress().getHostName() + ".properties";
            properties.add(PropertiesLoaderUtils.loadProperties(
                    new EncodedResource(new ClassPathResource(propsName), "UTF-8")));
            logger.info("Using " + propsName);
        } catch (Exception e) {
            logger.info("Using default.properties");
        }
        propertySources.setPropertiesArray(properties.toArray(new Properties[0]));
        propertySources.setIgnoreUnresolvablePlaceholders(true);
        return propertySources;
    }

    @Bean
    public HttpComponentsClientHttpRequestFactory httpComponentsClientHttpRequestFactory() {
        return new HttpComponentsClientHttpRequestFactory(HttpClientBuilder.create()
                .disableAuthCaching()
                .disableCookieManagement()
                .build());
    }

    @Bean
    public RestTemplate restTemplate(HttpComponentsClientHttpRequestFactory httpComponentsClientHttpRequestFactory) {
        return new RestTemplate(httpComponentsClientHttpRequestFactory);
    }
}

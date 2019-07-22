package ru.nsguild.raidercheck.support;

import java.io.IOException;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import jdk.nashorn.api.scripting.NashornScriptEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class React {

    private static final Logger logger = LoggerFactory.getLogger(React.class);

    @Value("classpath:static/generated/app-bundle.js")
    private Resource jsFile;

    @Cacheable("ssr")
    public String render() throws IOException, ScriptException {
        final NashornScriptEngine scriptEngine = getScriptEngine();
        try {
            final Object render = scriptEngine.invokeFunction("renderServer");
            return render.toString();
        } catch (NoSuchMethodException e) {
            throw new IllegalStateException("Rendering failed: " + e.getMessage(), e);
        }
    }

    @CacheEvict("ssr")
    public void clearCache() {
        logger.info("Page cache cleared.");
    }

    private NashornScriptEngine getScriptEngine() throws IOException, ScriptException {
        final NashornScriptEngine engine =
                (NashornScriptEngine) new ScriptEngineManager().getEngineByName("nashorn");
        //TODO path??
        engine.eval("load('" + jsFile.getURL() + "')");
        return engine;
    }
}

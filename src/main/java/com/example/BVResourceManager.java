package com.example;

import com.google.gson.Gson;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Created by OmotolaBabasola1 on 22/02/2017.
 */
public class BVResourceManager {

    Gson g = new Gson();

    public BVResourceManager(String file) {
        initConfig(file);

    }

    private void initConfig(String configFileName) {
        try {
            String content = new String(Files.readAllBytes(Paths.get(configFileName)));
            Election election = g.fromJson(content, Election.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

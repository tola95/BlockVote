package com.example;

import com.google.gson.Gson;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Created by OmotolaBabasola1 on 22/02/2017.
 */
public class BVResourceManager {

    private Gson g = new Gson();
    private Election election;

    public BVResourceManager(String file) {
        initConfig(file);
    }

    private void initConfig(String configFileName) {
        try {
            String content = new String(Files.readAllBytes(Paths.get(configFileName)));
            election = g.fromJson(content, Election.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Election getElection() {
        return election;
    }
}

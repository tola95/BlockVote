package com.example;

/**
 * Created by OmotolaBabasola1 on 22/02/2017.
 */
public class Candidate {

    private String name;
    private String id;

    private Candidate(String name, String id) {
        this.name = name;
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}

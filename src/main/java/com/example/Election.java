package com.example;

import java.util.List;

/**
 * Created by OmotolaBabasola1 on 22/02/2017.
 */
public class Election {

    private String name;
    private List<Candidate> candidates;

    public Election(String name) {
        this.name = name;
    }

    public List<Candidate> getCandidates() {
        return candidates;
    }

    public void setCandidates(List<Candidate> candidates) {
        this.candidates = candidates;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

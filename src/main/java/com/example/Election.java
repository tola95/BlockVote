package com.example;

import java.util.*;

/**
 * Created by OmotolaBabasola1 on 22/02/2017.
 */
public class Election {

    private String name;
    private List<Candidate> candidates;
    private List<Voter> voters;
    private Map<String, Integer> voterKeys;
    private Random random;

    public Election(String name) {
        //this.name = name;
        //this.voters = new LinkedList<>();
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

    public int generateRandomKey(String id) {
        if (random == null) {
            random = new Random();
        }
        int key = -1;
        if (voterKeys == null) {
            voterKeys = new HashMap<>();
        }
        if (!voterKeys.containsKey(id)) {
            key = random.nextInt();
            while (key < 0) {
                key = random.nextInt();
            }
            voterKeys.put(id, key);
        } else {
            key = voterKeys.get(id);
        }
        return key;
    }
}

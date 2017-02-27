package com.example;

/**
 * Created by OmotolaBabasola1 on 26/02/2017.
 */
public class Voter {

    private String name;
    private String id;
    private String publicAddress;

    private Voter(String name, String id, String publicAddress) {
        this.name = name;
        this.id = id;
        this.publicAddress = publicAddress;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPublicAddress() {
        return publicAddress;
    }

    public void setPublicAddress(String publicAddress) {
        this.publicAddress = publicAddress;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}

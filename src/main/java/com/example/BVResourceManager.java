package com.example;

import com.google.gson.Gson;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.crypto.CipherException;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.WalletUtils;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.request.RawTransaction;
import org.web3j.protocol.core.methods.response.Web3ClientVersion;
import org.web3j.protocol.http.HttpService;

import java.io.IOException;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.ExecutionException;

/**
 * Created by OmotolaBabasola1 on 22/02/2017.
 */
public class BVResourceManager {

    private Gson g = new Gson();
    private Election election;

    public BVResourceManager(String file) {
        initConfig(file);
        interfaceWithBC();
    }

    private void initConfig(String configFileName) {
        try {
            String content = new String(Files.readAllBytes(Paths.get(configFileName)));
            election = g.fromJson(content, Election.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void initBlockChain() {
        ProcessBuilder processBuilder = new ProcessBuilder("geth --dev --mine --minerthreads 1 --unlock 0 --password \"ps\"");
        Process initBC = null;
        try {
            initBC = processBuilder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (initBC != null && initBC.isAlive()) {
            ProcessBuilder processBuilder1 = new ProcessBuilder("geth attach ipc:/var/folders/s_/sc8s9f7j00z15tg80r7n3k900000gp/T/ethereum_dev_mode/geth.ipc");
            Process initConsole = null;
            try {
                initConsole = processBuilder1.start();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void interfaceWithBC() {
        Web3j web3 = Web3j.build(new HttpService(/*"http://146.169.47.73:8545/"*/));
        Credentials credentials = null;
        try {
            credentials = WalletUtils.loadCredentials("", "/Users/OmotolaBabasola1/BlockVoteBlockChain/keystore/UTC--2017-04-04T16-26-05.481773384Z--1ba5dfa4223d4ac913bd5ed8e9ee770e26133a1f"
                            /*"/root/.ethereum/testnet/keystore/UTC--2017-03-31T21-37-12.294000000Z--988c58e40cd39c632949db85ff9c7c8f1a7e9360.json"*/);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (CipherException e) {
            e.printStackTrace();
        }

        Web3ClientVersion web3ClientVersion = null;
        try {
            web3ClientVersion = web3.web3ClientVersion().sendAsync().get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }

    public Election getElection() {
        return election;
    }

    public boolean addVoteToBlockchain(String id, String candidate) {

        return false;
    }
}

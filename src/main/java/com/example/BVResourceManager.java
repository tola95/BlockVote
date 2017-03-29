package com.example;

import com.google.gson.Gson;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.crypto.CipherException;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.WalletUtils;
import org.web3j.protocol.Web3j;
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
        Web3j web3 = Web3j.build(new HttpService());
        Credentials credentials = null;
        try {
            credentials = WalletUtils.loadCredentials("Karmakazee1", "/Users/OmotolaBabasola1/Library/Ethereum/testnet/keystore/UTC--2017-02-03T22-25-59.698779390Z--360b1868e121ea8a15dce6319733deea48435657");
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

        String clientVersion = web3ClientVersion.getWeb3ClientVersion();
        Greeter contract = null;
        try {
            contract = Greeter.deploy(web3, credentials,
                    BigInteger.ZERO, BigInteger.ZERO, BigInteger.ZERO,
                    new Utf8String("Hello Blockchain World")).get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        Utf8String greeting = null;
        try {
            greeting = contract.greet().get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        String greetingString = greeting.getTypeAsString();
    }

    public Election getElection() {
        return election;
    }

    public boolean addVoteToBlockchain(String id, String candidate) {

        return false;
    }
}

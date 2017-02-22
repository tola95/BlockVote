package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BlockVoteApplication {

	private BVResourceManager resourceManager = new BVResourceManager("BVConfigs");

	public static void main(String[] args) {
		SpringApplication.run(BlockVoteApplication.class, args);
	}
}

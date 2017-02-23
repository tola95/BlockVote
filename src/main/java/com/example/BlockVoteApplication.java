package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@SpringBootApplication
@RestController
public class BlockVoteApplication {

	private BVResourceManager resourceManager = new BVResourceManager("BVConfigs");

	@RequestMapping("/candidates")
	public List<Candidate> candidates() {
		return resourceManager.getElection().getCandidates();
	}

	public static void main(String[] args) {
		SpringApplication.run(BlockVoteApplication.class, args);
	}
}

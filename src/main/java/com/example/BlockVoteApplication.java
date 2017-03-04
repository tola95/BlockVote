package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.bind.annotation.PathVariable;
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

	@RequestMapping("/register/{id}")
	public Integer privateKey(@PathVariable("id") String id) {
		if (id == null) {
			return -1;
		}
		return resourceManager.getElection().generateRandomKey(id);
	}

	@RequestMapping("/vote/{privateKey}/{votedCandidate}")
	public void vote(@PathVariable("privateKey") String privateKey,
					 @PathVariable("votedCandidate") String votedCandidate) {

	}

	//ToDo: Billboard of public keys for election
	@Configuration
	@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
	protected static class SecurityConfiguration extends WebSecurityConfigurerAdapter {
		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http
					.authorizeRequests()
					.anyRequest().permitAll();
		}
	}

	public static void main(String[] args) {
		SpringApplication.run(BlockVoteApplication.class, args);
	}
}

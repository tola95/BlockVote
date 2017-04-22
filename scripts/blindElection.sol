pragma solidity ^0.4.9;

contract mortal {
    /* Define variable owner of the type address*/
    address owner;

    /* this function is executed at initialization and sets the owner of the contract */
    function mortal() { owner = msg.sender; }

    /* Function to recover the funds on the contract */
    function kill() { if (msg.sender == owner) selfdestruct(owner); }
}

contract blindElection is mortal {

    struct Voter {
        bool eligible; //determines if party is eligible to vote
        bool voted;
        uint vote; //index of candidate voted for
    }

    struct Candiate {
        bytes32 name; //Candidate Name
        uint votes; //Number of candidate votes
    }

    // Important Entities

    address public chairPerson; //Party in charge if administering the election

    mapping(address => Voter) public voters; //Mapping of voters addresses to objects

    Candidate[] public candidates; //List of candidate objects

    function blindElection(bytes32[] candidateNames) {
        chairPerson = msg.sender;
        voters[chairPerson].eligible = true;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                name: candidateNames[i],
                votes: 0
            }));
        }
    }

    function giveRightToVote(address voter) {
        if (msg.sender != chairPerson || voters[voter].voted) {
            throw;
        }
        voters[voter].eligible = true;
    }

    function vote(uint candidateIndex) {
        Voter sender = voters[msg.sender];
        if (sender.voted || sender.eligible != true) {
            throw;
        }
        sender.voted = true;
        sender.vote = candidateIndex;
        candidates[candidateIndex].votes += 1;
    }

    function countVotes() constant
            returns (uint winningCandidate) {
        uint winningVoteCount = 0;
        for (uint i = 0; i < candiates.length; i++) {
            if (candidates[i].votes > winningVoteCount) {
                winningVoteCount = candidates[i].votes;
                winningCandidate = i;
            }
        }
    }

    function winnerName() constant
            returns (bytes32 winnerName) {
        winnerName = candidates[countVotes()].name;
    }

}
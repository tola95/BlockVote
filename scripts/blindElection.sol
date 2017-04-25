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
        bool eligible;
        bool voted;
        uint vote;
        bytes32 blindedVote;
    }

    struct Candidate {
        bytes32 name;
        uint votes;
    }

    /* Important Entities */
    address public chairPerson; /*Party in charge if administering the election*/
    mapping(address => Voter) public voters; /*Mapping of voters addresses to objects*/
    Candidate[] public candidates; /*List of candidate objects*/

    /*Time Considerations*/
    uint public electionStart; /*Time the election started*/
    uint public electionEnd; /*How long the election will last*/
    bool electionEnded; /*set to true at the end of the election*/

    /*Events to be fired on changes, for logging purposes
    event Voted(address voter, uint candidate);
    event ElectionEnded(address winner, uint amount);*/

    /*Modifiers for validating time constrained inputs
    modifier onlyBefore(uint _time) { if (now >= _time) throw; _; }
    modifier onlyAfter(uint _time) { if (now <= _time) throw; _; }*/

    function blindElection(bytes32[] candidateNames, uint electionDuration) {
        chairPerson = msg.sender;
        voters[chairPerson].eligible = true;
        electionStart = now;
        electionEnd = electionStart + electionDuration;
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

    function blindVote(bytes32 _blindedVote) {
        Voter sender = voters[msg.sender];
        if (sender.voted || sender.eligible != true || electionEnded
        ) {
            throw;
        }
        sender.voted = true;
        sender.blindedVote = _blindedVote;

    }

    function revealVote(uint candidateIndex, uint secret) {
        Voter sender = voters[msg.sender];
        if (sender.blindedVote != keccak256(candidateIndex, secret)) {
            throw;
        }
        sender.vote = candidateIndex;
        candidates[candidateIndex].votes += 1;
        /*Voted(msg.sender, candidateIndex);*/
    }

    /*Moot atm*/
    function vote(uint candidateIndex)
    payable
    /*onlyBefore(electionEnd)*/
    {
        Voter sender = voters[msg.sender];
        if (sender.voted || sender.eligible != true ) {
            throw;
        }
        sender.voted = true;
        sender.vote = candidateIndex;
        candidates[candidateIndex].votes += 1;
        /*Voted(msg.sender, candidateIndex);*/
    }

    function countVotes() constant
    returns (uint winningCandidate)
    /*onlyAfter(electionEnd)*/
    {
        uint winningVoteCount = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].votes > winningVoteCount) {
                winningVoteCount = candidates[i].votes;
                winningCandidate = i;
            }
        }
        electionEnded = true;
        /*ElectionEnded(address winner, uint amount);*/
    }

    function winnerName() constant
            returns (bytes32 winnerName) {
        winnerName = candidates[countVotes()].name;
    }

}
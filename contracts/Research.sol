pragma solidity ^0.5.0;


contract Research {
    
    struct Paper {
        uint id;
        address payable owner;
        string authors;
        string paperTitle;
        string paperAbstract;
        string paperURL;
        uint goal;
        uint totalContribution;
    }
    
    uint public totalPapers;
    
    mapping(uint => Paper) public paperMapping;
    
    mapping(address => uint) public balanceMapping;
    
    function addPaper(string memory _authors, string memory _paperTitle, string memory _abstract, string memory _paperURL, uint _goal) public {
        Paper storage p = paperMapping[totalPapers];
        p.id = totalPapers;
        p.owner = msg.sender;
        p.authors = _authors;
        p.paperTitle = _paperTitle;
        p.paperAbstract = _abstract;
        p.paperURL = _paperURL;
        p.goal = _goal;
        totalPapers += 1;
    }
    
    function fundPaper(uint _id) public payable {
        require(msg.value > 0);
        require(_id < totalPapers);
        Paper storage p = paperMapping[_id];
        p.totalContribution += msg.value;
        balanceMapping[p.owner] += msg.value;
    }
    
    function withdraw() public {
        require(balanceMapping[msg.sender] > 0);
        uint val = balanceMapping[msg.sender];
        balanceMapping[msg.sender] = 0;
        address(msg.sender).transfer(val);
    }
    
    function contractBalance() public view returns(uint) {
        return address(this).balance;
    }
    
}

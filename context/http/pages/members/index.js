module.exports = function(config) {
  return {
    "* *": [
      this.version, 
      this.whoisatvarnalab,
      this.randomMember,
      this.getFoursquareMayor
    ],
    "GET": [
      this.getAllMembers,
      function(req, res) {
        res.sendPage();
      }
    ],
    "GET /:member": [
      this.getMemberByName("member"),
      function(req, res) {
        res.sendPage("members/index");
      }
    ]
  }
}
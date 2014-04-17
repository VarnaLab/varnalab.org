module.exports = function(config, plasma) {
  return {
    "* *": [
      this.version, 
      this.whoisatvarnalab(plasma),
      this.randomMember,
      this.getFoursquareMayor
    ],
    "GET": [
      this.getAllMembers,
      function(req, res) {
        res.sendPage("members/index");
      }
    ],
    "GET /:member": [
      this.getMemberByName("member"),
      function(req, res) {
        res.sendPage("members/member");
      }
    ]
  }
}
module.exports = function(plasma, dna, helpers) {
  return {
    "* *": [
      helpers.version, 
      helpers.whoisatvarnalab(plasma),
      helpers.randomMember,
      helpers.getFoursquareMayor(plasma)
    ],
    "GET": [
      helpers.getAllMembers,
      function(req, res) {
        res.sendPage("members/index");
      }
    ],
    "GET /:member": [
      helpers.getMemberByName("member"),
      function(req, res) {
        res.sendPage("members/member");
      }
    ]
  }
}
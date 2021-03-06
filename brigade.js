  const { events, Job, Group } = require("@brigadecore/brigadier")
  // const request = require('request');

  var image_name = "cloudshell-homebrew"
  var docker_registry ="docker.io/dmazhukov"
  var full_image_name = docker_registry + "/" + image_name

  events.on("exec", (e, p) => {
    // extract parameters
    var payload = JSON.parse(e.payload)
    console.log(payload)
    // var user = payload.actor.display_name
    // var branch = payload.push.changes[0].new.name
    // var commit_message = payload.push.changes[0].new.target.message
    // var tag = payload.push.changes[0].new.target.hash.substring(0, 7);
    var tag = payload.after
    commit_link = payload.head_commit.url
    var full_image_name_with_tag= full_image_name + ":" + tag
    console.log(full_image_name_with_tag)

    // build docker images
    var one = new Job("kaniko"+"-"+image_name, "gcr.io/kaniko-project/executor:latest")

    one.mountPath="/kaniko/buildcontext"
    one.args=[
      "--dockerfile=/kaniko/buildcontext/Dockerfile",
      "--context=/kaniko/buildcontext",
      `--destination=${full_image_name_with_tag}`,
      "--no-push",
      "--cache=true",
      "--cache-repo=${full_image_name}"
    ]
    Group.runEach([one])
  })

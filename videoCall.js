let handlefail = function(err){
    console.log(err)
}

let remoteContainer = document.getElementById("remoteStream");

function addVideoStream(streamId){
    console.log()
    let streamDiv = document.createElement("div")
    streamDiv.id = streamId
    // streamDiv.style.transform = "rotateY(180deg)"
    streamDiv.style.height = "120px"
    streamDiv.style.width = "180px"
    streamDiv.style.display = "inline-block"
    streamDiv.style.border = "2px solid #099dfd"
    streamDiv.style.marginInlineEnd = "5px"
    remoteContainer.appendChild(streamDiv)
} 

function startCall() {
    let channelName = document.getElementById("channelName").value;
    let username = document.getElementById("username").value;
    let appId = "7cedb07549934ba2a58ee5501d5811d6";

    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })

    client.init(appId,() => console.log("AgoraRTC Client Connected"), handlefail)

    client.join(
        null,
        channelName,
        username,
        () => {
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function(){
                localStream.play("selfStream")
                client.publish(localStream)
            })
        }
    )

    client.on("stream-added", function (evt){
        console.log("Added Stream");
        client.subscribe(evt.stream,handlefail)
    })

    client.on("stream-subscribed", function(evt){
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId());  
        stream.play(stream.getId());
    })

}
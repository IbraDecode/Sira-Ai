import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';

// Di Buat Oleh Ibra Decode

class CallScreen extends StatefulWidget {
  @override
  _CallScreenState createState() => _CallScreenState();
}

class _CallScreenState extends State<CallScreen> {
  RTCPeerConnection? _peerConnection;
  RTCVideoRenderer _localRenderer = RTCVideoRenderer();
  RTCVideoRenderer _remoteRenderer = RTCVideoRenderer();

  @override
  void initState() {
    super.initState();
    _localRenderer.initialize();
    _remoteRenderer.initialize();
    _createPeerConnection();
  }

  void _createPeerConnection() async {
    _peerConnection = await createPeerConnection({
      'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]
    });
    _peerConnection!.addTransceiver(kind: RTCRtpMediaType.RTCRtpMediaTypeVideo);
    _peerConnection!.addTransceiver(kind: RTCRtpMediaType.RTCRtpMediaTypeAudio);
    _localRenderer.srcObject = await navigator.mediaDevices.getUserMedia({'video': true, 'audio': true});
    _peerConnection!.addStream(_localRenderer.srcObject!);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Call')),
      body: Column(
        children: [
          Expanded(child: RTCVideoView(_remoteRenderer)),
          Expanded(child: RTCVideoView(_localRenderer)),
          ElevatedButton(onPressed: () => _peerConnection?.close(), child: Text('End Call')),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _localRenderer.dispose();
    _remoteRenderer.dispose();
    _peerConnection?.dispose();
    super.dispose();
  }
}
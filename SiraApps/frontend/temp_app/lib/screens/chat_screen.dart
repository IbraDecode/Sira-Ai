import 'package:flutter/material.dart';
import '../widgets/emoji_picker.dart';
import '../services/socket_service.dart';
import '../services/encryption_service.dart';

// Di Buat Oleh Ibra Decode

class ChatScreen extends StatefulWidget {
  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _messageController = TextEditingController();
  final _searchController = TextEditingController();
  List<Map<String, dynamic>> messages = [];
  List<Map<String, dynamic>> filteredMessages = [];
  late SocketService socketService;
  bool _isSearching = false;

  @override
  void initState() {
    super.initState();
    socketService = SocketService();
    socketService.connect();
    socketService.socket.on('newMessage', (data) {
      String decrypted = EncryptionService.decryptMessage(data);
      setState(() {
        messages.add({'text': decrypted, 'reactions': []});
        filteredMessages = messages;
      });
    });
    filteredMessages = messages;
  }

  void _sendMessage() {
    String encrypted = EncryptionService.encryptMessage(_messageController.text);
    socketService.sendMessage(encrypted);
    setState(() {
      messages.add({'text': _messageController.text, 'reactions': []});
      _messageController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _isSearching ? TextField(controller: _searchController, onChanged: _filterMessages, decoration: InputDecoration(hintText: 'Search messages')) : Text('Chat'),
        actions: [
          IconButton(icon: Icon(_isSearching ? Icons.close : Icons.search), onPressed: () => setState(() => _isSearching = !_isSearching)),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: filteredMessages.length,
              itemBuilder: (context, index) => AnimatedOpacity(
                opacity: 1.0,
                duration: Duration(milliseconds: 500),
                child: GestureDetector(
                  onLongPress: () => _addReaction(messages.indexOf(filteredMessages[index])),
                  child: Container(
                    margin: EdgeInsets.symmetric(vertical: 4, horizontal: 8),
                    decoration: BoxDecoration(
                      color: Colors.blue[50],
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
                    ),
                    child: ListTile(
                      title: Text(filteredMessages[index]['text']),
                      subtitle: filteredMessages[index]['reactions'].isNotEmpty ? Text(filteredMessages[index]['reactions'].join(' ')) : null,
                    ),
                  ),
                ),
              ),
            ),
          ),
            Row(
              children: [
                Expanded(
                  child: TextField(controller: _messageController, decoration: InputDecoration(hintText: 'Type message')),
                ),
                IconButton(icon: Icon(Icons.mic), onPressed: _recordVoice),
                IconButton(icon: Icon(Icons.emoji_emotions), onPressed: () => _showEmojiPicker()),
                IconButton(icon: Icon(Icons.send), onPressed: _sendMessage),
              ],
            ),
        ],
      ),
    );
  }

  void _showEmojiPicker() {
    showModalBottomSheet(
      context: context,
      builder: (context) => EmojiPicker(onEmojiSelected: (emoji) {
        _messageController.text += emoji;
        Navigator.pop(context);
      }),
    );
  }

  void _addReaction(int index) {
    showModalBottomSheet(
      context: context,
      builder: (context) => EmojiPicker(onEmojiSelected: (emoji) {
        setState(() {
          messages[index]['reactions'].add(emoji);
        });
        Navigator.pop(context);
      }),
    );
  }

  void _recordVoice() async {
    // Voice recording disabled for now
    // TODO: Implement voice recording
  }

  void _filterMessages(String query) {
    setState(() {
      filteredMessages = messages.where((msg) => msg['text'].toLowerCase().contains(query.toLowerCase())).toList();
    });
  }
}
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

// Di Buat Oleh Ibra Decode

class StatusScreen extends StatefulWidget {
  @override
  _StatusScreenState createState() => _StatusScreenState();
}

class _StatusScreenState extends State<StatusScreen> {
  List statuses = [];

  @override
  void initState() {
    super.initState();
    _fetchStatuses();
  }

  Future<void> _fetchStatuses() async {
    final response = await http.get(Uri.parse('http://localhost:3000/status'), headers: {'Authorization': 'Bearer token'});
    if (response.statusCode == 200) {
      setState(() => statuses = jsonDecode(response.body));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Status')),
      body: ListView.builder(
        itemCount: statuses.length,
        itemBuilder: (context, index) => ListTile(
          title: Text(statuses[index]['content'] ?? 'Status'),
          subtitle: Text(statuses[index]['user']['name']),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _postStatus(),
        child: Icon(Icons.add),
      ),
    );
  }

  void _postStatus() {
    // Dialog to post status
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Post Status'),
        content: TextField(decoration: InputDecoration(labelText: 'Status Text')),
        actions: [TextButton(onPressed: () => Navigator.pop(context), child: Text('Post'))],
      ),
    );
  }
}
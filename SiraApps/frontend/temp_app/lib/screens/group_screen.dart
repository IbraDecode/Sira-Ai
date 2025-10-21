import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

// Di Buat Oleh Ibra Decode

class GroupScreen extends StatefulWidget {
  @override
  _GroupScreenState createState() => _GroupScreenState();
}

class _GroupScreenState extends State<GroupScreen> {
  List groups = [];

  @override
  void initState() {
    super.initState();
    _fetchGroups();
  }

  Future<void> _fetchGroups() async {
    final response = await http.get(Uri.parse('http://localhost:3000/group'), headers: {'Authorization': 'Bearer token'}); // Ganti token
    if (response.statusCode == 200) {
      setState(() => groups = jsonDecode(response.body));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Groups')),
      body: ListView.builder(
        itemCount: groups.length,
        itemBuilder: (context, index) => ListTile(
          title: Text(groups[index]['name']),
          onTap: () => Navigator.pushNamed(context, '/chat'), // To group chat
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _createGroup(),
        child: Icon(Icons.add),
      ),
    );
  }

  void _createGroup() {
    // Dialog to create group
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Create Group'),
        content: TextField(decoration: InputDecoration(labelText: 'Group Name')),
        actions: [TextButton(onPressed: () => Navigator.pop(context), child: Text('Create'))],
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';

// Di Buat Oleh Ibra Decode

class SettingsScreen extends StatefulWidget {
  @override
  _SettingsScreenState createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _darkMode = false;
  String _name = 'User Name';
  String _bio = 'Bio here';

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    return Scaffold(
      appBar: AppBar(title: Text('Settings')),
      body: ListView(
        children: [
          ListTile(
            title: Text('Dark Mode'),
            trailing: Switch(value: themeProvider.isDarkMode, onChanged: (value) => themeProvider.toggleTheme()),
          ),
          ListTile(
            title: Text('Name'),
            subtitle: Text(_name),
            onTap: () => _editField('Name', _name, (val) => setState(() => _name = val)),
          ),
          ListTile(
            title: Text('Bio'),
            subtitle: Text(_bio),
            onTap: () => _editField('Bio', _bio, (val) => setState(() => _bio = val)),
          ),
        ],
      ),
    );
  }

  void _editField(String title, String current, Function(String) onSave) {
    TextEditingController controller = TextEditingController(text: current);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Edit $title'),
        content: TextField(controller: controller),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')),
          TextButton(onPressed: () { onSave(controller.text); Navigator.pop(context); }, child: Text('Save')),
        ],
      ),
    );
  }
}
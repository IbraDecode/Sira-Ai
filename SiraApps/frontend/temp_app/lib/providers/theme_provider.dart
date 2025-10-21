import 'package:flutter/material.dart';

// Di Buat Oleh Ibra Decode

class ThemeProvider with ChangeNotifier {
  bool _isDarkMode = false;

  bool get isDarkMode => _isDarkMode;

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
  }

  ThemeData get themeData => _isDarkMode ? ThemeData.dark() : ThemeData.light();
}
import 'package:flutter/material.dart';

// Di Buat Oleh Ibra Decode

class EmojiPicker extends StatelessWidget {
  final Function(String) onEmojiSelected;

  const EmojiPicker({required this.onEmojiSelected});

  @override
  Widget build(BuildContext context) {
    // Contoh kategori emoji iOS lengkap
    final List<String> emojis = [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', // Smileys
      '👍', '👎', '👌', '✌️', '🤞', '👏', '🙌', '🤝', '🙏', '💪', // People
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', // Animals
      '🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🌿', '🍀', '🌳', '🌲', // Nature
      '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', // Food
      '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', // Drink
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🪀', // Activities
      '✈️', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', // Travel
      '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', // Places
      '⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', // Objects
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', // Symbols
      '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇺', '🇧🇷' // Flags
    ];

    return Container(
      height: 250,
      child: GridView.builder(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 8),
        itemCount: emojis.length,
        itemBuilder: (context, index) {
          return GestureDetector(
            onTap: () => onEmojiSelected(emojis[index]),
            child: Container(
              margin: EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: Text(emojis[index], style: TextStyle(fontSize: 24)),
              ),
            ),
          );
        },
      ),
    );
  }
}
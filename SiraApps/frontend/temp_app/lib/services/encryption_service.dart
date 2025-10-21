import 'package:encrypt/encrypt.dart' as encrypt;

// Di Buat Oleh Ibra Decode

class EncryptionService {
  static final _key = encrypt.Key.fromUtf8('my32lengthsupersecretnooneknows1'); // Ganti dengan key aman
  static final _iv = encrypt.IV.fromLength(16);

  static String encryptMessage(String message) {
    final encrypter = encrypt.Encrypter(encrypt.AES(_key));
    final encrypted = encrypter.encrypt(message, iv: _iv);
    return encrypted.base64;
  }

  static String decryptMessage(String encryptedMessage) {
    final encrypter = encrypt.Encrypter(encrypt.AES(_key));
    final decrypted = encrypter.decrypt64(encryptedMessage, iv: _iv);
    return decrypted;
  }
}
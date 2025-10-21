import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

// Di Buat Oleh Ibra Decode

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  String? _verificationId;
  bool _otpSent = false;

  Future<void> _sendOTP() async {
    await FirebaseAuth.instance.verifyPhoneNumber(
      phoneNumber: '+62' + _phoneController.text, // Ganti kode negara
      verificationCompleted: (PhoneAuthCredential credential) async {
        await FirebaseAuth.instance.signInWithCredential(credential);
        Navigator.pushReplacementNamed(context, '/home');
      },
      verificationFailed: (FirebaseAuthException e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('OTP failed: ${e.message}')));
      },
      codeSent: (String verificationId, int? resendToken) {
        setState(() {
          _verificationId = verificationId;
          _otpSent = true;
        });
      },
      codeAutoRetrievalTimeout: (String verificationId) {},
    );
  }

  Future<void> _verifyOTP() async {
    PhoneAuthCredential credential = PhoneAuthProvider.credential(
      verificationId: _verificationId!,
      smsCode: _otpController.text,
    );
    await FirebaseAuth.instance.signInWithCredential(credential);
    Navigator.pushReplacementNamed(context, '/home');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login SiraApps')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            if (!_otpSent) ...[
              TextField(controller: _phoneController, decoration: InputDecoration(labelText: 'Phone Number (without +62)')),
              ElevatedButton(onPressed: _sendOTP, child: Text('Send OTP')),
            ] else ...[
              TextField(controller: _otpController, decoration: InputDecoration(labelText: 'OTP')),
              ElevatedButton(onPressed: _verifyOTP, child: Text('Verify OTP')),
            ],
          ],
        ),
      ),
    );
  }
}
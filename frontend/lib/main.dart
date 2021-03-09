import 'package:flutter/material.dart';
import 'package:english_words/english_words.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final wordPair = WordPair.random();
    return MaterialApp(
      title: 'Welcome to Flutter',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Welcome to Flutter'),
        ),
        body: Center(
<<<<<<< HEAD
          child: Text('Hello World'),
=======
          child: Text(wordPair.asPascalCase),
>>>>>>> 9530d31ea68fec7be76965e08b5ff624404683c9
        ),
      ),
    );
  }
}

# Sample Chess Programs

A chessboard program that allows entering moves and moving by clicking  
Also a program that accepts FEN strings as input and outputs a chessboard onto console  

## FEN-to-Chessboard (C++)

The code in C++ uses ```stdin``` because of the lack of GUI, so the FEN is input as multiple strings instead of a single string with spaces.  
Also, the conversion of character to number for the pieces is not very efficient as it is intended to allow upgrade to a system where the chessboard can be actually printed in a GUI instead of just console.  
At the moment, the FEN input can only process the first two sections in a standard FEN. Processing for the later sections is a WIP.

### What is FEN?

[Forsyth-Edwards Notation](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) is a method of representing a board position with some extra information in a single string.  

## Chess-Board (JavaScript)

A standard chessboard display that can move pieces with clicks. Drag-and-drop implementation is a WIP.  
For the rules, the movement patterns of the pieces, checks, absolute pins, castling, pawn promotion and _en passant_ have been added. Relative pins don't need to be implemented because they are still legal moves, you'll just lose a queen or so.   
Added Checkmate, Stalemate and Threefold Repetition results. The game can finally end! Draw by 50-move-rule and Insufficient Material are WIPs. Also, planning on making 50-move-rule and threefold repetition confirmation a little more efficient.  

## To-Do List

- Complete FEN support for the C++ program
- Draw by 50-Move-Rule
- Draw by Insufficient Material
- Not checking every move for Threefold Repetition
- Drag-and-Drop moves
- Sounds for piece moves
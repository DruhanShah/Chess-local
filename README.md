# Sample Chess Programs
A chessboard program that allows entering moves and moving by clicking  
Also a program that accepts FEN strings as input and outputs a chessboard onto console  

## FEN-to-Chessboard (C++)
The code in C++ uses ```stdin``` because of the lack of GUI, so the FEN is input as multiple strings instead of a single string with spaces.  
Also, the conversion of character to number for the pieces is not very efficient as it is intended to allow upgrade to a system where the chessboard can be actually printed in a GUI instead of just console.  
At the moment, the FEN input can only process the first two sections in a standard FEN. Processing for the later sections is a WIP :sweat_smile:

## Chess-Board (JavaScript)
A standard chessboard display that can move pieces with clicks. Drag-and-drop implementation is a WIP.  
For the rules, the movement patterns of the pieces have been added, but checks, pins, castling, _en passant_ and promotion are WIPs too.  

### What is FEN?
Forsyth-Edwards Notation is a method of representing a board position with some extra information in a single string.  
An example FEN would be ```rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1``` (which is the starting position in chess)  
The first section is the piece positions, where '/' separates the ranks, each letter represents a piece (Uppercase for White and Lowercase for Black) and each number represents the number of empty suares in a row in that position.  
The second section indicates whose move it is.  
The third indicates castling options: K &ndash; kingside for white, Q &ndash; queenside for white, k &ndash; kingside for black, q &ndash; queenside for black, '-' &ndash; cannot castle.  
The fourth is the _en passant_ target square ('-' if there is none)  
The fifth is the number of half moves since the last pawn move or capture (for the 50-move-rule).  
The sixth is the current move number.  

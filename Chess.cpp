#include <bits/stdc++.h>
#include <ctype.h>
#include <cctype>
using namespace std;

map<char, int> symbToNum;
map<int, char> numToSymb;
bool white00=false, white000=false, black00=false, black000=false;
int moveColour = -1;
int board[64];

void initialize()
{
    for(int i=0; i<64; i++) board[i] = 0;
    symbToNum['k'] = 1;
    symbToNum['p'] = 2;
    symbToNum['n'] = 3;
    symbToNum['b'] = 4;
    symbToNum['r'] = 5;
    symbToNum['q'] = 6;
    numToSymb[0] = ' ';
    numToSymb[9] = 'k';
    numToSymb[10] = 'p';
    numToSymb[11] = 'n';
    numToSymb[12] = 'b';
    numToSymb[13] = 'r';
    numToSymb[14] = 'q';
    numToSymb[1] = 'K';
    numToSymb[2] = 'P';
    numToSymb[3] = 'N';
    numToSymb[4] = 'B';
    numToSymb[5] = 'R';
    numToSymb[6] = 'Q';
}

void FENtoBoard(string s,char movechar)
{
    int n = s.length();
    bool phase2 = false;
    int file = 0, rank = 7;
    for(int i=0; i<n;i++)
    {
        if(s[i]=='/')
        {
            file = 0;
            rank--;
        }
        else if(isdigit(s[i])!=0)
            file += ((int)s[i])-((int)'0');
        else
        {
            int pieceColour = isupper(s[i]) ? 0 : 8;
            int pieceType = symbToNum[(char)tolower(s[i])];
            board[(rank*8)+file] = (pieceType | pieceColour);
            file++;
        }
    }
    moveColour = movechar=='w' ? 1 : 0;
}

void printBoard()
{
    for(int i=7; i>=0; i--)
    {
        for(int ii=0; ii<8; ii++)
        {
            cout << "["<<numToSymb[board[(i*8)+ii]]<<"]";
        }
        cout << "\n";
    }
    if(moveColour==1) cout << "White's move" << "\n";
    else if(moveColour==0) cout << "Black's move" << "\n";
}

int main()
{
    initialize();
    string fen;
    char movechar;
    cin >> fen >> movechar;
    FENtoBoard(fen, movechar);
    printBoard();
    return 0;
}

//Starting Position: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w
//Caro-Kann Defense: rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w
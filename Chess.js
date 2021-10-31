var darkMode = true
var darkSign = 'img/dark.svg'
var lightSign = 'img/light.svg'
var blackCaptured = []
var whiteCaptured = []

function checkSize() {
    if($(window).height()/$(window).width()<0.9) {
        $('.wideScreen').attr('hidden', false)
        $('.longScreen').attr('hidden', true)
    }
    else if($(window).height()/$(window).width()>0.9) {
        $('.longScreen').removeAttr('hidden', false)
        $('.wideScreen').attr('hidden', true)
    }
}

$(window).resize(checkSize)
$(checkSize())

/* The dummy elements are so that all the black pieces will have i & 8 == 8
And all the white pieces will have i & 8 == 0 
The .svg extension is removed so that we can use the same list for the captured piece images*/
var pieceImgList = [
    'img/blank',
    'img/white_pawn',
    'img/white_knight',
    'img/white_bishop',
    'img/white_rook',
    'img/white_queen',
    'img/white_king',
    'DUMMY',
    'DUMMY',
    'img/black_pawn',
    'img/black_knight',
    'img/black_bishop',
    'img/black_rook',
    'img/black_queen',
    'img/black_king'
]
var boardContent = []

function colorSwitch() {
    darkMode = !darkMode
    if(darkMode) {
        $('body').css('background-color', '#252525').css('color', '#e7e4e4')
        $('#topnavbar').css('background-color', '#161515').css('color', '#c7c4c4')
        $('#darkmodeButton').css('background-color', '#3f3f3f').css('color', '#ffe3c4').css('border-color', '#ffe3c4')
        $('#HowToText').css('color', '#ffffff').css('border', '1px solid #e7e4e4').css('background-color', '#161515')
        $('#PlayerTextLong').css('color', '#ffffff').css('background-color', '#4b4a4a').css('border', '1px solid #e7e4e4')
        $('#PlayerTextWide').css('color', '#ffffff').css('background-color', '#4b4a4a').css('border', '1px solid #e7e4e4')
        $('#darkmodeicon').attr('src', lightSign)
    }
    else {
        $('body').css('background-color', '#e7e4e4').css('color', '#272424')
        $('#topnavbar').css('background-color', '#b8b8b8').css('color', '#272424')
        $('#darkmodeButton').css('background-color', '#b8b8b8').css('color', '#3f3f3f').css('border-color', '#3f3f3f')
        $('#HowToText').css('color', '#272424').css('border', '1px solid #272424').css('background-color', '#b8b8b8')
        $('#PlayerTextLong').css('color', '#ffffff').css('background-color', '#4b4a4a').css('border', '1px solid #161515')
        $('#PlayerTextWide').css('color', '#ffffff').css('background-color', '#4b4a4a').css('border', '1px solid #161515')
        $('#darkmodeicon').attr('src', darkSign)
    }
}
document.getElementById('darkmodeButton').addEventListener('click', colorSwitch)

class Square {
    constructor(number,piece) {
        this.id = number
        this.pieceId = piece
        this.rank = 8-Math.floor(this.id/8)
        this.file = this.id%8
        if(piece==0) {
            this.color = null
            this.pieceType = null
        }
        else {
            this.color = this.pieceId&8
            this.pieceType = this.pieceId%8
        }
        this.legalTarget = []
        this.attackTarget = []
    }

    changePiece(newPiece) {
        if(newPiece==0) {
            this.pieceId = 0
            this.color = null
            this.pieceType = null
        }
        else {
            this.pieceId = newPiece
            this.color = newPiece&8
            this.pieceType = newPiece%8
        }     
    }

    clearLegalTarget() {
        this.legalTarget = []
        this.attackTarget = []
    }

    checkPawn() {
        if(this.color===0) {
            if(boardContent[this.id-8].pieceType===null) {
                this.legalTarget.push(this.id-8)
                if(this.rank==2)
                    this.legalTarget.push(this.id-16)
            }
            if(boardContent[this.id-7].color===8) {
                this.legalTarget.push(this.id-7)
                this.attackTarget.push(this.id-7)
            }
            if(boardContent[this.id-9].color===8) {
                this.legalTarget.push(this.id-9)
                this.attackTarget.push(this.id-9)
            }
        }
        else {
            if(boardContent[this.id+8].pieceType===null) {
                this.legalTarget.push(this.id+8)
                if(this.rank==7)
                    this.legalTarget.push(this.id+16)
            }
            if(boardContent[this.id+7].color===0) {
                this.legalTarget.push(this.id+7)
                this.attackTarget.push(this.id+7)
            }
            if(boardContent[this.id+9].color===0) {
                this.legalTarget.push(this.id+9)
                this.attackTarget.push(this.id+9)
            }
        }
    }

    checkRook() {
        var checkingSquare = this.id
        var checkingrank = this.rank
        var checkingfile = this.file+1
        while(checkingrank<8) {
            checkingSquare -= 8
            checkingrank++
            if(boardContent[checkingSquare].color==this.color)
                break;
            if(boardContent[checkingSquare].color==null)
                this.legalTarget.push(checkingSquare)
            else {
                this.legalTarget.push(checkingSquare)
                break
            }
        }
        checkingSquare = this.id
        checkingrank = this.rank
        checkingfile = this.file+1
        while(checkingrank>1) {
            checkingSquare += 8
            checkingrank--
            if(boardContent[checkingSquare].color==this.color)
                break;
            if(boardContent[checkingSquare].color==null)
                this.legalTarget.push(checkingSquare)
            else {
                this.legalTarget.push(checkingSquare)
                break
            }
        }
        checkingSquare = this.id
        checkingrank = this.rank
        checkingfile = this.file+1
        while(checkingfile<8) {
            checkingSquare += 1
            checkingfile++
            if(boardContent[checkingSquare].color==this.color)
                break;
            if(boardContent[checkingSquare].color==null)
                this.legalTarget.push(checkingSquare)
            else {
                this.legalTarget.push(checkingSquare)
                break
            }
        }
        checkingSquare = this.id
        checkingrank = this.rank
        checkingfile = this.file+1
        while(checkingfile>1) {
            checkingSquare -= 1
            checkingfile--
            if(boardContent[checkingSquare].color==this.color)
                break;
            if(boardContent[checkingSquare].color==null)
                this.legalTarget.push(checkingSquare)
            else {
                this.legalTarget.push(checkingSquare)
                break
            }
        }
    }

    checkBishop() {
        var checkingSquare = this.id
        var checkingrank = this.rank
        var checkingfile = this.file+1
        while(checkingrank>1 && checkingfile<8) {
            checkingSquare += 9
            checkingrank--
            checkingfile++
            if(boardContent[checkingSquare].color==this.color)
                break;
            if(boardContent[checkingSquare].color==null)
                this.legalTarget.push(checkingSquare)
            else {
                this.legalTarget.push(checkingSquare)
                break
            }
        }
        checkingSquare = this.id
        checkingrank = this.rank
        checkingfile = this.file+1
        while(checkingrank<8 && checkingfile<8) {
            checkingSquare -= 7
            checkingrank++
            checkingfile++
            if(boardContent[checkingSquare].color==this.color)
                break;
            if(boardContent[checkingSquare].color==null)
                this.legalTarget.push(checkingSquare)
            else {
                this.legalTarget.push(checkingSquare)
                break
            }
        }
        checkingSquare = this.id
        checkingfile = this.file+1
        checkingrank = this.rank
        while(checkingrank<8 && checkingfile>1) {
            checkingSquare -= 9
            checkingrank++
            checkingfile--
            if(boardContent[checkingSquare].color==this.color)
                break;
            if(boardContent[checkingSquare].color==null)
                this.legalTarget.push(checkingSquare)
            else {
                this.legalTarget.push(checkingSquare)
                break
            }
        }
        checkingSquare = this.id
        checkingfile = this.file+1
        checkingrank = this.rank
        while(checkingrank>1 && checkingfile>1) {
            checkingSquare += 7
            checkingrank--
            checkingfile--
            if(boardContent[checkingSquare].color==this.color)
                break;
            if(boardContent[checkingSquare].color==null)
                this.legalTarget.push(checkingSquare)
            else {
                this.legalTarget.push(checkingSquare)
                break
            }
        }
    }

    checkKing() {
        if(this.id==0) {this.legalTarget = [1, 8, 9]}
        else if(this.id==7) {this.legalTarget = [6, 14, 15]}
        else if(this.id==56) {this.legalTarget = [48, 49, 57]}
        else if(this.id==63) {this.legalTarget = [54, 55, 62]}
        else if(this.rank==1) {
            var temp = this.id
            this.legalTarget = [temp-1, temp+1, temp-7, temp-8, temp-9]
        }
        else if(this.rank==8) {
            var temp = this.id
            this.legalTarget = [temp-1, temp+1, temp+7, temp+8, temp+9]
        }
        else if(this.file==0) {
            var temp = this.id
            this.legalTarget = [temp-8, temp-7, temp+1, temp+8, temp+9]
        }
        else if(this.file==7) {
            var temp = this.id
            this.legalTarget = [temp-9, temp-8, temp-1, temp+7, temp+8]
        }
        else {
            var temp = this.id
            this.legalTarget = [temp-9, temp-8, temp-7, temp-1, temp+1, temp+7, temp+8, temp+9]
        }
        for(var i=0; i<this.legalTarget.length; i++) {
            if(boardContent[this.legalTarget[i]].color==this.color) {
                this.legalTarget.splice(i,1)
                i--
            }
        }
    }

    checkKnight() {
        if(this.rank>=3 && this.file>=1)
            this.legalTarget.push(this.id+15)
        if(this.rank>=3 && this.file<=6)
            this.legalTarget.push(this.id+17)
        if(this.rank>=2 && this.file<=5)
            this.legalTarget.push(this.id+10)
        if(this.rank<=7 && this.file<=5)
            this.legalTarget.push(this.id-6)
        if(this.rank<=6 && this.file<=6)
            this.legalTarget.push(this.id-15)
        if(this.rank<=6 && this.file>=1)
            this.legalTarget.push(this.id-17)
        if(this.rank<=7 && this.file>=2)
            this.legalTarget.push(this.id-10)
        if(this.rank>=2 && this.file>=2)
            this.legalTarget.push(this.id+6)
        
        for(var i=0; i<this.legalTarget.length; i++) {
            if(boardContent[this.legalTarget[i]].color==this.color) {
                this.legalTarget.splice(i,1)
                i--
            }
        }
    }

    checkPiece() {
        switch(this.pieceType) {
            case 1:
                this.checkPawn()
                break
            case 2:
                this.checkKnight()
                break
            case 3:
                this.checkBishop()
                break
            case 4:
                this.checkRook()
                break
            case 5:
                this.checkBishop()
                this.checkRook()
                break
            case 6:
                this.checkKing()
            default:
                break
        }
        var selfColor = this.color
        for(var i=0; i<this.legalTarget.length; i++) {
            moveList.push(new Move(this, boardContent[this.legalTarget[i]]))
            if(boardContent[this.legalTarget[i]].pieceId!=0) {
                if(boardContent[this.legalTarget[i]].color===0) {
                    blackCaptured.push(boardContent[this.legalTarget[i]].pieceId)
                }
                else
                {
                    whiteCaptured.push(boardContent[this.legalTarget[i]].pieceId)
                }
            }
            boardContent[this.legalTarget[i]].changePiece(this.pieceId)
            this.changePiece(0)

            if(checkCheck(selfColor)) {
                this.legalTarget.splice(i, 1)
                i--
            } 

            
            moveColor = moveColor ^ 8
            plyNumber++
            Undo()
        }
    }
}



function checkCheck(color) {
    var King
    for(var i=0; i<64; i++) {
        if(boardContent[i].pieceId==6 && color==0) {
            King = boardContent[i]  
        }
        else if(boardContent[i].pieceId==14 && color==8) {
            King = boardContent[i]
        }
    }
    
    //CheckRook
    var checkingSquare = King.id
    var checkingrank = King.rank
    var checkingfile = King.file+1
    while(checkingrank<8) {
        checkingSquare -= 8
        checkingrank++
        if(boardContent[checkingSquare].pieceId===(5|(King.color^8)) || boardContent[checkingSquare].pieceId===(4|(King.color^8)))
            return true
        else if(boardContent[checkingSquare].pieceId != 0)
            break
    }
    checkingSquare = King.id
    checkingrank = King.rank
    checkingfile = King.file+1
    while(checkingrank>1) {
        checkingSquare += 8
        checkingrank--
        if(boardContent[checkingSquare].pieceId===(5|(King.color^8)) || boardContent[checkingSquare].pieceId===(4|(King.color^8)))
            return true
        else if(boardContent[checkingSquare].pieceId != 0)
            break
    }
    checkingSquare = King.id
    checkingrank = King.rank
    checkingfile = King.file+1
    while(checkingfile<8) {
        checkingSquare += 1
        checkingfile++
        if(boardContent[checkingSquare].pieceId===(5|(King.color^8)) || boardContent[checkingSquare].pieceId===(4|(King.color^8)))
            return true
        else if(boardContent[checkingSquare].pieceId != 0)
            break
    }
    checkingSquare = King.id
    checkingrank = King.rank
    checkingfile = King.file+1
    while(checkingfile>1) {
        checkingSquare -= 1
        checkingfile--
        if(boardContent[checkingSquare].pieceId===(5|(King.color^8)) || boardContent[checkingSquare].pieceId===(4|(King.color^8)))
            return true
        else if(boardContent[checkingSquare].pieceId != 0)
            break
    }

    //CheckBishop
    var checkingSquare = King.id
    var checkingrank = King.rank
    var checkingfile = King.file+1
    while(checkingrank>1 && checkingfile<8) {
        checkingSquare += 9
        checkingrank--
        checkingfile++
        if(boardContent[checkingSquare].pieceId==(5|(King.color^8)) || boardContent[checkingSquare].pieceId==(3|(King.color^8)))
            return true
        else if(boardContent[checkingSquare].pieceId != 0)
            break
    }
    checkingSquare = King.id
    checkingrank = King.rank
    checkingfile = King.file+1
    while(checkingrank<8 && checkingfile<8) {
        checkingSquare -= 7
        checkingrank++
        checkingfile++
        if(boardContent[checkingSquare].pieceId==(5|(King.color^8)) || boardContent[checkingSquare].pieceId==(3|(King.color^8)))
           return true
        else if(boardContent[checkingSquare].pieceId != 0)
            break
    }
    checkingSquare = King.id
    checkingfile = King.file+1
    checkingrank = King.rank
    while(checkingrank<8 && checkingfile>1) {
        checkingSquare -= 9
        checkingrank++
        checkingfile--
        if(boardContent[checkingSquare].pieceId==(5|(King.color^8)) || boardContent[checkingSquare].pieceId==(3|(King.color^8)))
            return true
        else if(boardContent[checkingSquare].pieceId != 0)
            break
    }
    checkingSquare = King.id
    checkingfile = King.file+1
    checkingrank = King.rank
    while(checkingrank>1 && checkingfile>1) {
        checkingSquare += 7
        checkingrank--
        checkingfile--
        if(boardContent[checkingSquare].pieceId==(5|(King.color^8)) || boardContent[checkingSquare].pieceId==(3|(King.color^8)))
            return true
        else if(boardContent[checkingSquare].pieceId != 0)
            break
    }

    //CheckKnight
    var AttackSquare = []
    if(King.rank>=3 && King.file>=1)
        AttackSquare.push(King.id+15)
    if(King.rank>=3 && King.file<=6)
        AttackSquare.push(King.id+17)
    if(King.rank>=2 && King.file<=5)
        AttackSquare.push(King.id+10)
    if(King.rank<=7 && King.file<=5)
        AttackSquare.push(King.id-6)
    if(King.rank<=6 && King.file<=6)
        AttackSquare.push(King.id-15)
    if(King.rank<=6 && King.file>=1)
        AttackSquare.push(King.id-17)
    if(King.rank<=7 && King.file>=2)
        AttackSquare.push(King.id-10)
    if(King.rank>=2 && King.file>=2)
        AttackSquare.push(King.id+6)
    
    for(var i=0; i<AttackSquare.length; i++) {
        if(boardContent[AttackSquare[i]].pieceId==(2|(King.color^8)))
            return true
    }

    //CheckKing
    AttackSquare = []
    if(King.id==0) {AttackSquare = [1, 8, 9]}
    else if(King.id==7) {AttackSquare = [6, 14, 15]}
    else if(King.id==56) {AttackSquare = [48, 49, 57]}
    else if(King.id==63) {AttackSquare = [54, 55, 62]}
    else if(King.rank==1) {
        var temp = King.id
        AttackSquare = [temp-1, temp+1, temp-7, temp-8, temp-9]
    }
    else if(King.rank==8) {
        var temp = King.id
        AttackSquare = [temp-1, temp+1, temp+7, temp+8, temp+9]
    }
    else if(King.file==0) {
        var temp = King.id
        AttackSquare = [temp-8, temp-7, temp+1, temp+8, temp+9]
    }
    else if(King.file==7) {
        var temp = King.id
        AttackSquare = [temp-9, temp-8, temp-1, temp+7, temp+8]
    }
    else {
        var temp = King.id
        AttackSquare = [temp-9, temp-8, temp-7, temp-1, temp+1, temp+7, temp+8, temp+9]
    }
    for(var i=0; i<AttackSquare.length; i++) {
        if(boardContent[AttackSquare[i]].pieceId==(6|(King.color^8)))
            return true
    }

    //CheckPawn
    AttackSquare = []
    if(King.color==0 && King.rank<8)
        AttackSquare = [King.id-7, King.id-9]
    else if(King.color==8 && King.rank>1)
        AttackSquare = [King.id+7, King.id+9]
    for(var i=0; i<AttackSquare.length; i++) {
        if(boardContent[AttackSquare[i].pieceId == (1|(King.color^8))])
            return true
    }

    return false;
}




var plyNumber = 1
var moveList = []

class Move {
    constructor(from, to) {
        this.fromSquare = from.id
        this.fromPiece = from.pieceId
        this.fromColor = from.color
        this.toSquare = to.id
        this.toPiece = to.pieceId
        this.toColor = to.color
        this.number = plyNumber
    }
}


for(var i=0; i<64; i++) {
    boardContent.push(new Square(i, 0))
}

var pickedUp = false
var pickedUpSquare = null
var moveColor = 0

function buildBoard() {
    var board = $('#ChessBoard')

    var blankrow = $('<tr>')

    var blanksquare = $('<td>')
    blanksquare.attr('colspan', '10').height('10%')
    blankrow.append(blanksquare)

    board.append(blankrow)

    for(var rank = 0; rank<8; rank++) {
        var row = $('<tr>')
        row.css('padding', '0')
        
        var blanksquare = $('<td>')
        blanksquare.width('10%').height('10%')
        row.append(blanksquare)

        for(var file = 0; file<8; file++) {
            var square = $('<td id='+String((8*rank)+file)+'></td>')
            square.css('backgroundColor', (rank+file)%2===1 ? '#694232' : '#ffd993').width('10%').height('10%')

            row.append(square)
        }
        
        var blanksquare = $('<td>'+String(8-rank)+'</td>')
        blanksquare.width('10%').height('10%')
        row.append(blanksquare)

        board.append(row)
    }

    var blankrow = $('<tr>')

    var blanksquare = $('<td>')
    blanksquare.width('10%').height('10%')
    blankrow.append(blanksquare)

    for(var file = 0; file<8; file++) {
        var square = $('<td>'+String.fromCharCode(97+file)+'</td>')
        square.width('10%').height('10%')
        blankrow.append(square)
    }
    var cornersquare = $('<td>')
    cornersquare.width('10%').height('10%')
	
	var moveindicator = $("<div id='moveIndicator'>")
	moveindicator.css('border', '5px solid grey').css('background-color', moveColor==8 ? '#000000' : '#ffffff')
	moveindicator.css('border-color', '#aaaaaa').css('border-radius', '7vmin').height('5vmin').width('5vmin')

	cornersquare.append(moveindicator)

    blankrow.append(cornersquare)
    board.append(blankrow)

    startingPosition()
}

function startingPosition() {
    boardContent[0].changePiece(12)
    boardContent[1].changePiece(10)
    boardContent[2].changePiece(11)
    boardContent[3].changePiece(13)
    boardContent[4].changePiece(14)
    boardContent[5].changePiece(11)
    boardContent[6].changePiece(10)
    boardContent[7].changePiece(12)
    for(var i=0; i<8; i++) {
        boardContent[8+i].changePiece(9)
        boardContent[48+i].changePiece(1)
    }
    for(var i=16; i<48; i++) {
        boardContent[i].changePiece(0)
    }
    boardContent[56].changePiece(4)
    boardContent[57].changePiece(2)
    boardContent[58].changePiece(3)
    boardContent[59].changePiece(5)
    boardContent[60].changePiece(6)
    boardContent[61].changePiece(3)
    boardContent[62].changePiece(2)
    boardContent[63].changePiece(4)

    whiteCaptured = []
    blackCaptured = []
    presentBoard()
}

function presentBoard() {
    for(var i=0; i<64; i++) {
        var cell = $('#'+String(i))
        cell.empty()
        
        var img = $('<img src='+pieceImgList[boardContent[i].pieceId]+'.svg></img>')
        img.width('100%').height('100%')
        cell.append(img)
    }
    document.getElementById('moveIndicator').style.backgroundColor = moveColor==8 ? '#000000' : '#ffffff'
	
    for(var i=0; i<64; i++) {
        $('#'+i).css('background-color', (boardContent[i].rank+boardContent[i].file)%2==1 ? '#694232' : '#ffd993').css('border', '0px')
    }

    for(var i=0; i<64; i++) {
        if(boardContent[i].pieceId!=0) {
            boardContent[i].clearLegalTarget()
            boardContent[i].checkPiece()
        }
    }

    if(moveList.length!=0) {
        var lastMove = moveList[moveList.length-1]
        var lastFrom = boardContent[lastMove.fromSquare]
        var lastTo = boardContent[lastMove.toSquare]
        $('#'+String(lastMove.fromSquare)).css('background-color', (lastFrom.rank+lastFrom.file)%2==1 ? '#3b633c' : '#7bc77e' )
        $('#'+String(lastMove.toSquare)).css('background-color', (lastTo.rank+lastTo.file)%2==1 ? '#3b633c' : '#7bc77e' )
    }

    if(pickedUpSquare!==null) {
        if(pickedUp) {
            $('#'+String(pickedUpSquare)).css('background-color', '#2f3340')
            for(var i=0; i<boardContent[pickedUpSquare].legalTarget.length; i++) {
                var temp = boardContent[pickedUpSquare].legalTarget[i]
                $('#'+String(temp)).css('border', '3px solid #4f788f')
            }
        }
    }

    if(whiteCaptured.length==0) {
        var capPiece = $('<td>')
        var capImg = $('<img src=img/blank.svg>')
        capImg.height('1.5em')
        capPiece.append(capImg)
        $('tr#whiteCapturedList').empty().append(capPiece)
    }
    else{
        whiteCaptured.sort(function(a,b){return (b-a)})
        $('tr#whiteCapturedList').empty()
        for(var i=0; i<whiteCaptured.length; i++) {
            var capPiece = $('<td>')
            var capImg = $('<img src='+pieceImgList[whiteCaptured[i]]+'_cap.svg>')
            capPiece.css('padding', '0px').css('margin', '0px')
            capImg.height('1.5em').width('fit-content')
            capPiece.append(capImg)
            $('tr#whiteCapturedList').append(capPiece)
        }
    }
    if(blackCaptured.length==0) {
        var capPiece = $('<td>')
        var capImg = $('<img src=img/blank.svg>')
        capImg.height('1.5em')
        capPiece.append(capImg)
        $('tr#blackCapturedList').empty().append(capPiece)
    }
    else {
        blackCaptured.sort(function(a,b){return (b-a)})
        $('tr#blackCapturedList').empty()
        for(var i=0; i<blackCaptured.length; i++) {
            var capPiece = $('<td>')
            var capImg = $('<img src='+pieceImgList[blackCaptured[i]]+'_cap.svg>')
            capPiece.css('padding', '0px').css('margin', '0px')
            capImg.height('1.5em').width('fit-content')
            capPiece.append(capImg)
            $('tr#blackCapturedList').append(capPiece)
        }
    }

    var whiteKing, blackKing
    for(var i=0; i<64; i++) {
        if(boardContent[i].pieceId==6)
            whiteKing = boardContent[i]
        else if(boardContent[i].pieceId==14)
            blackKing = boardContent[i]
    }
    if(checkCheck(0)) {
        $('#'+whiteKing.id).css('border', '3px solid #ff0000')
    }
    if(checkCheck(8)) {
        $('#'+blackKing.id).css('border', '3px solid #ff0000')
    }
}

buildBoard()

function move(from, to) {
    if(verifyMove(from,to)) {
        if(to.pieceId!=0) {
            if(from.color==0)
            whiteCaptured.push(to.pieceId)
            else
            blackCaptured.push(to.pieceId)
        }
        var newMove = new Move(from, to)
        moveList.push(newMove)
        to.changePiece(from.pieceId)
        from.changePiece(0)
        plyNumber++
		moveColor = moveColor ^ 8
    }
}


function verifyMoveColor(pickedColor) {
    if(moveColor===pickedColor) {
		return true
	}
    else {
        return false
	}
}

function verifyMove(from, to) {
    if(from.color===to.color) {
        return false;
    }
    return from.legalTarget.includes(to.id)
}

function selectSquare(e) {
    var selectedSquare
	if(e.target.tagName=='IMG') {
		selectedSquare = e.target.parentElement
	}
	else if(e.target.tagName=='TD'){
		selectedSquare = e.target
	}
	else {
		return null;
	}
	var squareId = Number(selectedSquare.getAttribute('id'))
    if(!pickedUp) {
		if(typeof(boardContent[squareId].pieceType)!=='number') {
			return null;
		}
        if(verifyMoveColor(boardContent[squareId].color)) {
			pickedUpSquare = squareId
			pickedUp = true
			presentBoard()
        }
    }
	else {
		pickedUp = false
		move(boardContent[pickedUpSquare], boardContent[squareId])
		presentBoard()
		pickedUpSquare = null
	}
}

function Undo() {
    if(moveList.length==0) {
        return null
    }
    var lastMove = moveList[moveList.length-1]
    
    if(lastMove.toColor===0) {
        for(var i=0; i<blackCaptured.length; i++) {
            if(blackCaptured[i]==lastMove.toPiece) {
                blackCaptured.splice(i,1)
                break
            }
        }
    }
    else if(lastMove.toColor===8) {
        for(var i=0; i<whiteCaptured.length; i++) {
            if(whiteCaptured[i]==lastMove.toPiece) {
                whiteCaptured.splice(i,1)
                break
            }
        }
    }
    boardContent[lastMove.fromSquare].changePiece(lastMove.fromPiece)
    boardContent[lastMove.toSquare].changePiece(lastMove.toPiece)
    
    moveList.splice(moveList.length-1, 1)
    
    moveColor = moveColor ^ 8
    plyNumber--
}

function UndoButton() {
    Undo()
    presentBoard()
}

document.getElementById('undo').addEventListener('click', UndoButton)
document.getElementById('ChessBoard').addEventListener('click', selectSquare)
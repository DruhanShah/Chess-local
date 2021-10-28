var darkMode = true
var darkSign = 'img/dark.svg'
var lightSign = 'img/light.svg'

/* The dummy elements are so that all the black pieces will have i & 8 == 8
And all the white pieces will have i & 8 == 0 */
var pieceImgList = [
    'img/blank.svg',
    'img/white_pawn.svg',
    'img/white_knight.svg',
    'img/white_bishop.svg',
    'img/white_rook.svg',
    'img/white_queen.svg',
    'img/white_king.svg',
    'DUMMY',
    'DUMMY',
    'img/black_pawn.svg',
    'img/black_knight.svg',
    'img/black_bishop.svg',
    'img/black_rook.svg',
    'img/black_queen.svg',
    'img/black_king.svg'
]
var boardContent = []
for(var i = 0; i<64; i++) {
    boardContent.push(0)
}

function colorSwitch() {
    darkMode = !darkMode
    if(darkMode) {
        document.body.style.backgroundColor='#252525'
        document.body.style.color='#e7e4e4'
        
        document.getElementById('topnavbar').style.backgroundColor='#161515'
        document.getElementById('topnavbar').style.color='#c7c4c4'

        document.getElementById('from').style.backgroundColor='#3f3f3f'
        document.getElementById('from').style.color='#ffe3c4'
        document.getElementById('from').style.borderColor='#ffe3c4'

        document.getElementById('to').style.backgroundColor='#3f3f3f'
        document.getElementById('to').style.color='#ffe3c4'
        document.getElementById('to').style.borderColor='#ffe3c4'

        document.getElementById('makeMove').style.backgroundColor='#3f3f3f'
        document.getElementById('makeMove').style.color='#ffe3c4'
        document.getElementById('makeMove').style.borderColor='#ffe3c4'
        
        document.getElementById('darkmodeButton').style.backgroundColor='#3f3f3f'
        document.getElementById('darkmodeButton').style.color='#ffe3c4'
        document.getElementById('darkmodeButton').style.borderColor='#ffe3c4'

        document.getElementById('darkmodeicon').setAttribute('src', lightSign)
    }
    else {
        document.body.style.backgroundColor='#e7e4e4'
        document.body.style.color='#272424'
        
        document.getElementById('topnavbar').style.backgroundColor='#b8b8b8'
        document.getElementById('topnavbar').style.color='#272424'

        document.getElementById('from').style.backgroundColor='#ffe3c4'
        document.getElementById('from').style.color='#3f3f3f'
        document.getElementById('from').style.borderColor='#3f3f3f'

        document.getElementById('to').style.backgroundColor='#ffe3c4'
        document.getElementById('to').style.color='#3f3f3f'
        document.getElementById('to').style.borderColor='#3f3f3f'
        
        document.getElementById('makeMove').style.backgroundColor='#ffe3c4'
        document.getElementById('makeMove').style.color='#3f3f3f'
        document.getElementById('makeMove').style.borderColor='#3f3f3f'

        document.getElementById('darkmodeButton').style.backgroundColor='#b8b8b8'
        document.getElementById('darkmodeButton').style.color='#3f3f3f'
        document.getElementById('darkmodeButton').style.borderColor='#3f3f3f'
        
        document.getElementById('darkmodeicon').setAttribute('src', darkSign)
    }
}
document.getElementById('darkmodeButton').addEventListener('click', colorSwitch)

var pickedUp = false
var pickedUpSquare = null
var moveColor = 0

function buildBoard() {
    var board = document.getElementById('ChessBoard')

    var blankrow = document.createElement('tr')
    blankrow.style.height='10%'

    var blanksquare = document.createElement('td')
    blanksquare.setAttribute('colspan', 10)
    blankrow.appendChild(blanksquare)

    board.appendChild(blankrow)

    for(var rank = 0; rank<8; rank++) {
        var row = document.createElement('tr')
        row.style.padding = '0'
        row.style.height='10%'
        
        var blanksquare = document.createElement('td')
        row.appendChild(blanksquare)

        for(var file = 0; file<8; file++) {
            var square = document.createElement('td')
            square.style.backgroundColor= (rank+file)%2===1 ? '#694232' : '#ffd993'
            square.style.width='10%'
            square.setAttribute('id', String((8*rank)+file))

            row.appendChild(square)
        }
        
        var blanksquare = document.createElement('td')
        var ranknumber = document.createTextNode(String(8-rank))
        blanksquare.appendChild(ranknumber)
        row.appendChild(blanksquare)

        board.appendChild(row)
    }

    var blankrow = document.createElement('tr')
    blankrow.style.height='10%'

    var blanksquare = document.createElement('td')
    blankrow.appendChild(blanksquare)

    for(var file = 0; file<8; file++) {
        var square = document.createElement('td')
        square.style.width = '10%'
        var colnum = document.createTextNode(String.fromCharCode(97+file))
        square.appendChild(colnum)
        blankrow.appendChild(square)
    }
    var cornersquare = document.createElement('td')
    cornersquare.style.width = '10%'
	
	var moveindicator = document.createElement('div')
	moveindicator.setAttribute('id', 'moveIndicator')
	moveindicator.style.border = '5px solid grey'
	moveindicator.style.backgroundColor = moveColor==8 ? '#000000' : '#ffffff'
	moveindicator.style.borderColor = '#aaaaaa'
	moveindicator.style.borderRadius = '7vmin'
	moveindicator.style.width = '5vmin'
	moveindicator.style.height = '5vmin'

	cornersquare.appendChild(moveindicator)

    blankrow.appendChild(cornersquare)
    board.appendChild(blankrow)
}

function startingPosition() {
    boardContent[0] = 12
    boardContent[1] = 10
    boardContent[2] = 11
    boardContent[3] = 13
    boardContent[4] = 14
    boardContent[5] = 11
    boardContent[6] = 10
    boardContent[7] = 12
    for(var i=0; i<8; i++) {
        boardContent[8+i] = 9
        boardContent[48+i] = 1
    }
    boardContent[56] = 4
    boardContent[57] = 2
    boardContent[58] = 3
    boardContent[59] = 5
    boardContent[60] = 6
    boardContent[61] = 3
    boardContent[62] = 2
    boardContent[63] = 4
}

function presentBoard() {
    for(var i=0; i<64; i++) {
        var cell = document.getElementById(String(i))
        while(cell.hasChildNodes()) {
            cell.removeChild(cell.firstElementChild)
        }
        
        if(boardContent[i] != 0) {
            var img = document.createElement('img')
            img.setAttribute('src', pieceImgList[boardContent[i]])
            img.style.width='100%'
            img.style.height='100%'
            cell.appendChild(img)
        }
    }
	if(pickedUpSquare!==null) {
		if(pickedUp) {
			document.getElementById(String(pickedUpSquare)).style.backgroundColor = '#349fd9'
		}
		else {
			var rank = Math.floor(pickedUpSquare/8)
			var file = pickedUpSquare%8
			document.getElementById(String(pickedUpSquare)).style.backgroundColor = (rank+file)%2===1 ? '#694232' : '#ffd993'
		}
	}
}

buildBoard()
startingPosition()
presentBoard()

function squareToBoardContent(squareId) {
	var rank = squareId[1]
	var file = squareId[0]
	var tar = (file.charCodeAt(0)-97) + (8-rank)*8
	return tar
}

function move(from, to) {
        var movedPiece = boardContent[from]
        boardContent[from] = 0
        boardContent[to] = movedPiece
		moveColor = moveColor ^ 8
		document.getElementById('moveIndicator').style.backgroundColor = moveColor==8 ? '#000000' : '#ffffff'
}


function verifyMoveColor(pickedColor) {
    if(moveColor==pickedColor) {
		return true
	}
    else {
        return false
	}
}

function selectSquare(e) {
    var selectedSquare
	if(e.target.tagName=='IMG') {
		console.log(e.target.parentElement)
		selectedSquare = e.target.parentElement
	}
	else if(e.target.tagName=='TD'){
		console.log(e.target)
		selectedSquare = e.target
	}
	else {
		alert("Please select a square.")
		console.log(e.target.tagName)
		return null;
	}
	var squareId = Number(selectedSquare.getAttribute('id'))
    if(!pickedUp) {
		if(boardContent[squareId]==0) {
			alert("Please choose a piece of the appropriate color")
			console.log(pickedUp)
			return null;
		}
        if(verifyMoveColor(boardContent[squareId] & 8)) {
			pickedUpSquare = squareId
			pickedUp = true
			presentBoard()
        }
    }
	else {
		pickedUp = false
		move(pickedUpSquare, squareId)
		presentBoard()
		pickedUpSquare = null
	}
	console.log(pickedUp)
}


document.getElementById('ChessBoard').addEventListener('click', selectSquare)
document.getElementById('makeMove').addEventListener('click', function() {
	var source = document.getElementById('from').value
	var sink = document.getElementById('to').value
	if(source.length==2 && sink.length==2) {
		move(squareToBoardContent(source), squareToBoardContent(sink))
		presentBoard()
	}
	else {
		alert("Please enter valid square. Check if the entry has any extra whitespace")
	}
})
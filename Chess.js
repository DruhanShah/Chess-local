var darkMode = true
var darkSign = 'img/dark.svg'
var lightSign = 'img/light.svg'
var blackCaptured = []
var whiteCaptured = []
var darkSquare = '#555555'
var lightSquare = '#cccccc'
var selectColor = '#00b3a4'
var movedColor = '#7bc77e'
var checkedColor = '#ff0000'

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
var enPassant = null
var fiftyMove = 0
var irreversible = 0

function colorSwitch() {
	darkMode = !darkMode
	if(darkMode) {
		$('body').css('background-image', 'linear-gradient(#00282b, #0e0e0e 15%)').css('color', '#e7e4e4')
		$('#topnavbar').css('color', '#c7c4c4')
		$('#boardArea').css('border', '2px solid #00ccff')
		$('#undo').css('border', '2px solid #00ccff')
		$('#darkmodeButton').css('background-color', '#3f3f3f').css('color', '#ffe3c4').css('border', '2px solid #00ccff')
		$('#HowToText').css('color', '#ffffff').css('border', '1px solid #e7e4e4').css('background-color', '#161515')
		$('#PlayerTextLong').css('color', '#ffffff').css('background-color', '#4b4a4a').css('border', '1px solid #e7e4e4').css('font-weight','100')
		$('#White').css('color', '#ffffff').css('background-color', '#4b4a4a').css('border', '2px solid #00ccff').css('font-weight','100')
		$('#Black').css('color', '#ffffff').css('background-color', '#4b4a4a').css('border', '2px solid #00ccff').css('font-weight','100')
		$('#ResultModal').css('background-color', '#161515').css('color', '#c7c4c4').css('border', '2px solid #00ccff')
		$('#seeBoardButton').css('background-color', '#161515').css('color', '#ffe3c4')
		$('#QButton').css('background-color', '#3f3f3f')
		$('#RButton').css('background-color', '#3f3f3f')
		$('#BButton').css('background-color', '#3f3f3f')
		$('#NButton').css('background-color', '#3f3f3f')
		$('#PromoteModal').css('background-color', '#161515').css('color', '#c7c4c4').css('border', '1px solid #00ccff').css('font-weight', '300')
		$('#darkmodeicon').attr('src', lightSign)
	}
	else {
		$('body').css('background-image', 'linear-gradient(#a1a2b5, #c0c0c5 15%)').css('color', '#272424')
		$('#topnavbar').css('color', '#272424')
		$('#boardArea').css('border', '2px solid #161515')
		$('#undo').css('border', '1px solid #161515')
		$('#darkmodeButton').css('background-color', '#b8b8b8').css('color', '#3f3f3f').css('border', '1px solid #ffe3c4')
		$('#HowToText').css('color', '#272424').css('border', '2px solid #272424').css('background-color', '#b8b8b8')
		$('#PlayerTextLong').css('color', '#000000').css('background-color', '#919191').css('border', '2px solid #161515').css('font-weight','200')
		$('#White').css('color', '#000000').css('background-color', '#919191').css('border', '2px solid #161515').css('font-weight','200')
		$('#Black').css('color', '#000000').css('background-color', '#919191').css('border', '2px solid #161515').css('font-weight','200')
		$('#ResultModal').css('background-color', '#919191').css('color', '#161515').css('border', '2px solid #161515')
		$('#seeBoardButton').css('background-color', '#919191').css('color', '#161515')
		$('#QButton').css('background-color', '#b8b8b8')
		$('#RButton').css('background-color', '#b8b8b8')
		$('#BButton').css('background-color', '#b8b8b8')
		$('#NButton').css('background-color', '#b8b8b8')
		$('#PromoteModal').css('background-color', '#919191').css('color', '#161515').css('border', '2px solid #161515').css('font-weight', '400')
		$('#darkmodeicon').attr('src', darkSign)
	}
}
document.getElementById('darkmodeButton').addEventListener('click', colorSwitch)

var k=true,q=true,K=true,Q=true

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
			if(boardContent[this.id-8].pieceId==0) {
				this.legalTarget.push(this.id-8)
				if(this.rank==2 && boardContent[this.id-16].pieceId==0)
					this.legalTarget.push(this.id-16)
			}
			if(this.file !=7 && boardContent[this.id-7].color===8) {
				this.legalTarget.push(this.id-7)
				this.attackTarget.push(this.id-7)
			}
			if(this.file !=0 && boardContent[this.id-9].color===8) {
				this.legalTarget.push(this.id-9)
				this.attackTarget.push(this.id-9)
			}
			if(((this.file !=7 && enPassant===this.id-7) || (this.file !=0 && enPassant===this.id-9)) && moveColor==0) {
				moveList.push(new Ply(this, boardContent[enPassant]))
				boardContent[enPassant+8].changePiece(0)
				boardContent[enPassant].changePiece(1)
				this.changePiece(0)
				if(!checkCheck(0)) {
					this.legalTarget.push(enPassant)
					this.attackTarget.push(enPassant)
				}
				moveColor = moveColor ^ 8
				plyNumber++
				Undo()
			}
		}
		else if(this.color===8){
			if(boardContent[this.id+8].pieceId==0) {
				this.legalTarget.push(this.id+8)
				if(this.rank==7 && boardContent[this.id+16].pieceId==0)
					this.legalTarget.push(this.id+16)
			}
			if(this.file !=0 && boardContent[this.id+7].color===0) {
				this.legalTarget.push(this.id+7)
				this.attackTarget.push(this.id+7)
			}
			if(this.file !=7 && boardContent[this.id+9].color===0) {
				this.legalTarget.push(this.id+9)
				this.attackTarget.push(this.id+9)
			}
			if(((this.file !=0 && enPassant===this.id+7) || (this.file !=7 && enPassant===this.id+9)) && moveColor==8) {
				moveList.push(new Ply(this, boardContent[enPassant]))
				boardContent[enPassant-8].changePiece(0)
				boardContent[enPassant].changePiece(9)
				this.changePiece(0)
				if(!checkCheck(8))
					this.legalTarget.push(enPassant)
				moveColor = moveColor ^ 8
				plyNumber++
				Undo()
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
		if(this.color==0) {
			if(K) {
				var canCastle = true
				if(boardContent[this.id+1].pieceId==0) {
					boardContent[this.id].changePiece(0)
					boardContent[this.id+1].changePiece(6)
					if(checkCheck(0))
						canCastle = false
					boardContent[this.id].changePiece(6)
					boardContent[this.id+1].changePiece(0)
				}
				else
					canCastle = false
				if(boardContent[this.id+2].pieceId==0) {
					boardContent[this.id].changePiece(0)
					boardContent[this.id+2].changePiece(6)
					if(checkCheck(0))
						canCastle = false
					boardContent[this.id].changePiece(6)
					boardContent[this.id+2].changePiece(0)
				}
				else
					canCastle = false
				if(canCastle)
					this.legalTarget.push(this.id+2)
			}
			if(Q) {
				var canCastle = true
				if(boardContent[this.id-1].pieceId==0) {
					boardContent[this.id].changePiece(0)
					boardContent[this.id-1].changePiece(6)
					if(checkCheck(0))
						canCastle = false
					boardContent[this.id].changePiece(6)
					boardContent[this.id-1].changePiece(0)
				}
				else
					canCastle = false
				if(boardContent[this.id-2].pieceId==0) {
					boardContent[this.id].changePiece(0)
					boardContent[this.id-2].changePiece(6)
					if(checkCheck(0))
						canCastle = false
					boardContent[this.id].changePiece(6)
					boardContent[this.id-2].changePiece(0)
				}
				else
					canCastle = false
				if(boardContent[this.id-3].pieceId!=0)
					canCastle = false
				if(canCastle)
					this.legalTarget.push(this.id-2)
			}
		}
		else {
			if(k) {
				var canCastle = true
				if(boardContent[this.id+1].pieceId==0) {
					boardContent[this.id].changePiece(0)
					boardContent[this.id+1].changePiece(14)
					if(checkCheck(8))
						canCastle = false
					boardContent[this.id].changePiece(14)
					boardContent[this.id+1].changePiece(0)
				}
				else
					canCastle = false
				if(boardContent[this.id+2].pieceId==0) {
					boardContent[this.id].changePiece(0)
					boardContent[this.id+2].changePiece(14)
					if(checkCheck(8))
						canCastle = false
					boardContent[this.id].changePiece(14)
					boardContent[this.id+2].changePiece(0)
				}
				else
					canCastle = false
				if(canCastle)
					this.legalTarget.push(this.id+2)
			}
			if(q) {
				var canCastle = true
				if(boardContent[this.id-1].pieceId==0) {
					boardContent[this.id].changePiece(0)
					boardContent[this.id-1].changePiece(14)
					if(checkCheck(8))
						canCastle = false
					boardContent[this.id].changePiece(14)
					boardContent[this.id-1].changePiece(0)
				}
				else
					canCastle = false
				if(boardContent[this.id-2].pieceId==0) {
					boardContent[this.id].changePiece(0)
					boardContent[this.id-2].changePiece(14)
					if(checkCheck(8))
						canCastle = false
					boardContent[this.id-2].changePiece(0)
					boardContent[this.id].changePiece(14)
				}
				else
					canCastle = false
				if(boardContent[this.id-3].pieceId!=0)
					canCastle = false
				if(canCastle)
					this.legalTarget.push(this.id-2)
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
			if(this.pieceType===1 && this.legalTarget[i]===enPassant)
				continue
			moveList.push(new Ply(this, boardContent[this.legalTarget[i]]))
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
	if(King.color==0 && King.rank<8) {
		if(King.file!=0)
			AttackSquare.push(King.id-9)
		if(King.file!=7)
			AttackSquare.push(King.id-7)
	}
	else if(King.color==8 && King.rank>1) {
		if(King.file!=0)
			AttackSquare.push(King.id+7)
		if(King.file!=7)
			AttackSquare.push(King.id+9)
	}
	for(var i=0; i<AttackSquare.length; i++) {
		if(boardContent[AttackSquare[i]].pieceId == (1|(King.color^8)))
			return true
	}

	return false;
}




var plyNumber = 1
var moveList = []

class Ply {
	constructor(from, to) {
		this.fromSquare = from.id
		this.fromPiece = from.pieceId
		this.fromColor = from.color
		this.toSquare = to.id
		this.toPiece = to.pieceId
		this.toColor = to.color
		this.number = plyNumber
		this.position = []
		this.eP = enPassant
		this.kingsideCastle = (from.pieceType==6 && to.id-from.id==2)
		this.queensideCastle = (from.pieceType==6 && from.id-to.id==2)
		this.castling = [K,Q,k,q]
		this.fmr = fiftyMove
		this.irr = irreversible
	}

	pushPosition() {
		for(var i=0; i<64; i++) {
			this.position.push(boardContent[i].pieceId)
		}
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
	blanksquare.attr('colspan', '10').attr('id','blank').height('10%')
	blankrow.append(blanksquare)

	board.append(blankrow)

	for(var rank = 0; rank<8; rank++) {
		var row = $('<tr>')
		row.css('padding', '0')
		
		var blanksquare = $('<td>')
		blanksquare.width('10%').height('10%').attr('id', 'blank')
		row.append(blanksquare)

		for(var file = 0; file<8; file++) {
			var square = $('<td id='+String((8*rank)+file)+'></td>')
			square.width('10%').height('10%').css('border-radius', '1vmin')

			row.append(square)
		}
		
		var blanksquare = $('<td id="blank">'+String(8-rank)+'</td>')
		blanksquare.width('10%').height('10%')
		row.append(blanksquare)

		board.append(row)
	}

	var blankrow = $('<tr>')

	var blanksquare = $('<td>')
	blanksquare.width('10%').height('10%').attr('id','blank')
	blankrow.append(blanksquare)

	for(var file = 0; file<8; file++) {
		var square = $('<td id="blank">'+String.fromCharCode(65+file)+'</td>')
		square.width('10%').height('10%')
		blankrow.append(square)
	}
	var cornersquare = $('<td>')
	cornersquare.width('10%').height('10%').attr('id', 'blank')
	
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

	moveColor = 0
	moveList = []
	whiteCaptured = []
	blackCaptured = []
	enPassant = null
	fiftyMove = 0
	irreversible = 0
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
		$('#'+i).css('background-color', (boardContent[i].rank+boardContent[i].file)%2==1 ? darkSquare : lightSquare).css('border', '0px')
	}

	for(var i=0; i<64; i++) {
		if(boardContent[i].pieceId!=0) {
			boardContent[i].clearLegalTarget()
			boardContent[i].checkPiece()
		}
	}

	if(moveList.length!=0) {
		var lastMove = moveList[moveList.length-1]
		$('#'+String(lastMove.fromSquare)).css('background-color', movedColor)
		$('#'+String(lastMove.toSquare)).css('background-color', movedColor)
	}

	if(pickedUpSquare!==null) {
		if(pickedUp) {
			$('#'+String(pickedUpSquare)).css('background-color', selectColor)
			for(var i=0; i<boardContent[pickedUpSquare].legalTarget.length; i++) {
				var temp = boardContent[pickedUpSquare].legalTarget[i]
				$('#'+String(temp)).css('border', '3px solid '+selectColor)
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
		$('#'+whiteKing.id).css('border', '3px solid '+checkedColor)
	}
	if(checkCheck(8)) {
		$('#'+blackKing.id).css('border', '3px solid '+checkedColor)
	}

	console.log(fiftyMove, irreversible)
}

buildBoard()

function GameResult(result) {
	switch(result) {
		case 'Checkmate':
			$('#ResultType').html((moveColor==0 ? 'BLACK' : 'WHITE') +' WINS!')
			$('#ResultDesc').html('by Checkmate')
			$('#ModalBox1').css('display', 'block')
			break
		case 'Stalemate':
			$('#ResultType').html('DRAW')
			$('#ResultDesc').html('by Stalemate')
			$('#ModalBox1').css('display', 'block')
			break
		case 'Repetition':
			$('#ResultType').html('DRAW')
			$('#ResultDesc').html('by Threefold Repetition')
			$('#ModalBox1').css('display', 'block')
			break
		case 'FMR':
			$('#ResultType').html('DRAW')
			$('#ResultDesc').html('by 50 Move Rule')
			$('#ModalBox1').css('display', 'block')
			break
	}
	document.getElementById('undo').removeEventListener('click', UndoButton)
	document.getElementById('ChessBoard').removeEventListener('click', selectSquare)
}

function move(from, to) {
	if(to.pieceId!=0) {
		if(from.color==0)
			whiteCaptured.push(to.pieceId)
		else
			blackCaptured.push(to.pieceId)
		fiftyMove = 0
		irreversible = plyNumber
	}
	else if(from.pieceType==1) {
		fiftyMove = 0
		irreversible = plyNumber
	}
	else
		fiftyMove++

	if(from.pieceId==1 && to.id===enPassant)
		boardContent[to.id+8].changePiece(0)
	else if(from.pieceId==9 && to.id===enPassant)
		boardContent[to.id-8].changePiece(0)
	
	var newMove = new Ply(from, to)
	
	if((K||Q) && from.pieceId==6) {
		K = false
		Q = false
	}
	else if((k||q) && from.pieceId==14) {
		k = false
		q = false
	}
	switch(from.id) {
		case 0:
			q = false
			break
		case 7:
			k = false
			break
		case 56:
			Q = false
			break
		case 63:
			K = false
			break
	}
	switch(to.id) {
		case 0:
			q = false
			break
		case 7:
			k = false
			break
		case 56:
			Q = false
			break
		case 63:
			K = false
			break
	}

	if(from.pieceId==1 && from.id-to.id==16)
		enPassant = from.id-8
	else if(from.pieceId==9 && to.id-from.id==16)
		enPassant = from.id+8
	else
		enPassant = null
	
	to.changePiece(from.pieceId)
	from.changePiece(0)
	plyNumber++
	moveColor = moveColor ^ 8
	pickedUp = false
	pickedUpSquare = null
	newMove.pushPosition()
	moveList.push(newMove)

	presentBoard()

	var noLegalMoves = true
	for(var i=0; i<64; i++) {
		if(boardContent[i].color==moveColor && boardContent[i].legalTarget.length != 0)
			noLegalMoves = false
	}
	if(noLegalMoves && checkCheck(moveColor))
		GameResult('Checkmate')
	else if(noLegalMoves && !checkCheck(moveColor))
		GameResult('Stalemate')
	
	var repetition = true
	var repetitionCounter = 0
	for(var i=Math.max(0, irreversible-1); i<moveList.length; i++) {
			repetition = true
		for(var ii=0; ii<64; ii++) {
			if(newMove.position[ii]!=moveList[i].position[ii])
				repetition = false;
		}
		if(repetition)
			repetitionCounter++
		if(repetitionCounter==3)
			GameResult('Repetition')
	}

	if(fiftyMove==100)
		GameResult('FMR')
}

function choosePromote(from, to) {
	$('#ModalBox2').css('display', 'block')
	var img1 = $('<img>')
	img1.attr('src', 'img/'+(from.color==0 ? 'white' : 'black')+'_queen.svg')
	img1.width('5vmin').height('5vmin')
	$('#QButton').append(img1)
	var img2 = $('<img>')
	img2.attr('src', 'img/'+(from.color==0 ? 'white' : 'black')+'_rook.svg')
	img2.width('5vmin').height('5vmin')
	$('#RButton').append(img2)
	var img3 = $('<img>')
	img3.attr('src', 'img/'+(from.color==0 ? 'white' : 'black')+'_bishop.svg')
	img3.width('5vmin').height('5vmin')
	$('#BButton').append(img3)
	var img4 = $('<img>')
	img4.attr('src', 'img/'+(from.color==0 ? 'white' : 'black')+'_knight.svg')
	img4.width('5vmin').height('5vmin')
	$('#NButton').append(img4)
	document.getElementById('QButton').addEventListener('click', function() {promote(from, to, from.color|5)})
	document.getElementById('RButton').addEventListener('click', function() {promote(from, to, from.color|4)})
	document.getElementById('BButton').addEventListener('click', function() {promote(from, to, from.color|3)})
	document.getElementById('NButton').addEventListener('click', function() {promote(from, to, from.color|2)})
}

function promote(from, to, promoteTo) {
	if(to.pieceId!=0) {
		if(from.color==0)
			whiteCaptured.push(to.pieceId)
		else
			blackCaptured.push(to.pieceId)
		fiftyMove = 0
	}
	irreversible = plyNumber
	var newMove = new Ply(from, to)
	enPassant = null

	to.changePiece(promoteTo)
	from.changePiece(0)
	plyNumber++
	irreversible = plyNumber
	moveColor = moveColor ^ 8
	pickedUp = false
	pickedUpSquare = null
	newMove.pushPosition()
	moveList.push(newMove)

	$('#ModalBox2').css('display', 'none')

	presentBoard()

	var noLegalMoves = true
	for(var i=0; i<64; i++) {
		if(boardContent[i].color==moveColor && boardContent[i].legalTarget.length != 0)
			noLegalMoves = false
	}
	if(noLegalMoves && checkCheck(moveColor))
		GameResult('Checkmate')
	else if(noLegalMoves && !checkCheck(moveColor))
		GameResult('Stalemate')

	$('#ModalBox2').css('display', 'none')
	document.getElementById('QButton').removeEventListener('click', function() {promote(from, to, from.color|5)})
	document.getElementById('RButton').removeEventListener('click', function() {promote(from, to, from.color|4)})
	document.getElementById('BButton').removeEventListener('click', function() {promote(from, to, from.color|3)})
	document.getElementById('NButton').removeEventListener('click', function() {promote(from, to, from.color|2)})
}

function castle(from, to) {
	irreversible = plyNumber
	var newMove = new Ply(from, to)
	
	var movedColor = from.color
	if(to.id>from.id) {
		boardContent[from.id].changePiece(0)
		boardContent[from.id+1].changePiece(movedColor|4)
		boardContent[from.id+2].changePiece(movedColor|6)
		boardContent[from.id+3].changePiece(0)
	}
	else {
		boardContent[from.id].changePiece(0)
		boardContent[from.id-1].changePiece(movedColor|4)
		boardContent[from.id-2].changePiece(movedColor|6)
		boardContent[from.id-3].changePiece(0)
		boardContent[from.id-4].changePiece(0)
	}
	if(movedColor==0) {
		K = false
		Q = false
	}
	else {
		k = false
		q = false
	}
	newMove.pushPosition()
	pickedUp = false
	pickedUpSquare = null
	moveColor = moveColor^8
	plyNumber++
	moveList.push(newMove)
	presentBoard()
}

function selectSquare(e) {
	var selectedSquare
	if(e.target.tagName=='IMG')
		selectedSquare = e.target.parentElement
	else if(e.target.tagName=='TD')
		selectedSquare = e.target
	else
		return null;
	if(selectedSquare.getAttribute('id')=='blank')
		return null;
	var squareId = Number(selectedSquare.getAttribute('id'))
	if(!pickedUp) {
		if(boardContent[squareId].pieceId==0)
			return null;
		if(boardContent[squareId].color===moveColor) {
			pickedUpSquare = squareId
			pickedUp = true
			presentBoard()
		}
	}
	else {
		var from = boardContent[pickedUpSquare]
		var to = boardContent[squareId]
		if(!from.legalTarget.includes(to.id)) {
			pickedUp = false
			pickedUpSquare = null
			presentBoard()
			return null
		}
		if((from.pieceId==1 && to.rank==8)||(from.pieceId==9 && to.rank==1))
			choosePromote(from,to)
		else if(from.pieceType==6 && Math.abs(from.id-to.id)==2)
			castle(from, to)
		else
			move(from, to)
	}
}

function Undo() {
	if(moveList.length==0)
		return null
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

	if((lastMove.fromPiece-lastMove.fromColor)==6 && (lastMove.toSquare-lastMove.fromSquare)==2) {
		boardContent[lastMove.fromSquare+1].changePiece(0)
		boardContent[lastMove.fromSquare+3].changePiece(lastMove.fromColor|4)
	}
	if((lastMove.fromPiece-lastMove.fromColor)==6 && (lastMove.toSquare-lastMove.fromSquare)==(-2)) {
		boardContent[lastMove.fromSquare-1].changePiece(0)
		boardContent[lastMove.fromSquare-3].changePiece(0)
		boardContent[lastMove.fromSquare-4].changePiece(lastMove.fromColor|4)
	}

	if(lastMove.fromPiece%8==1 && lastMove.eP===lastMove.toSquare) {
		if(lastMove.fromColor===0)
			{boardContent[lastMove.eP+8].changePiece(9)}
		else if(lastMove.fromColor==8)
			{boardContent[lastMove.eP-8].changePiece(1)}
	}
	enPassant = lastMove.eP
	K = lastMove.castling[0]
	Q = lastMove.castling[1]
	k = lastMove.castling[2]
	q = lastMove.castling[3]
	irreversible = lastMove.irr
	fiftyMove = lastMove.fmr

	moveList.splice(moveList.length-1, 1)
	
	moveColor = moveColor ^ 8
	plyNumber--
}

function UndoButton() {
	Undo()
	pickedUp = false
	pickedUpSquare = null
	presentBoard()
}

function newGame() {
	$('#ModalBox1').css('display', 'none')
	$('#ResultType').html('')
	$('#ResultDesc').html('')
	startingPosition()
	document.getElementById('undo').addEventListener('click', UndoButton)
	document.getElementById('ChessBoard').addEventListener('click', selectSquare)
}


document.getElementById('undo').addEventListener('click', UndoButton)
document.getElementById('ChessBoard').addEventListener('click', selectSquare)
document.getElementById('newGameButton').addEventListener('click', newGame)
document.getElementById('seeBoardButton').addEventListener('click', function() {
	$('#undo').css('display', 'none')
	$('#ShowResult').css('display', 'block')
	$('#ModalBox1').css('display', 'none')
})
document.getElementById('ShowResult').addEventListener('click', function() {
	$('#undo').css('display', 'block')
	$('#ShowResult').css('display', 'none')
	$('#ModalBox1').css('display', 'block')
})
/*document.getElementById('Checkmate').addEventListener('click', function() {
	GameResult('Checkmate')
})
document.getElementById('Stalemate').addEventListener('click', function() {
	GameResult('Stalemate')
})*/
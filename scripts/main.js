$('document').ready(function(){

var deleteMode = false,
row = "<div class='row'>\
				<div class='row-delete'><i>x</i></div>\
				<div class='string-names'>\
					<i>e</i><i>B</i><i>G</i><i>D</i><i>A</i><i>E</i>\
				</div>\
				<div class='lines'></div>\
			</div>",
node = "<div class='node'><div class='line'><p></p></div><div class='line'><p></p></div><div class='line'><p></p></div><div class='line'><p></p></div><div class='line'><p></p></div><div class='line'><p></p></div></div>"

// determine correct # of nodes to create, based on screen width
var lineWidth,
nodeWidth = 32,
numberOfNodes;

getNumberOfNodes()

function getNumberOfNodes(){
	lineWidth = $('.paper').outerWidth();
	numberOfNodes = Math.round(lineWidth / nodeWidth);
}

// recalculate # of nodes on window resize
$(window).resize(function(){
	getNumberOfNodes();
});

// make initial row on load
newRow();

// make a new row
$('.btn-new-row').click(function(){
	newRow();
});

function newRow(){
	$('.paper').append(row);
	for (var i = 0; i < numberOfNodes; i++) {
		$('.row:last-child .lines').append(node);
	}
	$('.node:last-child .line').addClass('last-one'); //this is for the ascii stuff
};

// row delete button
$('.paper').on('click', '.row-delete', function(){
	$(this).parents('.row').css({
		'display':'none'
	});
});

// show fret dot on click
var fretNums = []; //keep track of the numbers for when the noteMode occurs
$('.paper').on('click', '.line', function(){
	if (noteMode) {
		switchNoteMode();
	} 
	for (var i = 0; i < 27; i++) {
		/*$(this).removeClass('line-active-' + i);*/

	}
	if (deleteMode) {
		$(this).removeClass('line-active');
	} else {
		$(this).addClass('line-active');
		$(this).find('p').text(currentFret);
	}
	fretNums = [];
	$('.line-active').each(function(){			
		fretNums.push($(this).find('p').text());
	});
});

// style 0 fret selector
$('.fret-select p.fret-0').addClass('selected-fret');

// select a fret chart
var currentFret = 0,
newFret,
chartElement;
$('.panel').on('click', '.fret-select p', function(){
	var num = $(this).html();
	selectFret(num);
});

// select a fret with the keyboard
var twoDigit = [],
twoDigitDelay = false;
$(document).keydown(function(e){	
	var keyCode = e.keyCode;
	chartElement = $('.fret-select p.fret-'+keyCode);
	if (keyCode >= 48 && keyCode <= 57) {
		convertKeyCodeTop(keyCode);
	} else if (keyCode == 46) {
		deleteModeSwitch();
	} else if (keyCode >= 96 && keyCode <= 105) {
		convertKeyCodeSide(keyCode);
	}	
	twoDigitDelay = true;
	setTimeout(function(){
		twoDigitDelay = false;
		twoDigit = [];
	}, 1000);
});

function convertKeyCodeTop(k){
	num = (k - 48);
	delayHandler(num);
}
function convertKeyCodeSide(k){
	num = (k - 96);
	delayHandler(num);
}

function delayHandler(num){
	if (twoDigitDelay) {
		twoDigit.push(num);
		num = twoDigit[0].toString() + twoDigit[1].toString();
	} else {
		twoDigit.push(num);
	}	
	selectFret(num);	
}

function selectFret(num){
	if (num <= 24) {
		$('.fret-select p').removeClass('selected-fret');
		chartElement = $('.fret-select p.fret-' + num);
		$(chartElement).addClass('selected-fret');
		newFret = $(chartElement).html();
		currentFret = newFret;
	}
}

// delete button
$('.btn-delete').click(function(){
	deleteModeSwitch();
});

function deleteModeSwitch(){
	if (deleteMode) {
		deleteMode = false;
	} else {
		deleteMode = true;
	}
	$('.btn-delete').toggleClass('delete-button-active');
	$('.delete-message').toggle();
}

// clear all
$('.btn-clear').click(function(){
	if (window.confirm("Clear all of your tabs?")) {
		$('.node > div').removeClass().addClass('line').find('p').text('');
	}
});

//show note names
var strings = ['E', 'B', 'G', 'D', 'A', 'E'],
notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
note,
newNote,
fret,
i,
countNext,
noteMode = false,
stringNum;
$('.btn-notes').click(function(){
	switchNoteMode();
});
function switchNoteMode() {
	if (noteMode) {
		noteMode = false;
		$('.btn-notes').text("Show Note Names");
		var i = 0;
		$('.line-active').each(function(){
			$(this).find('p').text(fretNums[i]);
			i++;			
		});
	} else {
		noteMode = true;
		$('.btn-notes').text("Back to Fret Numbers");
		$('.line-active').each(function(){
			countNext = $(this).nextAll().size();
			stringNum = 6 - countNext;
			stringName = strings[stringNum - 1];
			switch (stringName){
				case 'E':
				i = 7;
				break;
				case 'B':
				i = 2;
				break;
				case 'G':
				i = 10;
				break;
				case 'D':
				i = 5;
				break;
				case 'A':
				i = 0;
				break;
			}
			fret =  parseInt($(this).find('p').text());
			newNote = (notes[i + fret]);			
			$(this).find('p').text(newNote);
		}); 
	}				
}	

// convert to ascii
$('.btn-ascii').click(function(){	
	var asciiList = [];
	$('.row').each(function(){
		var lineNote;
		for (var n = 1; n < 7; n++) {
			switch (n) {
				case 1:
				lineNote = 'e';
				break;
				case 2:
				lineNote = 'B';
				break;
				case 3:
				lineNote = 'G';
				break;
				case 4:
				lineNote = 'D';
				break;
				case 5:
				lineNote = 'A';
				break;
				case 6:
				lineNote = 'E';
				break;
			}			
			asciiList.push(lineNote + ' |');
			$(this).find('.node').each(function(i){			
				$(this).find('.line:nth-child('+ n +')').each(function(){
					var theText = $(this).find('p').text();
					if (theText == '') {
						asciiList.push('----');
						if ($(this).hasClass('last-one')) {
							asciiList.push('\n');
						}
					} else {
						if (theText.length == 1) {
							theText = '-' + theText + '--';
						} else {
							theText = '-' + theText + '-';
						}
						asciiList.push(theText);
						if ($(this).hasClass('last-one')) {
							asciiList.push('\n');
						}
					}
				});
			});
		}
		asciiList.push('\n\n');				
		var asciiString = asciiList.join("");			
		$('.ascii-pad').html(asciiString);
	});
	console.log(asciiList);

	$('.ascii-container').show();

});

$('.close-ascii').click(function(){
	$('.ascii-container').hide();
	$('.ascii-pad').html('');
});


}); // end ready
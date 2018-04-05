var ansValid = [
	"Enter full name", // 0
	"Enter M or F", // 1
	"Enter date of death", // 2
	"Enter Y or N", // 3
	"Separate names with comma(,)", // 4
	"Enter positive number", // 5
];

var qaTemplate = [
	{
		'q': "What is the decedent's name?",
		'ph': 0,
		'vname': 'Name',
	}, // 0
	{
		'q': "Was decedent male or famale?",
		'ph': 1,
		'vname': 'Gender',
	}, // 1
	{
		'q': "What is the date of death of a decedent?",
		'ph': 2,
		'vname': 'DeathDate',
	}, // 2
	{
		'q': "Did the Decedent have biological or legally adopted children?",
		'ph': 3,
		'vname': 'HasChild',
	}, // 3
	{
		'q': "What are the names of the kids?",
		'ph': 4,
		'vname': 'NameKids',
	}, // 4
	{
		'q': "Was the decedent married when he/she died?",
		'ph': 3,
		'vname': 'Married',
	}, // 5
	{
		'q': "What is the name of the Spouse?",
		'ph': 0,
		'vname': 'NameSpouse',
	}, // 6
	{
		'q': "Was the Decedent survived by parent(s)?",
		'ph': 3,
		'vname': 'Survived',
	}, // 7
	{
		'q': "What are the parents' names?",
		'ph': 4,
		'vname': 'NameParents',
	}, // 8
	{
		'q': "Does the decedent have any sibling(s), whether currently living or not?",
		'ph': 3,
		'vname': 'HasSibling',
	}, // 9
	{
		'q': "How many living siblings does the decedent have?",
		'ph': 5,
		'vname': 'NumLivingSiblings',
	}, // 10
	{
		'q': "What are the living siblings' names?",
		'ph': 4,
		'vname': 'NamesLivingSiblings',
	}, // 11
	{
		'q': "How Many deceased siblings does the decedent have?",
		'ph': 5,
		'vname': 'NumDeadSiblings',
	}, // 12
	{
		'q': "What are the deceased siblings' names?",
		'ph': 4,
		'vname': 'NamesDeadSiblings',
	}, // 13
	{
		'q': "Did DEAD SIB #K have any children?",
		'ph': 3,
		'vname': 'HadDeadSibChild',
		'dsnum': 1,
		'value': null
	}, // 14
	{
		'q': "How many children does DEAD SIB #K have?",
		'ph': 5,
		'vname': 'NumDeadSibChild',
		'dsnum': 1,
		'value': null
	}, // 15
	{
		'q': "What are the names of kis of DEAD SIB #K?",
		'ph': 4,
		'vname': 'NamesDeadSibChild',
		'dsnum': 1,
		'value': null
	}, // 16
];

for (var i = 0; i < qaTemplate.length; i++) {
	qaTemplate['value'] = null;
}

var qaProgress = [qaTemplate[0]];

function determineNextQuery(lastQuery, lastAnswer) {
	var numNextQ = -1;
	switch (lastQuery) {
		case "Name":
			numNextQ = 1;
			break;
		case "Gender":
			numNextQ = 2;
			break;
		case "DeathDate":
			numNextQ = 3;
			break;
		case "HasChild":
			if (lastAnswer == 'Y')
				numNextQ = 4;
			else
				numNextQ = 5;
			break;
		case "NameKids":
			numNextQ = 5;
			break;
		case "Married":
			if (lastAnswer == 'Y')
				numNextQ = 6;
			else if (qaProgress[3]['value'] == 'Y')
				numNextQ = -1;
			else
				numNextQ = 7;
			break;
		case "NameSpouse":
			numNextQ = -1;
			break;
		case "Survived":
			if (lastAnswer == 'Y')
				numNextQ = 8;
			else
				numNextQ = 9;
			break;
		case "NameParents":
			break;
		case "HasSibling":
			if (lastAnswer == 'Y')
				numNextQ = 10;
			break;
		case "NumLivingSiblings":
			if (lastAnswer > 0)
				numNextQ = 11;
			else
				numNextQ = 12;
			break;
		case "NamesLivingSiblings":
			numNextQ = 12;
			break;
		case "NumDeadSiblings":
			if (lastAnswer > 0) 
				numNextQ = 13
			break;
		case "NamesDeadSiblings":
			numNextQ = 14
			break;
		case "HadDeadSibChild":
			if (lastAnswer == 'Y')
				numNextQ = 15;
			else
				numNextQ = 14;
			break;
		case "NumDeadSibChild":
			numNextQ = 16;
			break;
		case "NamesDeadSibChild":
			numNextQ = 14
			break;
		default:
			numNextQ = -1;
	}

	var nextQuery = numNextQ == -1 ? null : qaTemplate[numNextQ];

	if (numNextQ == 14) {
		var lastDsNum = qaProgress[qaProgress.length - 1]['dsnum'];
		var numDeadSibs = getAnswerByQName("NumDeadSiblings");
		console.log('lastDsNum', lastDsNum);
		console.log('numDeadSibs', numDeadSibs);

		if (lastDsNum && numDeadSibs && lastDsNum >= numDeadSibs)
			return null;

		if (!lastDsNum)
			lastDsNum = 1;
		else
			lastDsNum ++;

		nextQuery = populateDSNumToQuery(lastDsNum, nextQuery);
	}

	if (numNextQ == 15 || numNextQ == 16) {
		var lastDsNum = qaProgress[qaProgress.length - 1]['dsnum'];
		if (lastDsNum) 
			nextQuery = populateDSNumToQuery(lastDsNum, nextQuery);
	}

	return nextQuery;
}

function populateDSNumToQuery(dsNum, query) {
	var newQuery = {};
	for (key in query)
		newQuery[key] = query[key]

	newQuery['q'] = query['q'].replace("#K", dsNum);
	newQuery['dsnum'] = dsNum;
	return newQuery;
}

function getAnswerByQName(qname) {
	for (var i = 0; i < qaProgress.length; i++) {
		if (!qaProgress[i]) continue;
		if (qaProgress[i]['vname'] == qname)
			return qaProgress[i]['value'];
	}
	return null;
}

function validateAnswer(answer, validNum) {
	answer = answer.trim();
	if (answer.length == 0)
		return false;
	switch (validNum) {
		case 1:
			return answer=='M' || answer=='F';
		case 3:
			return answer=='Y' || answer=='N';
		case 5:
			return parseInt(answer) == answer;
		default:
			return true;
	}
}

function showOutputString() {
	var strOutput = "<div class='h3'>Output</div>";
	for (var i = 0; i < qaProgress.length; i++) {
		if (!qaProgress[i]) continue;
		if (i == 3) {
			strOutput += qaProgress[0]['value'] + " was a ";
			strOutput += (qaProgress[1]['value']=='M'?'male':'famale') + " died on ";
			strOutput += qaProgress[2]['value'] + ".<br>";
		}
		if (qaProgress[i]['vname'] == 'HasChild' && qaProgress[i]['value'] == 'N')
			strOutput += "The Decedent had no biological or legally adopted children.<br>";
		
		if (qaProgress[i]['vname'] == 'Married' && qaProgress[i]['value'] == 'N')
			strOutput += "The Decedent was not married.<br>";

		if (qaProgress[i]['vname'] == 'Survived' && qaProgress[i]['value'] == 'Y')
			strOutput += "Parents inherit te estate.<br>";

		if (qaProgress[i]['vname'] == 'HasSibling' && qaProgress[i]['value'] == 'N')
			strOutput += "You indicated that the decedent has no living or deceased siblings! Let’s talk about aunts and uncles.<br>";

		if (qaProgress[i]['vname'] == 'NumDeadSiblings' && qaProgress[i]['value'] > 0) {
			var numDeadSibs = parseInt(qaProgress[i]['value']);
			var numLivingSibs = parseInt(getAnswerByQName('NumLivingSiblings'));
			if (numLivingSibs > 0)
			strOutput += "There are "+numLivingSibs+" living siblings, and "+qaProgress[i]['value']+" deceased siblings of the decedent.<br>";

			strOutput += "The living siblings will each inherit 1/"+(numLivingSibs+numDeadSibs)+" of the estate.<br>";
		}

		if (qaProgress[i]['dsnum'] && qaProgress[i]['vname'] == 'NumDeadSibChild' && qaProgress[i]['value'] > 0) {
			strOutput += "The children of DEAD SIB "+qaProgress[i]['dsnum']+" will each inherit (1/"+(parseInt(getAnswerByQName('NumLivingSiblings'))+parseInt(getAnswerByQName('NumDeadSiblings')))+") * (1/"+parseInt(qaProgress[i]['value'])+").<br>";
		}
	}

	$('.output').html(strOutput);
}

var curStep = 0;
$(document).ready(function(){
	showStep(0);
	$('#txtAnswer').focus();

	$('#btnNext').click(function() {
		if ( !validateAnswer( $('#txtAnswer').val(), qaProgress[curStep]['ph'] ) ) {
			$('.form-group').addClass('has-error');
			alert (ansValid[qaProgress[curStep]['ph']]);
			return;
		}
		else
			$('.form-group').removeClass('has-error');

		qaProgress[curStep]['value'] = $('#txtAnswer').val();
		showDecInfo();

		qaProgress[curStep+1] = determineNextQuery(qaProgress[curStep]['vname'], qaProgress[curStep]['value']);
		if (qaProgress[curStep+1] === null) {
			showOutputString();
			$('#btnNext').toggle(false);
			return;
		}

		curStep++;
		showStep(curStep);
	});

	$('#btnPrev').click(function() {
		if (qaProgress[curStep] && $('#txtAnswer').val()) {
			qaProgress[curStep]['value'] = $('#txtAnswer').val();
			showDecInfo();
		}

		curStep--;
		showStep(curStep);
	});

	$('#txtAnswer').on("keypress", function (e) {
	    if (e.keyCode == 13) {
	    	$('#btnNext').click();
	    }
	});

	function showStep (stepNum) {

		var stepData = qaProgress[stepNum];
		$('#labelQ').html(stepData['q']);
		$('#txtAnswer').attr('placeholder', ansValid[stepData['ph']]);
		if (stepData['value'])
			$('#txtAnswer').val(stepData['value']);
		else
			$('#txtAnswer').val('');	

		if (stepNum == 0) {
			$('#btnPrev').hide();
			$('#btnNext').show();
		}
		else
			$('#btnPrev').show();
		
		$('#txtAnswer').focus();
	}

	function showDecInfo() {
		var str = '';
		for (var i = 0; i < qaProgress.length; i++) {
			if (!qaProgress[i])
				continue;
			
			if (qaProgress[i]['value'])
				str += "<br />" + qaProgress[i]['vname'] + ": " + qaProgress[i]['value'];
		}

		$("#divInfo").html(str);

		var hasOutput = true;
		for (var i = 0; i < 3; i++) {
			hasOutput = hasOutput && qaProgress[i] && qaProgress[i]['value'];
		}
		if (hasOutput) {
			strOutput = qaProgress[0]['value'] + " who was a ";
			strOutput += qaProgress[1]['value'] == 'M' ? 'male' : 'famale';
			strOutput += " died on " + qaProgress[2]['value'];
		}
	}
});
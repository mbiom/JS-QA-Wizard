var qaTemplate = [
	{
		'q': "What is the decedent's name?",
		'ph': "Enter full name",
		'vname': 'Name',
	}, // 0
	{
		'q': "Was decedent male or famale?",
		'ph': "Enter M or F",
		'vname': 'Gender',
	}, // 1
	{
		'q': "What is the date of death of a decedent?",
		'ph': "Enter date of death",
		'vname': 'DeathDate',
	}, // 2
	{
		'q': "Did the Decedent have biological or legally adopted children?",
		'ph': "Enter Y or N",
		'vname': 'HasChild',
	}, // 3
	{
		'q': "What are the names of the kids?",
		'ph': "Separate names with comma(,)",
		'vname': 'NameKids',
	}, // 4
	{
		'q': "Was the decedent married when he/she died?",
		'ph': "Enter Y or N",
		'vname': 'Married',
	}, // 5
	{
		'q': "What is the name of the Spouse?",
		'ph': "Enter name",
		'vname': 'NameSpouse',
	}, // 6
	{
		'q': "Was the Decedent survived by parent(s)?",
		'ph': "Enter Y or N",
		'vname': 'Survived',
	}, // 7
	{
		'q': "What are the parents' names?",
		'ph': "Enter names",
		'vname': 'NameParents',
	}, // 8
	{
		'q': "Does the decedent have any sibling(s), whether currently living or not?",
		'ph': "Enter Y or N",
		'vname': 'HasSibling',
	}, // 9
	{
		'q': "How many living siblings does the decedent have?",
		'ph': "Enter number",
		'vname': 'NumLivingSiblings',
	}, // 10
	{
		'q': "How Many deceased siblings does the decedent have?",
		'ph': "Enter number",
		'vname': 'NumDeceasedSiblings',
	}, // 11
];

for (var i = 0; i < qaTemplate.length; i++) {
	qaTemplate['value'] = null;
}

var qaProgress = [qaTemplate[0]];
var strOutput = [];

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
			numNextQ = 11;
		default:
			numNextQ = -1;
	}

	var nextQuery = numNextQ == -1 ? null : qaTemplate[numNextQ];
	return nextQuery;
}

var curStep = 0;
$(document).ready(function(){
	showStep(0);

	$('#btnNext').click(function() {
		if ($('#txtAnswer').val()) {
			qaProgress[curStep]['value'] = $('#txtAnswer').val();
			showDecInfo();
		}

		qaProgress[curStep+1] = determineNextQuery(qaProgress[curStep]['vname'], qaProgress[curStep]['value']);
		if (qaProgress[curStep+1] === null) {
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
		$('#txtAnswer').attr('placeholder', stepData['ph']);
		if (stepData['value'])
			$('#txtAnswer').val(stepData['value']);
		else
			$('#txtAnswer').val('');	

		$('#btnPrev').toggle(stepNum>0);
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
	}
});
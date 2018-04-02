var baseData = [
	{
		'q': "What is the decedent's name?",
		'ph': "Enter full name",
		'vname': 'Name',
	},
	{
		'q': "Was decedent male or famale?",
		'ph': "Enter M or F",
		'vname': 'Gender',
	},
	{
		'q': "What is the date of death of a decedent?",
		'ph': "Enter date of death",
		'vname': 'DeathDate',
	},
	{
		'q': "Did the Decedent have biological or legally adopted children?",
		'ph': "Enter Y or N",
		'vname': 'HadChild',
	},
	{
		'q': "Was the decedent married when he/she died?",
		'ph': "Enter Y or N",
		'vname': 'Married',
	},
	{
		'q': "Was the Decedent survived by parent(s)?",
		'ph': "Enter Y or N",
		'vname': 'Survived',
	},
	{
		'q': "Does the decedent have any sibling(s), whether currently living or not?",
		'ph': "Enter Y or N",
		'vname': 'HadSibling',
	},
	{
		'q': "How many living siblings does the decedent have?",
		'ph': "Enter number",
		'vname': 'LivingSiblings',
	},
	{
		'q': "How Many deceased siblings does the decedent have?",
		'ph': "Enter number",
		'vname': 'DeceasedSiblings',
	},
];

for (var i = 0; i < baseData.length; i++) {
	baseData['value'] = null;
}

var curStep = 0;
$(document).ready(function(){
	showStep(0);

	$('#btnNext').click(function() {
		if ($('#txtAnswer').val()) {
			baseData[curStep]['value'] = $('#txtAnswer').val();
			showDecInfo();
		}

		curStep++;
		showStep(curStep);
	});

	$('#btnPrev').click(function() {
		if ($('#txtAnswer').val()) {
			baseData[curStep]['value'] = $('#txtAnswer').val();
			showDecInfo();
		}

		curStep--;
		showStep(curStep);
	});

	function showStep (stepNum) {
		var stepData = baseData[stepNum];
		$('#labelQ').html(stepData['q']);
		$('#txtAnswer').attr('placeholder', stepData['ph']);

		$('#btnPrev').toggle(stepNum>0);
		$('#btnNext').toggle(stepNum<baseData.length-1);
		
		$('#txtAnswer').val('');
		$('#txtAnswer').focus();
	}

	function showDecInfo() {
		var str = '';
		for (var i = 0; i < baseData.length; i++) {
			if (baseData[i]['value'])
				str += "<br />" + baseData[i]['vname'] + ": " + baseData[i]['value'];
		}

		$("#divInfo").html(str);
	}
});
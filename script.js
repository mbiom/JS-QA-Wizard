
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
			$('#txtAnswer').datepicker({ dateFormat: "M d, yy" });
			numNextQ = 2;
			break;
		case "DeathDate":
			$('#txtAnswer').datepicker( "destroy" );
			numNextQ = 3;
			break;
		case "HasChild":
			numNextQ = 4;
			break;
		// case "NameKids":
		// 	numNextQ = 5;
		// 	break;
		case "Married":
			if (lastAnswer.toLowerCase() == 'y')
				numNextQ = 5;
			else if (qaProgress[3]['value'].toLowerCase() == 'y')
				numNextQ = -1;
			else
				numNextQ = 6;
			break;
		case "NameSpouse":
			numNextQ = -1;
			break;
		case "Survived":
			if (lastAnswer.toLowerCase() == 'y')
				numNextQ = 7;
			else
				numNextQ = 8;
			break;
		case "NameParents":
			break;
		case "HasSibling":
			if (lastAnswer.toLowerCase() == 'y')
				numNextQ = 9;
			break;
		case "NumLivingSiblings":
			if (lastAnswer > 0)
				numNextQ = 10;
			else
				numNextQ = 11;
			break;
		case "NamesLivingSiblings":
			numNextQ = 11;
			break;
		case "NumDeadSiblings":
			if (lastAnswer > 0) 
				numNextQ = 12
			break;
		case "NamesDeadSiblings":
			numNextQ = 13
			break;
		case "HadDeadSibKids":
			if (lastAnswer.toLowerCase() == 'y')
				numNextQ = 14;
			else
				numNextQ = 13;
			break;
		case "NumDeadSibKids":
			numNextQ = 15;
			break;
		case "NamesDeadSibKids":
			numNextQ = 13
			break;
		default:
			numNextQ = -1;
	}

	var nextQuery = numNextQ == -1 ? null : qaTemplate[numNextQ];

	if (numNextQ == 13) {
		var lastDsNum = qaProgress[qaProgress.length - 1]['dsnum'];
		var numDeadSibs = getAnswerByQName("NumDeadSiblings");

		if (lastDsNum && numDeadSibs && lastDsNum >= numDeadSibs)
			return null;

		if (!lastDsNum)
			lastDsNum = 1;
		else
			lastDsNum ++;

		nextQuery = populateDSNumToQuery(lastDsNum, nextQuery);
	}

	if (numNextQ == 14 || numNextQ == 15) {
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
			return answer.toLowerCase()=='m' || answer.toLowerCase()=='f';
		case 3:
			return answer.toLowerCase()=='y' || answer.toLowerCase()=='n';
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

		if (qaProgress[i]['dsnum'] && qaProgress[i]['vname'] == 'NumDeadSibKids' && qaProgress[i]['value'] > 0) {
			strOutput += "The children of DEAD SIB "+qaProgress[i]['dsnum']+" will each inherit (1/"+(parseInt(getAnswerByQName('NumLivingSiblings'))+parseInt(getAnswerByQName('NumDeadSiblings')))+") * (1/"+parseInt(qaProgress[i]['value'])+").<br>";
		}
	}

	$('.output').html(strOutput);
}

function processSubQuery() {
	if ($('#txtAnswer').val().toLowerCase() != 'y')
		return true;

	var curQa = qaProgress[curStep]['subq'];
	if (!$('#frm-subquery').is(":visible")) {
		$('#frm-subquery').show();
		$('#labelSubQ').html(curQa['q']);
		$('#txtSubAnswer').attr('placeholder', ansValid[curQa['ph']]);
		$('#txtSubAnswer').focus();
		return;
	}

	if ( !(parseInt($('#txtSubAnswer').val().trim()) > 0) ) {
		alert (ansValid[curQa['ph']]);
		return;
	}

	if (!$('#div-sub-serial').is(":visible")) {
		$('#div-sub-serial').show();
		var cntSerial = parseInt($('#txtSubAnswer').val());
		for (var i = 0; i < cntSerial; i++) {
			$('#div-sub-serial').append(
				"<input type='text' class='form-control answer-serial' num='"
				+ i + "' placeholder='Name of Child " + (i+1) + "'>");
		}
		return;
	}

	if ( $('#div-sub-serial').is(":visible") ) {
		var cntSerial = parseInt($('#txtSubAnswer').val());
		var arrValAns = [];
		for (var i = 0; i < cntSerial; i++) {
			valAns = $(".answer-serial[num='"+i+"']").val().trim();
			if (!valAns) {
				alert ("Please fill every input!");
				return;
			}
			arrValAns.push(valAns);
		}

		qaProgress[curStep]['subq']['value'] = arrValAns;
		$('#frm-subquery').hide();
		return true;
	}
}

var curStep = 0;
$(document).ready(function(){
	showStep(0);
	$('#txtAnswer').focus();

	$('#btnNext').click(function() {
		// detect if query has sub query
		if (qaProgress[curStep]['subq']) {
			if (!processSubQuery())
				return;
		}

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
			console.log(qaProgress);
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
			strOutput += qaProgress[1]['value'].toLowerCase() == 'm' ? 'male' : 'famale';
			strOutput += " died on " + qaProgress[2]['value'];
		}
	}
});
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
		'vname': 'DeathDate'
	}, // 2
	{
		'q': "Did the Decedent have biological or legally adopted children?",
		'ph': 3,
		'vname': 'HasChild',
		'subq': {
			'q': "How many children did the Decedent have?",
			'ph': 5,
			'vname': 'NumChildren',
			'subq': {
				'q': "What are the names of the kids?",
				'ph': 0,
				'vname': 'NameKids',
			} 
		}
	}, // 3
	{
		'q': "Was the decedent married when he/she died?",
		'ph': 3,
		'vname': 'Married',
	}, // 4
	{
		'q': "What is the name of the Spouse?",
		'ph': 0,
		'vname': 'NameSpouse',
	}, // 5
	{
		'q': "Was the Decedent survived by parent(s)?",
		'ph': 3,
		'vname': 'Survived',
	}, // 6
	{
		'q': "What are the parents' names?",
		'ph': "Enter names",
		'vname': 'NameParents',
	}, // 7
	{
		'q': "Does the decedent have any sibling(s), whether currently living or not?",
		'ph': 3,
		'vname': 'HasSibling',
	}, // 8
	{
		'q': "How many living siblings does the decedent have?",
		'ph': 5,
		'vname': 'NumLivingSiblings',
	}, // 9
	{
		'q': "What are the living siblings' names?",
		'ph': 4,
		'vname': 'NamesLivingSiblings',
	}, // 10
	{
		'q': "How Many deceased siblings does the decedent have?",
		'ph': 5,
		'vname': 'NumDeadSiblings',
	}, // 11
	{
		'q': "What are the deceased siblings' names?",
		'ph': 4,
		'vname': 'NamesDeadSiblings',
	}, // 12
	{
		'q': "Did DEAD SIB #K have any children?",
		'ph': 3,
		'vname': 'HadDeadSibKids',
		'dsnum': 1,
		'value': null
	}, // 13
	{
		'q': "How many children does DEAD SIB #K have?",
		'ph': 5,
		'vname': 'NumDeadSibKids',
		'dsnum': 1,
		'value': null
	}, // 14
	{
		'q': "What are the names of kids of DEAD SIB #K?",
		'ph': 4,
		'vname': 'NamesDeadSibKids',
		'dsnum': 1,
		'value': null
	}, // 15
];

var ansValid = [
	"Enter full name", // 0
	"Enter M or F", // 1
	"Enter date of death", // 2
	"Enter Y or N", // 3
	"Separate names with comma(,)", // 4
	"Enter positive number", // 5
];

// var answers = {
// 	'Name': null,
// 	'Gender': null,
// 	...
// 	'HasSibling': 'Y',
// 	'NumLivingSiblings': 4,
// 	'NamesLivingSiblings': ['Hid', 'Gitt', 'Pat', 'Ham'],
// 	'NumDeadSiblings': 3,
// 	'NamesDeadSiblings': ['Gen', 'Mah', 'Aah'],
// 	'HadDeadSibKids1': 'Y',
// 	'NumDeadSibKids1', 2,
// 	'HadDeadSibKids2': 'N',
// 	'HadDeadSibKids3': 'Y',
// 	'NumDeadSibKids3', 4,
// };
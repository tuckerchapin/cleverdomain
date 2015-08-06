var query, tlds, inputField, suggestionSuccess, suggestionFailed, suggestionField, unoriginalSuggestionField, getTLds, resultsFound = [];

var suggestionResultTemplate = $("<a>",{
	"class": "suggestion-result",
	"href": "",
	"target": "_blank"
});
$("<span>",{"class": "suggestion-label"}).appendTo(suggestionResultTemplate);
$("<span>",{"class": "suggestion-availability"}).appendTo(suggestionResultTemplate);

var commontlds = [
	".com",
	".io",
	".me",
	".app"
];

$(document).ready(function() {
	$("#input-field").change(generateDomain);
	inputField = $("#input-field");
	inputField.val("");
	suggestionSuccess = $("#suggestion-success");
	suggestionSuccess.hide();
	suggestionFailed = $("#suggestion-failed");
	suggestionFailed.hide();
	suggestionField = $("#suggestion-field");
	unoriginalSuggestionField = $("#unoriginal-suggestion-field");
	query = $(document).getUrlParam("q");
});
	
$.get( "tlds-alpha-by-domain.txt", function(response) {
	tlds = response.toLowerCase().split("\n");
	tlds.splice(0, 1);
	tlds.splice(tlds.length - 1, 1);
	if (query) {
		inputField.val(query);
		generateDomain();
	}
});

function generateDomain() {
	var text = inputField.val().split(' ').join('').split('.').join('').toLowerCase();
	
	if (text.length == 0) {
		suggestionField.hide();
		document.title = "Create a clever domain name";
		history.pushState("", text, "?q=" + text);
		inputField.focus();
		suggestionFailed.hide();
		suggestionSuccess.hide();
		return;
	}
	
	inputField.val(text);
	history.pushState("", text, "?q=" + text);
	document.title = 'Cleverize "' + text + '"';
	
	resultsFound = [];
	suggestionField.empty();
	unoriginalSuggestionField.empty();
	for (var i = 0; i < tlds.length; i++) {
		var textBase = text.substring(0, text.length - tlds[i].length);
		var compairTail = text.substring(text.length - tlds[i].length);
		if (tlds[i] == compairTail) {
			var cleverized;
			if (tlds[i] == text) {
				cleverized = text + "." + text;
			} else {
				cleverized = textBase + "." + compairTail;
			}
			/*
$.ajax({
				url: "https://jsonp.afeld.me",
				data: {
					url: "http://freedomainapi.com/?key=j5qf0n7t3a&domain=" + cleverized
				},
				dataType: "json",
				success: function(response) {
					console.log(response);
				}
			});
*/
			var suggestionResult = suggestionResultTemplate.clone();
			suggestionResult.attr("id",cleverized);
			suggestionResult.attr("href","https://www.namecheap.com/domains/registration/results.aspx?aff=89293&domain=" + cleverized);
			suggestionResult.children().eq(0).html(cleverized);
			suggestionResult.children().eq(1).html("");
			suggestionResult.appendTo(suggestionField);
			resultsFound.push(cleverized);
		}
	}
	
	if (resultsFound.length != 0) {
		inputField.blur();
		suggestionFailed.hide();
		suggestionSuccess.show();
	} else {
		for (var i = 0; i < commontlds.length; i++) {
			var unoriginalSuggestion = text + commontlds[i];
			/*
$.ajax({
				url: "https://jsonp.afeld.me",
				data: {
					url: "http://freedomainapi.com/?key=j5qf0n7t3a&domain=" + unoriginalSuggestion
				},
				dataType: "json",
				success: function(response) {
					console.log(response);
				}
			});
*/
			var suggestionResult = suggestionResultTemplate.clone();
			suggestionResult.attr("id",unoriginalSuggestion);
			suggestionResult.attr("href","https://www.namecheap.com/domains/registration/results.aspx?aff=89293&domain=" + unoriginalSuggestion);
			suggestionResult.children().eq(0).html(unoriginalSuggestion);
			suggestionResult.children().eq(1).html("");
			suggestionResult.appendTo(unoriginalSuggestionField);
		}
		
		suggestionSuccess.hide();
		suggestionFailed.show();
	}
}

// https://www.namecheap.com/domains/registration/results.aspx?aff=89293&domain=URL
// http://freedomainapi.com/?key=j5qf0n7t3a&domain=URL
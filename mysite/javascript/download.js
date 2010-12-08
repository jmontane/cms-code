/* TODO: make the messages variables passed to the script or use hidden html elements or similar */
(function($) {
$(document).ready(function() {
	$("ul#uldown ul").hide(); /* collapse everything */
	$("ul#uldown li:only-child > ul").show(); /* when there is no choice, don't force the user to click */
	$("ul#uldown li#sourcedl > ul > li:first > ul").show(); /* show the latest version of sources by default */
	/* preselect platform  default to rpm on linux TODO: Change options in html, so that platform here doesn't need any mapping */
	var navplatform = navigator.platform.toLowerCase();
	var platform = "";
	if (navplatform == "win32") {
		platform = "winx86";
	} else if (navplatform == "macintel") {
		platform="macintel" ;
	} else if (navplatform == "macppc") {
		platform = "macpp";
	} else if (navplatform == "linux x86_64") {
		if (navigator.userAgent.toLowerCase().indexOf("buntu") >= 0 || navigator.userAgent.toLowerCase().indexOf("debian") >= 0 ) {
			platform= "debx86_64";
		} else {
			platform = "rpmx86_64";
		}
	} else if (navplatform.substring(0,5) == "linux") {
		if (navigator.userAgent.toLowerCase().indexOf("buntu") >= 0 || navigator.userAgent.toLowerCase().indexOf("debian") >= 0 ) {
			platform= "debx86";
		} else {
			platform = "rpmx86";
		}
	}
	if (platform != "") {
		$("select#platform").val(platform);
		}
	var userLang = ((navigator.language) ? navigator.language : navigator.userLanguage).split("_");
	if ( $("select#lang option[value='"+userLang[0]+"-"+userLang[1]+"']").length) {
		$("select#lang").val(userLang[0]+"-"+userLang[1]);
	} else if ( $("select#lang option[value='"+userLang[0]+"']").length) {
		$("select#lang").val(userLang[0]);
	}

	$("select#platform").change(function () {
		var sel=$(this).val();
		var matches = "";
		if (sel=="winx86") {
			$("select#lang").hide();
		} else {
			$("select#lang").show();
		}
		$("select#lang").trigger("change");
		}).change();

	$("select#lang").change(function () {
		var matches = "";
		var downloadnote = "";
		var fullinstall = "";
		var platform = $("select#platform").val();
		if (platform == "winx86") {
			downloadnote = '<p>The windows installer contains many languages. The »multi« one conains (which one does it contain?), the »all_langs« one includes all available languages. Note that helpcontent is not included in windows downloads</p>';
			$("ul#uldown ul.winx86").each(function() {
				matches = matches + $(this).html();
			});
		} else {
			var sel=$(this).val();
			fullinstall = "<li>"+$("ul#uldown ul."+platform+" >li:first-child").html()+"</li>";

			if (sel != "en-US") {
				downloadnote = '<p>For languages other than english, you need to download both the full installset (in english language), as well as the language pack that will add support for the desired language</p>';
			}
			$("ul#uldown ul."+platform+" ul li."+sel).each(function() {
				matches = matches + "<li>"+$(this).html()+"</li>";
			});
		}
		if (matches == "") {
			$("div#filtered").html("<p>Sorry, no package for »"+sel+"« available for »"+$("select#platform option:selected").text()+"«. Please choose another language or only download the english version</p>");
			$("div#filtered").append("<ul>"+fullinstall+"</ul>");
		} else {
			$("div#filtered").html(downloadnote+"<ul>"+fullinstall+matches+"</ul>");
		}
		}).change();

	$("input#BT").change(function () {
		if ( $(this).is(":checked") ) {
			$("div#filtered ul li a, ul#uldown a:not(.action)").each( function() {
				     $(this).attr("href", this.href + ".torrent");
				     $(this).append(".torrent");
				       });
		} else {
			$("div#filtered ul li a, ul#uldown a:not(.action)").each( function() {
				$(this).attr("href", this.href.replace(/\.torrent$/,""));
				$(this).text($(this).text().replace(/\.torrent$/, ""));
				});

		}
	}).change();

	$("ul#uldown li a.action").click(function(event) {
		$(this).next("ul").slideToggle();
		event.preventDefault();
		});
})
})(jQuery);

var selected, viewer,links = [], wrap = $("#wrap"), sequence;

var projects = [
	{
		"id" : 1,
		"name" : "Ink Art",
		"timestamp" : "2012/08/07",
		"link" : "http://inkart.herokuapp.com/"
	},
	{
		"id" : 2,
		"name" : "Shared Map",
		"timestamp" : "2012/05/03",
		"link" : "http://afternoon-moon-6385.herokuapp.com/"
	}
	
];

init();

function init() {
    
    
	generate_menu();
  
  window.addEventListener('resize', onResize, false);
  
	if (window.location.pathname == '/') {
		// load the first project 
		load_project(projects[0]);
	} else {
		
		var project = /^\/lab\/(\d+)\//.exec(window.location.pathname)[1]
		for (var i in projects) {
				if (projects[i].project == project) {
					load_project(projects[i]);
					return;
				}else {
          // project not found alert and root the the main
          window.location.pathname = "/";
        }
		}
    
    //var sequence = /^\/(\d+)\//.exec(window.location.pathname)[1];
    
    
	}
	
}

function load_project(project) {
	
	if (selected) {
		
		selected.removeClass("selected");
		
		if (selected.id != project.id) {
			document.body.removeChild(viewer);
		} else {
			//skip reload current project
			return;
		}
	}
	
	selected = links[project.id];
	selected.id = project.id;
	
	selected.addClass("selected");
	document.title = 'Interactive Object | ' + project.name;
	viewer = document.createElement('iframe');
	viewer.name = 'viewer';
	viewer.src = project.link;
	document.body.appendChild(viewer);
  
  // update view size the first time
	after_resize();	
  
  // hide the global wraper
	hide_wrap();
	
}

function generate_menu() {
	
	for (var i in projects) {
		
		var current = projects[i];
		
		var li = $("<li/>");
		var link = $("<a href='" + current.link + "' target='viewer'>" + current.name + "</a>");
		link.data(current);
		li.append(link);
		
    
		link.click(function (event) {
			
			var project = $(this).data();
	
			if (project.id != selected.id) {
				selected.removeClass("selected");
				selected = links[project.id];
				selected.id = project.id;
				selected.addClass("selected");
				history.pushState(project, project.name, '/lab/' + project.id + '/' + project.name.replace(/\ /gi, '_').replace(/[:.,\'()%]/gi, ''));
				if (sequence) {
					leave(sequence);
					sequence = null
				}
				hide_wrap();
				return true;
			} else {
				return false;
			}
			
		});
		
		$('#labnav').append(li);
		links[current.id] = link;
		
	}
}

$('#contact-form').submit(function () {
    var form = $(this); 
	var textarea = form.find('textarea[name=message]');
	var message = textarea.val();
	$.post("/contact", {
		message : message
	},
		function (data) {
		textarea.val("");
		form.hide();
		form.parent().append("Message sent! Thank you.");
	});
	
	return false;
});

$('a[data-sequence]').click(function (e) {
	var sequence_name = $(e.target).data("sequence");
	
	// current squence is not null
	if (sequence) {
		// lanch animate out transition
		leave(sequence);
	}
  // goto the sequence
	show_wrap();
	enter(sequence_name);
	sequence = sequence_name;
});

function leave(name) {
	$("#" + name).removeClass("animate-in").addClass("animate-out");
}

function enter(name) {
	$("#" + name).removeClass("animate-out").addClass("animate-in");
}


function show_wrap() {	
	if (!wrap.hasClass("full-wrap")) {
		wrap.addClass("full-wrap");
		wrap.click(function () {
			wrap.removeClass("full-wrap");
			if (sequence) {
				leave(sequence);
				sequence = null
			}
		});
	}
}

function hide_wrap() {
	wrap.removeClass("full-wrap");
	if (sequence) {
		leave(sequence);
		sequence = null
	}
	sequence = null
}

function after_resize(event) {
	viewer.style.width = window.innerWidth + 'px';
	viewer.style.height = (window.innerHeight - 20) + 'px';
}

function onResize(event) {
	after_resize();
}

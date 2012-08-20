#= require_tree .



selected = null
viewer = null
links = []
wrap = $("#wrap")
contact_form = $("#contact-form")
sequence = null

projects = [
  id: 1
  name: "Ink Art"
  timestamp: "2012/08/07"
  link: "http://inkart.herokuapp.com/"
,
  id: 2
  name: "Shared Map"
  timestamp: "2012/05/03"
  link: "http://afternoon-moon-6385.herokuapp.com/"
]


init = ->
  generate_menu()
  if window.location.pathname is "/"
    # load the first project 
    load_project projects[0]
  else
    project = /^\/lab\/(\d+)\//.exec(window.location.pathname)[1]
    for i of projects
      if projects[i].project is project
        load_project projects[i]
        return
      else
        # project not found alert and root the the main
        window.location.pathname = "/"

  window.addEventListener "resize", onResize, false
  return
  


#var sequence = /^\/(\d+)\//.exec(window.location.pathname)[1];
load_project = (project) ->
  if selected
    selected.removeClass "selected"
    unless selected.id is project.id
      document.body.removeChild viewer
    else
      #skip reload current project
      return
  selected = links[project.id]
  selected.id = project.id
  selected.addClass "selected"
  
  # update page title with the project name
  document.title = "Interactive Object | " + project.name
  
  viewer = document.createElement("iframe")
  viewer.name = "viewer"
  viewer.src = project.link
  document.body.appendChild viewer
  
  # update view size the first time
  after_resize()
  
  # hide the global wraper
  hide_wrap()
  return;
  
  

generate_menu = ->
  for i of projects
    current = projects[i]
    li = $("<li/>")
    link = $("<a href='" + current.link + "' target='viewer'>" + current.name + "</a>")
    link.data current
    li.append link
    
    link.click onMenuClick

    $("#labnav").append li
    links[current.id] = link
  return
  

onMenuClick = (event) ->
	project = $(this).data()
	if project.id != selected.id
		selected.removeClass "selected"
		selected = links[project.id]
		selected.id = project.id
		selected.addClass "selected"
		history.pushState project, project.name, "/lab/" + project.id + "/" + project.name.replace(/\ /g, "_").replace(/[:.,\'()%]/g, "")
		console.log "current sequence", sequence
		if sequence
			leave sequence
			sequence = null
			hide_wrap()
	false
        
        
# goto the sequence
leave = (name) ->
  $("#" + name).removeClass("animate-in").addClass("animate-out")
		

enter = (name) ->
  $("#" + name).removeClass("animate-out").addClass("animate-in")
	

  
show_wrap = ->
	wrap.addClass "full-wrap"
	wrap.click hide_wrap
	return;


#  Hide global wrapper
hide_wrap = ->
  wrap.removeClass "full-wrap"
  if sequence
    leave sequence
    sequence = null
  return 


  
#  call after resize  
after_resize = (event) ->
  viewer.style.width = window.innerWidth + "px"
  viewer.style.height = (window.innerHeight - 20) + "px"
  
# On resize
onResize = (event) ->
  after_resize()
  return
  
  
contact_form.submit ->
  form = $(this)
  textarea = form.find("textarea[name=message]")
  message = textarea.val()
  $.post "/contact",
    message: message
  , (data) ->
    textarea.val ""
    form.hide()
    form.parent().append "Message sent! Thank you."
  false

$("a[data-sequence]").click (e) ->
  sequence_name = $(e.target).data("sequence")
  leave sequence  if sequence
  show_wrap()
  enter sequence_name
  sequence = sequence_name
  true
  
  
  
init()
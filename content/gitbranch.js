// Setup namespace
if (typeof(ko) == 'undefined') {
    var ko = {};
}
if (typeof(ko.extensions) == 'undefined') {
    ko.extensions = {};
}
ko.extensions.gitbranch = {};

(function () {
    var log = require('ko/logging').getLogger('gitbranch');
    log.setLevel(ko.logging.LOG_DEBUG);
    var StatusbarElement;
    this.OnLoad = function() {
        StatusbarElement = document.getElementById('gitbranch');
        StatusbarElement.innerHTML = "-";
    };
    this.ViewOpened = function() {
        //log.debug("We have opened a view.");
    };
    this.CurrentProjectChanged = function (){
        if (!ko.projects.manager.currentProject) {
            StatusbarElement.innerHTML = "-";
        }
    };
    this.CurrentViewChanged = function() {
        var shell = require('ko/shell');
        var _window = require("ko/windows").getMain();
        var koFile = _window.require("ko/file");
        // you can't do this:
        //var file = require('ko/file');
        //log.debug("Current view changed.");
        var path_to_proj = ko.projects.manager.currentProject.url;
        if (path_to_proj) {
            //log.debug("We have a project path, finding git branch");
            var project_path = koFile.dirname(path_to_proj.replace('file://', ''));
            // log.debug("project_path is " + project_path);
            var commandname = "git --git-dir=" + project_path + "/.git --work-tree=" + project_path + " rev-parse --abbrev-ref HEAD";
            // log.debug("command to run is " + commandname);
            var process = shell.exec(commandname, {});
            process.stdout.on('data', function(data){
                log.debug("We have data!");
                StatusbarElement.innerHTML = data.trim();
            });
        } else {
            StatusbarElement.innerHTML = '-';
        }
    };
}).apply(ko.extensions.gitbranch);
addEventListener("load", function() { setTimeout(ko.extensions.gitbranch.OnLoad, 6000); }, false);
addEventListener("view_opened", function() { ko.extensions.gitbranch.ViewOpened(); }, false);
addEventListener("current_view_changed", function() { ko.extensions.gitbranch.CurrentViewChanged(); }, false);
addEventListener("current_project_changed", ko.extensions.gitbranch.CurrentProjectChanged, false);
//addEventListener("unload", ko.extensions.gitbranch.OnUnload, false);


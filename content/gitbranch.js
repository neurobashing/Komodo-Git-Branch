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
    //log.setLevel(ko.logging.LOG_DEBUG);
    var StatusbarText;
    this.OnLoad = function() {
        StatusbarText = document.getElementById('gitbranch-text');
        StatusbarText.setAttribute("value", "-");
        
        addEventListener("current_view_changed", ko.extensions.gitbranch.CurrentViewChanged, false);
        addEventListener("current_project_changed", ko.extensions.gitbranch.CurrentViewChanged, false);
    };
    this.CurrentViewChanged = function() {
        var shell = require('ko/shell');
        //log.debug("Current view changed.");
        var project = ko.projects.manager.currentProject;
        if (project && project.url) {
            //log.debug("We have a project path, finding git branch");
            var project_path = project.liveDirectory;
            // log.debug("project_path is " + project_path);
            var commandname = "git --git-dir=" + project_path + "/.git --work-tree=" + project_path + " rev-parse --abbrev-ref HEAD";
            // log.debug("command to run is " + commandname);
            var process = shell.exec(commandname, {});
            process.stdout.on('data', function(data){
                //log.debug("We have data!");
                StatusbarText.setAttribute("value", data.trim());
            });
        } else {
            StatusbarText.setAttribute("value", "-");
        }
    };
}).apply(ko.extensions.gitbranch);
addEventListener("komodo-post-startup", ko.extensions.gitbranch.OnLoad, false);


YUI.add('moodle-theme_fordson-modmove', function(Y) {

var MOVEICON = {
    cssclass: 'moodle-core-dragdrop-draghandle'
};

/**
 * Make clicking on drag handles in course pages trigger old-style moving.
 */
var ModMove = function() {
    ModMove.superclass.constructor.apply(this, arguments);
};
ModMove.prototype = {
    initializer : function(config) {
        var self = this;
        // Make the accessible drag/drop respond to a single click.
        var coursecontent = Y.one('#region-main .course-content');
        if (coursecontent) {
            coursecontent.delegate('click', this.global_keydown,
                '.' + MOVEICON.cssclass , this);
        }
    },

    /**
     * Process key events on the drag handles.
     *
     * @method global_keydown
     * @param {EventFacade} e The keydown / click event on the drag handle.
     */
    global_keydown: function(e) {
        if (e.type !== 'click') {
            // Not a click - let the original global_keydown handler deal with it.
            return M.core.dragdrop.global_keydown(e);
        }

        var draghandle = e.target.ancestor('.' + MOVEICON.cssclass, true),
            dragcontainer,
            cmid;

        if (draghandle === null || !draghandle.hasClass(MOVEICON.cssclass)) {
            // The element clicked did not have a a draghandle in it's lineage.
            return;
        }

        // Check the drag groups to see if we are the handler for this node.
        draggroups = draghandle.getAttribute('data-draggroups').split(' ');
        var i, validgroup = false;

        for (i = 0; i < draggroups.length; i++) {
            if (draggroups[i] === 'resource') {
                validgroup = true;
                break;
            }
        }
        if (!validgroup) {
            // Not a resource/activity module - let the original global_keydown handler deal with it.
            return M.core.dragdrop.global_keydown(e);
        }

        // Valid click event on a resource/activity module - trigger old-style move.
        cmid = Y.Moodle.core_course.util.cm.getId(draghandle.ancestor('.yui3-dd-drop'));
        window.location.href = M.cfg.wwwroot + '/course/mod.php?copy=' + cmid + '&sesskey=' + M.cfg.sesskey;

        e.preventDefault();
        e.stopPropagation();
    }
};
// Make this into a fully fledged YUI module.
Y.extend(ModMove, Y.Base, ModMove.prototype, {
    NAME : 'UC Decaf theme mod moving enhancments',
    ATTRS : {
        // No attributes at present.
    }
});

M.theme_fordson = M.theme_fordson || {};
M.theme_fordson.initModMove = function(cfg) {
    return new ModMove(cfg);
}

}, '@VERSION@', {requires:['base','node','moodle-course-dragdrop']});
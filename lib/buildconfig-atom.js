'use babel';

import { CompositeDisposable } from 'atom';

import BuildView from './build-view';

class TestView {
    constructor() {
        this.element = document.createElement('div');
        this.element.style = 'background: red';
    }
    serialize() {
    }
    destroy() {
        this.element.remove();
    }
    getElement() {
        return this.element;
    }
}

export default {

    subscriptions: null,
    testView: null,
    testViewPanel: null,

    activate(state) {
        // @TODO: also add in sublime
        if (!/^win/.test(process.platform)) {
            process.env.PATH += ':/usr/local/bin';
        }


        this.testView = new TestView({});
        this.testViewPanel = atom.workspace.addModalPanel({
            item: this.testView.getElement(),
            visible: false
        });

        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'buildconfig-atom:run': () => this.run(),
            'buildconfig-atom:last': () => this.last()
        }));
    },

    deactivate() {
        this.testViewPanel.destroy();
        this.testView.destroy();
        this.subscriptions.dispose();
    },

    serialize() {
        // return {
        //   myPackageViewState: this.myPackageView.serialize()
        // };
    },

    run() {
        console.log('xx run');
        if (this.testViewPanel.isVisible()) {
            this.testViewPanel.hide();
        } else {

            var editor = atom.workspace.getActiveTextEditor();
            console.log('asd', editor);

            this.testViewPanel.show();
        }
    },

    last() {
        console.log('folders', atom.workspace.project.rootDirectories[0].path);
        console.log('file', atom.workspace.getActiveTextEditor().buffer.file.path);
    }

};

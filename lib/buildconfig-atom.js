'use babel';

import { CompositeDisposable } from 'atom';
import BuildView from './build-view';
import ChooseView from './choose-view';

export default {

    subscriptions: null,
    buildView: null,

    activate(state) {
        // @TODO: also add in sublime
        if (!/^win/.test(process.platform)) {
            process.env.PATH += ':/usr/local/bin';
        }

        this.buildView = new BuildView();

        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'buildconfig-atom:run': () => this.run(),
            'buildconfig-atom:last': () => this.last()
        }));
    },

    deactivate() {
        this.buildView && this.buildView.destroy();
        this.subscriptions && this.subscriptions.dispose();
    },

    serialize() {
        // return {
        //   myPackageViewState: this.myPackageView.serialize()
        // };
    },

    run() {
        this.buildView.buildStarted();
        this.buildView.setHeading('Running preBuild...');
        this.buildView.terminal.write('hello\n');

        const isWin = process.platform === 'win32';
        const shCmd = isWin ? 'cmd' : '/bin/sh';
        const shCmdArg = isWin ? '/C' : '-c';

        var cwd = '/';
        var env = null; // {};
        var exec = 'ping';
        var args = [ '-c', '10', 'google.com' ];
        console.log("ASD", [ shCmdArg, [ exec ].concat(args).join(' ')]);
        this.child = require('child_process').spawn(
            shCmd,
            [ shCmdArg, [ exec ].concat(args).join(' ')],
            { cwd: cwd, env: env }
        );

        // https://www.npmjs.com/package/cross-spawn

        this.child.stdout.setEncoding('utf8');
        this.child.stderr.setEncoding('utf8');
        this.child.stdout.pipe(this.buildView.terminal);
        this.child.stderr.pipe(this.buildView.terminal);

        this.child.on('error', (e) => {
            console.log('child error', e);
        });
        this.child.on('close', (ret) => {
            console.log('close', ret);
            this.buildView.buildFinished(true);
            setTimeout(() => {
                this.buildView.detach();
            }, 2000);
        });
      // this.child.on('error', (err) => {
      //   this.buildView.terminal.write((target.sh ? 'Unable to execute with shell: ' : 'Unable to execute: ') + exec + '\n');

      //   if (/\s/.test(exec) && !target.sh) {
      //     this.buildView.terminal.write('`cmd` cannot contain space. Use `args` for arguments.\n');
      //   }

      //   if ('ENOENT' === err.code) {
      //     this.buildView.terminal.write(`Make sure cmd:'${exec}' and cwd:'${cwd}' exists and have correct access permissions.\n`);
      //     this.buildView.terminal.write(`Binaries are found in these folders: ${process.env.PATH}\n`);
      //   }
      // });

      //         if (target.sh) {
      //   this.child = require('child_process').spawn(
      //     shCmd,
      //     [ shCmdArg, [ exec ].concat(args).join(' ')],
      //     { cwd: cwd, env: env }
      //   );
      // } else {
      //   this.child = require('cross-spawn').spawn(
      //     exec,
      //     args,
      //     { cwd: cwd, env: env }
      //   );
      // }

      // let stdout = '';
      // let stderr = '';
      // this.child.stdout.setEncoding('utf8');
      // this.child.stderr.setEncoding('utf8');
      // this.child.stdout.on('data', d => (stdout += d));
      // this.child.stderr.on('data', d => (stderr += d));
      // this.child.stdout.pipe(this.buildView.terminal);
      // this.child.stderr.pipe(this.buildView.terminal);
      // this.child.killSignals = (target.killSignals || [ 'SIGINT', 'SIGTERM', 'SIGKILL' ]).slice();


        // console.log('xx run');
        // if (this.testViewPanel.isVisible()) {
        //     this.testViewPanel.hide();
        // } else {
        //     this.testViewPanel.show();
        // }
    },

    last() {

        ChooseView.show(['t1', 't2'], 1).then((x) => {
            console.log('res', x);
        });

        try {
            console.log('folders', atom.workspace.project.rootDirectories[0].path);
        } catch (e) {
        }
        try {
            console.log('file', atom.workspace.getActiveTextEditor().buffer.file.path);
        } catch (e) {
        }
    }

};

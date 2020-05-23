#!/usr/bin/env node
'use strict';

const Fs = require('fs');
const Sox = require('sox-stream');
const Ds = require('deepspeech');
const argparse = require('argparse');
const MemoryStream = require('memory-stream');
const Wav = require('node-wav');
const Duplex = require('stream').Duplex;
const util = require('util');

var VersionAction = function VersionAction(options) {
    options = options || {};
    options.nargs = 0;
    argparse.Action.call(this, options);
}
util.inherits(VersionAction, argparse.Action);

VersionAction.prototype.call = function (parser) {
    Ds.printVersions();
    let runtime = 'Node';
    if (process.versions.electron) {
        runtime = 'Electron';
    }
    console.error('Runtime: ' + runtime);
    process.exit(0);
}

function totalTime(hrtimeValue) {
    return (hrtimeValue[0] + hrtimeValue[1] / 1000000000).toPrecision(4);
}

function metadataToString(metadata) {
    var retval = ""
    for (var i = 0; i < metadata.num_items; ++i) {
        retval += metadata.items[i].character;
    }
    Ds.FreeMetadata(metadata);
    return retval;
}

function main(dsModel, beam_width, lm, trie, lm_alpha, lm_beta, audio, extended, callback) {
    console.error('Loading model from file %s', dsModel);
    const model_load_start = process.hrtime();
    var model = new Ds.Model(dsModel, beam_width);
    const model_load_end = process.hrtime(model_load_start);
    console.error('Loaded model in %ds.', totalTime(model_load_end));

    var desired_sample_rate = model.sampleRate();

    if (lm && trie) {
        console.error('Loading language model from files %s %s', lm, trie);
        const lm_load_start = process.hrtime();
        model.enableDecoderWithLM(lm, trie, lm_alpha, lm_beta);
        const lm_load_end = process.hrtime(lm_load_start);
        console.error('Loaded language model in %ds.', totalTime(lm_load_end));
    }

    const buffer = Fs.readFileSync(audio);
    const result = Wav.decode(buffer);

    if (result.sampleRate < desired_sample_rate) {
        console.error('Warning: original sample rate (' + result.sampleRate + ') ' +
            'is lower than ' + desired_sample_rate + 'Hz. ' +
            'Up-sampling might produce erratic speech recognition.');
    }

    function bufferToStream(buffer) {
        var stream = new Duplex();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }

    var audioStream = new MemoryStream();
    bufferToStream(buffer).
        pipe(Sox({
            global: {
                'no-dither': true,
            },
            output: {
                bits: 16,
                rate: desired_sample_rate,
                channels: 1,
                encoding: 'signed-integer',
                endian: 'little',
                compression: 0.0,
                type: 'raw'
            }
        })).
        pipe(audioStream);
    
    audioStream.on('finish', () => {
        let audioBuffer = audioStream.toBuffer();
        let b ;

        const inference_start = process.hrtime();
        console.error('Running inference.');
        const audioLength = (audioBuffer.length / 2) * (1 / desired_sample_rate);

        // We take half of the buffer_size because buffer is a char* while
        // LocalDsSTT() expected a short*
        if (extended) {
            a = metadataToString(model.sttWithMetadata(audioBuffer.slice(0, audioBuffer.length / 2)));
            console.log();            
        } else {
            b = model.stt(audioBuffer.slice(0, audioBuffer.length / 2));
            console.log();
        }
        const inference_stop = process.hrtime(inference_start);
        console.error('Inference took %ds for %ds audio file.', totalTime(inference_stop), audioLength.toPrecision(4));        
       // console.log("a", b);        
        Ds.FreeModel(model);
        callback({ text : b });
       // process.exit(0);
    });    
}

module.exports = main;

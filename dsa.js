require('dotenv').config();
const http = require('http');
const socketIO = require('socket.io');
const DeepSpeech = require('deepspeech');
const VAD = require('node-vad');


let DEEPSPEECH_MODEL = __dirname + '/models'; // path to deepspeech model directory

console.log("start")
/*
let modelpath = "./models/output_graph.pbmm";
let beam_width = 500;
let lm = "./models/lm.binary";
let trie = "./models/trie";
let lm_alpha = 0;
let lm_beta = 0;
*/

let modelpath = process.env.MODELPATH;
let beam_width = Number(process.env.BEAM_WIDTH);
let lm = process.env.LM;
let trie = process.env.TRIE;
let lm_alpha = Number(process.env.LM_ALPHA);
let lm_beta = Number(process.env.LM_BETA);



function createModel(modelDir, options) {

	console.log("create model");
	//lm_alpha = 1;
	console.log("lm_alpha", lm_alpha);

	let modelPath = modelpath;
	let lmPath = lm;
	let triePath = trie;
	let model = new DeepSpeech.Model(modelPath, options.BEAM_WIDTH);
	model.enableDecoderWithLM(lmPath, triePath, options.LM_ALPHA, options.LM_BETA);
	return model;
}

function createEnglish() {
	englishModel = createModel(DEEPSPEECH_MODEL, {
		BEAM_WIDTH: beam_width,
		LM_ALPHA: lm_alpha,
		LM_BETA: lm_beta
	});

	return englishModel;
}

module.exports = createEnglish;

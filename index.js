var fs = require('fs'); 
var ds = require("./ds")

let model = "./models/output_graph.pbmm";
let beam_width = 500;
let lm = "./models/lm.binary";
let trie = "./models/trie";
let lm_alpha = 0;
let lm_beta = 0;
let audio = "./models/a.wav"
let extended = 0;



var t = ds(model, beam_width, lm, trie, lm_alpha, lm_beta, audio, extended, (text) => {
    console.log("t",text.text);
});
 
//console.log("t",t);
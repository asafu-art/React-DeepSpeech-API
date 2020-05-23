require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');

var ds = require("./ds")

let model = process.env.MODELPATH;
let beam_width = Number(process.env.BEAM_WIDTH);
let lm = process.env.LM;
let trie = process.env.TRIE;
let lm_alpha = Number(process.env.LM_ALPHA);
let lm_beta = Number(process.env.LM_BETA);
//let audio = "./models/a.wav"
let extended = 0;


let port = Number(process.env.FILEPORT);


const app = express();

app.use(fileUpload());

// Upload Endpoint
app.post('/upload', (req, res) => {
	if (req.files === null) {
		return res.status(400).json({ msg: 'Ulac afaylu d-yulin' });
	}

	const file = req.files.file;
	if (file.name.endsWith(".wav")) {
		file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
			if (err) {
				console.error(err);
				return res.status(500).send(err);
			}
			try {
				//console.log("created model")
				var t = ds(model, beam_width, lm, trie, lm_alpha, lm_beta, `${__dirname}/client/public/uploads/${file.name}`, extended, (text) => {
					console.log("text: ", text.text);
					res.json({ fileName: text.text, filePath: `/uploads/${file.name}` });
				});
			} catch (err) {
				return res.status(700).json({ msg: 'Afaylu ahat yettwaɣ' });
			}
			//res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
		});
	}
	else {
		return res.status(600).json({ msg: 'Mačči d talɣa n ufaylu ilaqen!' });
	}
});

app.listen(port, () => console.log('Server Started...'));

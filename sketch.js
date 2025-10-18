let density;

let moviewidth = 1920;
let movieheight = 1080;
let aspectratio = moviewidth/movieheight;
// let experiencecanvaswidth;
// let experiencecanvasheight;
let modwidth;
let modheight;
let modx;
let mody;
let scalefactor = 1;

let mic;
let recorder;
let audiochunks = [];
let notspeaking = true;
let level;

let starttime;
let duration;

let text_fill = 0;
let textstring;
let textstring2;
let textstring3;
let textlocx;
let textlocx2;
let textlocx3;
let textlocy;
let textlocy2;
let textlocy3;
let mytextsize;
let texttransparency = 255;
let threetextstrings = false;
let breathe = 255;
let speed = 2;
let ellipsefill = 255;

let loop;
let playing = false;

let timer = 0;
let normtime = 0;
let xcoord = 0;
let recording = false;

let scene = 0;
let activevideo = null;
let randstage1 = null;
let randstage2 = null;
let randstage3 = null;

let randselect;

let mousepressactive = false;

let moviefiles = [];
let stage1select;
let stage2select;
let stage3select;

let autostarttoggle = false;
let locked = true;

let detectedemotion;
let detecting = false;

let filetest = {
	landing: {
		id: "landing",
		path: "assets/Loop Video.mov",
		loaded: false
	}
}

function preload(){
	// loop = createVideo('moviefiles.intro${0}');
	moviefiles[0] = "assets/loopcompressed.mp4";
	moviefiles[1] = new Array("assets/afterlandingcompressed.mp4", "assets/intro-long.mp4", "assets/outro.mp4");
	moviefiles[2] = new Array("assets/anger2compressed.mp4", "assets/calm2compressed.mp4", "assets/curious2compressed.mp4", "assets/joy2compressed.mp4", "assets/sad2compressed.mp4");
	moviefiles[3] = new Array("assets/angercompressed.mp4", "assets/calmcompressed.mp4", "assets/curiouscompressed.mp4", "assets/joycompressed.mp4", "assets/sadcompressed.mp4");
	moviefiles[4] = new Array("assets/anger3compressed.mp4", "assets/calm3compressed.mp4", "assets/curious3compressed.mp4", "assets/joy3compressed.mp4", "assets/sad3compressed.mp4");

	//pre-experience
	landing = createVideo(moviefiles[0]);
	landing.volume(0);
	landing.hide();

	afterlanding = createVideo(moviefiles[1][0]);
	afterlanding.hide();

	intro = createVideo(moviefiles[1][1]);
	intro.hide();

	// stage 1
	s1angry = createVideo(moviefiles[2][0]);
	s1angry.hide();

	s1calm = createVideo(moviefiles[2][1]);
	s1calm.hide();

	s1curious = createVideo(moviefiles[2][2]);
	s1curious.hide();

	s1joy = createVideo(moviefiles[2][3]);
	s1joy.hide();

	s1sad = createVideo(moviefiles[2][4]);
	s1sad.hide();

	// stage1select[0] = s1angry;
	// stage1select[1] = s1calm;
	// stage1select[2] = s1curious;
	// stage1select[3] = s1joy;
	// stage1select[4] = s1sad;

	stage1select = {
		anger_fear: s1angry,
		calm_content: s1calm,
		curious_reflective: s1curious,
		joy_excited: s1joy,
		sadness: s1sad
	}

	// console.log(stage1select.anger_fear);

	// stage2
	s2angry = createVideo(moviefiles[3][0]);
	s2angry.hide();

	s2calm = createVideo(moviefiles[3][1]);
	s2calm.hide();

	s2curious = createVideo(moviefiles[3][2]);
	s2curious.hide();

	s2joy = createVideo(moviefiles[3][3]);
	s2joy.hide();

	s2sad = createVideo(moviefiles[3][4]);
	s2sad.hide();

	// stage2select[0] = s2angry;
	// stage2select[1] = s2calm;
	// stage2select[2] = s2curious;
	// stage2select[3] = s2joy;
	// stage2select[4] = s2sad;

	stage2select = {
		anger_fear: s2angry,
		calm_content: s2calm,
		curious_reflective: s2curious,
		joy_excited: s2joy,
		sadness: s2sad
	}

	// stage3
	s3angry = createVideo(moviefiles[4][0]);
	s3angry.hide();

	s3calm = createVideo(moviefiles[4][1]);
	s3calm.hide();

	s3curious = createVideo(moviefiles[4][2]);
	s3curious.hide();

	s3joy = createVideo(moviefiles[4][3]);
	s3joy.hide();

	s3sad = createVideo(moviefiles[4][4]);
	s3sad.hide();

	// stage3select[0] = s3angry;
	// stage3select[1] = s3calm;
	// stage3select[2] = s3curious;
	// stage3select[3] = s3joy;
	// stage3select[4] = s3sad;

	stage3select = {
		anger_fear: s3angry,
		calm_content: s3calm,
		curious_reflective: s3curious,
		joy_excited: s3joy,
		sadness: s3sad
	}
}

function windowResized(){
	setup();
}

function updatecanvasdimensions(){
	if (windowWidth/windowHeight > aspectratio){
		return {
			experiencecanvaswidth: windowHeight * aspectratio,
			experiencecanvasheight: windowHeight
		};
	}

	return {
		experiencecanvaswidth: windowWidth,
		experiencecanvasheight: windowWidth/aspectratio
	};
}

function setup() {
	const {experiencecanvaswidth, experiencecanvasheight} = updatecanvasdimensions();
	// const experiencecanvas = createCanvas(experiencecanvaswidth, experiencecanvasheight);
	createCanvas(windowWidth, windowHeight);

	modwidth = experiencecanvaswidth;
	modheight = experiencecanvasheight;

	scalefactor = moviewidth/experiencecanvaswidth;

	modx = (windowWidth - experiencecanvaswidth) / 2;
	mody = (windowHeight - experiencecanvasheight) / 2;

	// experiencecanvas.position(x, y);
	
	textAlign(CENTER, CENTER);
	rectMode(CENTER);

	density = pixelDensity();
	pixelDensity(density);

	// mic = new p5.AudioIn();
	// mic.start();

	// console.log(density);

}

function draw() {

	background(0);

	if (mic){
		level = mic.getLevel();
		// console.log("level: " + level);
	}
	
	// landing loop until enter // begin locked, unlock to play
	if (scene == 0){

		threetextstrings = false;

		mytextsize = height/8;
		textlocx = width/2;
		textlocy = (height/2) + height/12;
		texttransparency = 255;
		textstring = "Enter";

		if (locked){
			unlock();
		}

		// image(landing, 0, 0, width, height);
		// image(landing, 0, 0, width, height, 0, 0, landing.width, landing.height, constrain);
		// rect(width/2, height/2+height/12, height/24*3, height/24);

		if (mouseX/width >= .46 && mouseX/width <= .53 && mouseY/height <= .604 && mouseY/height >= .569){
			// print("yes");
			text_fill = 200;

			} else {
				// print("no");
				text_fill = 255;
				}

	}

	// temple // begin unlocked, lock to play
	if (scene == 1){

		threetextstrings = false;

		text_fill = 255;
		mytextsize = (height/8);
		textlocx = width/2;
		textlocy = height/2;
		texttransparency = playing ? 0 : 255;
		textstring = "Speak to begin. Say: I am the Human Agent.";

		if (level >= .002 && notspeaking && !playing){
			// updatex();
			startrecording();
			starttimer(10); //10
		}

		if (recording == true){
			updatex();
		}
		
		// if (frameCount % 60 == 0 && timer <= 10){
		// 	normtime = timer++/10;
		// }

		push();

		if (!detecting){
			ellipsefill = 255;
		} else {
			ellipsefill -= 5;
		}

		fill(ellipsefill);
		ellipse(xcoord, height/40, height/60, height/60);
		// xcoord += (normtime*width)/600;

		pop();
		

		if (playing){
			xcoord = 0;
			timer = 0;
		}

		if (!locked && !keyIsPressed && xcoord >= width ){	
			lock();
		}
	
		if (afterlanding.time() >= afterlanding.duration()){
				switchscene(2);
				starttimer(3);
				playing = false;
				// notspeaking = true;
			}
		
	}

	// welcome online + intro // begin locked, unlock to play
	if (scene == 2){

		threetextstrings = false;

		text_fill = 255;
		mytextsize = (height/8);
		textlocx = width/2;
		textlocy = height/2;
		texttransparency = playing ? 0 : 255;
		textstring = "Welcome Online Human Agent";

		updatex();
		// ellipse(xcoord, height/40, height/60, height/60);
		// xcoord += normtime;

		if (playing){
			xcoord = 0;
			timer = 0;
		}

		if (locked && !keyIsPressed && xcoord >= width ){	
			unlock();
		}

		if (intro.time() >= intro.duration()){
				switchscene(3);
				starttimer(5);
				playing = false;
			}

	}

	// instructions // begin unlocked, lock to continue
	if (scene == 3){

		threetextstrings = true;

		text_fill = 255;
		mytextsize = (height/8);
		textlocx = width/2;
		textlocy = height/2 - ((height/8));
		textlocx2 = width/2;
		textlocy2 = height/2;
		textlocx3 = width/2;
		textlocy3 = height/2 + ((height/8));
		texttransparency = playing ? 0 : 255;
		textstring = "Speak into the mic - your tone becomes data"; 
		textstring2 = "Frequency becomes visual";
		textstring3 = "3 questions to elevate your frequency";

		updatex();
		// ellipse(xcoord, height/40, height/60, height/60);

		if (!locked && !keyIsPressed && xcoord >= width ){	
			lock();
			xcoord = 0;
			notspeaking = true;
		}

	}

	// if (scene == 3.1){ // begin locked, unlock to continue

	// 	// threetextstrings = true;

	// 	text_fill = 255;
	// 	mytextsize = (height/24);
	// 	textlocx = width/2;
	// 	textlocy = height/2;
	// 	texttransparency = playing ? 0 : 255;
	// 	// textstring = "Speak into the mic - your tone becomes data"; 
	// 	textstring = "Frequency becomes visual";
	// 	// textstring3 = "3 questions to elevate your frequency";

	// 	updatex();
	// 	ellipse(xcoord, height/40, height/60, height/60);

	// 	if (locked && !keyIsPressed && xcoord >= width ){	
	// 		unlock();
	// 		xcoord = 0;
	// 		timer = 0;
	// 	}

	// }

	// if (scene == 3.2){ // begin unlocked, lock to continue

	// 	// threetextstrings = true;

	// 	text_fill = 255;
	// 	mytextsize = (height/24);
	// 	textlocx = width/2;
	// 	textlocy = height/2;
	// 	texttransparency = playing ? 0 : 255;
	// 	// textstring = "Speak into the mic - your tone becomes data"; 
	// 	// textstring2 = "Frequency becomes visual";
	// 	textstring = "3 questions to elevate your frequency";

	// 	updatex();
	// 	ellipse(xcoord, height/40, height/60, height/60);

	// 	if (!locked && !keyIsPressed && xcoord >= width ){	
	// 		lock();
	// 		xcoord = 0;
	// 		timer = 0;
	// 	}

	// }

	// stage 1 // begin locked, unlock to play
	if (scene == 4){ 

		threetextstrings = false;

		text_fill = 255;
		mytextsize = (height/8);
		textlocx = width/2;
		textlocy = height/2;
		texttransparency = playing ? 0 : 255;
		textstring = "What are you seeking: Power or Peace?";

		if (level >= .002 && notspeaking && !playing){
			// updatex();
			startrecording();
			starttimer(10); //10
		}

		if (recording == true){
			updatex();
		}

		push();

		if (!detecting){
			ellipsefill = 255;
		} else {
			ellipsefill -= 5;
		}

		fill(ellipsefill);
		ellipse(xcoord, height/40, height/60, height/60);
		// xcoord += (normtime*width)/600;

		pop();

		if (locked && !keyIsPressed && xcoord >= width ){	
			unlock();
		}

		if (playing){
			if (activevideo.time() >= activevideo.duration()){
				playing = false;
				switchscene(5);	
				// starttimer(10);
				notspeaking = true;
			}
			xcoord = 0;
			timer = 0;
		}
	}

	// stage 2 // begin unlocked, locked to play
	if (scene == 5){

		text_fill = 255;
		mytextsize = (height/8);
		textlocx = width/2;
		textlocy = height/2;
		texttransparency = playing ? 0 : 255;
		textstring = "What truth have you hidden from yourself?";

		if (level >= .002 && notspeaking && !playing){
			// updatex();
			startrecording();
			starttimer(10); //10
		}

		if (recording == true){
			updatex();
		}

		push();

		if (!detecting){
			ellipsefill = 255;
		} else {
			ellipsefill -= 5;
		}

		fill(ellipsefill);
		ellipse(xcoord, height/40, height/60, height/60);
		// xcoord += (normtime*width)/600;

		pop();

		if (!locked && !keyIsPressed && xcoord >= width ){	
			lock();
		}

		if (playing){
			if (activevideo.time() >= activevideo.duration()){
				playing = false;
				switchscene(6);
				// starttimer(10);
				notspeaking = true;
			}
			xcoord = 0;
			timer = 0;
		}

	}

	// stage 3 // begin locked, unlock to play
	if (scene == 6){ 

		text_fill = 255;
		mytextsize = (height/8);
		textlocx = width/2;
		textlocy = height/2;
		texttransparency = playing ? 0 : 255;
		textstring = "Are you ready to recalibrate your reality?";

		if (level >= .002 && notspeaking && !playing){
			// updatex();
			startrecording();
			starttimer(10); //10
		}

		if (recording == true){
			updatex();
		}

		push();

		if (!detecting){
			ellipsefill = 255;
		} else {
			ellipsefill -= 5;
		}

		fill(ellipsefill);
		ellipse(xcoord, height/40, height/60, height/60);
		// xcoord += (normtime*width)/600;

		pop();

		if (locked && !keyIsPressed && xcoord >= width ){	
			unlock();
		}

		if (playing){
			if (activevideo.time() >= activevideo.duration()){
				playing = false;
				switchscene(0);
				locked = true;
				notspeaking = true;
			}
			xcoord = 0;
			timer = 0;
		}
	}

	if (playing){
		image(activevideo, modx, mody, modwidth, modheight);
	}

	fill(text_fill, texttransparency);

	// textSize(height/12);
	// text("Ascended Intelligence", width/2, height/2);

	textSize(mytextsize/scalefactor);

	if (threetextstrings){
		text(textstring, textlocx, textlocy);
		text(textstring2, textlocx2, textlocy2);
		text(textstring3, textlocx3, textlocy3);

	} else {
		text(textstring, textlocx, textlocy);
	}

	

	push();

	breathe += speed;

	if (breathe > 255 || breathe < 0){
		speed = -speed;
	} 

	textSize((height/12)/scalefactor);

	if (detecting){

		if (scene == 1){
			fill(breathe, 255);
			text('Calibrating', width/2, height-(height/6));

		} else {
			fill(breathe, 255);
			text('Detecting Emotion', width/2, height-(height/6));

		}

	} else {

		fill(255, 0);
		text('Detecting Emotion', width/2, height-(height/6));

	}

	pop();
	

	// console.log("scene: " + scene);
	// console.log("locked: " + locked);
	// console.log("playing: " + playing);
	// console.log("timer: " + timer);
	// console.log("normtime: " + normtime);
	// console.log("xcoord: " + xcoord);
	// console.log("stage1select: " + stage1select);
	// console.log("selectrandvid: " + selectrandvid(stage1select));
	// console.log("keypress check: " + keyIsPressed);
	// console.log("aspect ratio: " + aspectratio);
	// console.log("notspeaking: " + notspeaking);
	// console.log("width: " + width);
	// console.log('detecting: ' + detecting);
	// console.log('breathe: ' + breathe);
	
}

async function startrecording() {
  notspeaking = false;
  recording = true;
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = e => audiochunks.push(e.data);

  if (scene == 1 || scene == 4 || scene == 5 || scene == 6){
	recorder.onstop = predictemotion;
  }
  
  recorder.start();
//   console.log('recording...');

  // Stop after 5 seconds
  setTimeout(() => recorder.stop(), 5000);
  
}

function predictemotion() {
  recording = false;
  const blob = new Blob(audiochunks, { type: 'audio/wav' });
  audiochunks = []; // clear buffer

  sendAudioToAPI(blob);

  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  
  // Unlock after playback finishes
  audio.onended = () => {
	

	// if (scene == 1){
	// 	switchvideo(afterlanding);
	// 	locked = true;
	// } else if (scene == 4){
	// 	unlock();
	// } else if (scene == 5){
	// 	lock();
	// } else if (scene ==6){
	// 	unlock();
	// }

    // notspeaking = true; need to reset this elsewhere
    // console.log('Ready for next recording');
  };
  
//   audio.play();
//   console.log(blob.type);

  console.log('prediction started');
  
}

async function sendAudioToAPI(blob){
	try {
		const formData = new FormData();
		formData.append('file', blob, 'recording.wav');
		console.log('predicting...');
		detecting = true;

		const response = await fetch('https://ai-emotion-api.sliplane.app/predict',
			{
				method: 'POST',
				body: formData
			}
		);

		const result = await response.json();
		console.log('predicted emotion: ', result.emotion);
		detectedemotion = result.emotion;
		detecting = false;

		if (scene == 1){
			switchvideo(afterlanding);
			locked = true;
		} else if (scene == 4){
			unlock();
		} else if (scene == 5){
			lock();
		} else if (scene ==6){
			unlock();
		}

		return result.emotion;
	} catch (err) {
		console.error('error sending audio to hf space: ', err);
	}
}

function starttimer(seconds){
	duration = seconds * 1000;
	starttime = millis();
}

function updatex(){

	let progress = (millis() - starttime)/duration;
	progress = constrain(progress, 0, 1);
	xcoord = progress * width;
		
}

function unlock(){

	if (scene == 0){
		activevideo = landing;

		if (playing){
			activevideo.pause();
		} else {
			activevideo.loop();
		}

		playing = !playing;
		locked = false;

	}

	if (scene == 2){
		activevideo = intro;
		// aspect ratio and/or setup
		aspectratio = 2.35;
		setup();
		if (playing){
			activevideo.pause();
		} else {
			activevideo.play();
		}

		playing = !playing;
		locked = false;
	}

	// if (scene == 3.1){
	// 	switchscene(3.2);
	// 	starttimer(10);
	// 	locked = false;
	// }

	if (scene == 4 && locked){
		// activevideo = selectrandvid(stage1select);
		activevideo = stage1select[detectedemotion];
		
		if (playing){
			activevideo.pause();
		} else {
			activevideo.play();
		}

		playing = !playing;
		locked = false;
	}

	if (scene == 6){
		// activevideo = selectrandvid(stage3select);
		activevideo = stage3select[detectedemotion];
		aspectratio = 1.78;
		setup();
		if (playing){
			activevideo.pause();
		} else {
			activevideo.play();
		}

		playing = !playing;
		locked = false;
	}
}

function lock(){

	if (scene == 1){
		activevideo = afterlanding;

		if (playing){
			activevideo.pause();
		} else {
			activevideo.play();
		}

		playing = !playing;
		locked = true;

	}

	if (scene == 3){
		locked = true;
		switchscene(4);
		// starttimer(10);
		
	}

	// if (scene == 3.2){
	// 	switchscene(4);
	// 	starttimer(10);
	// 	locked = true;
	// }

	if (scene == 5){
		// activevideo = selectrandvid(stage2select);
		activevideo = stage2select[detectedemotion];
		if (playing){
			activevideo.pause();
		} else {
			activevideo.play();
		}

		playing = !playing;
		locked = true;
	}
}

function selectrandvid(stage){
	// if (scene == 4){
		randselect = random(stage);
	// }
	return randselect;
}

function mousePressed() {

	if (!mic){
		userStartAudio();

		mic = new p5.AudioIn();
		mic.start(() => console.log("mic started"), err => console.error(err));
	}

  // Check if click is in the "Enter" button area
  if (scene == 0 && mouseX/width >= 0.46 && mouseX/width <= 0.53 && mouseY/height >= 0.569 && mouseY/height <= 0.604) {

    // if (playing){
	// 	landing.pause();
	// } else {
	// 	landing.play();
	// }

	playing = !playing;
	switchscene(1);
	// starttimer(10);
    
  }
}

function keyPressed(){
	if (scene == 1 && keyCode == 13 && !locked){
		switchvideo(afterlanding);
		locked = true;
	}

	else if (scene == 2 && keyCode == 13 && locked){
		locked = false;
		aspectratio = 2.35;
		setup();
		switchvideo(intro);
	}

	else if (scene == 3 && keyCode == 13 && !locked){
		lock();
	}

	else if (scene == 3.1 && keyCode == 13 && locked){
		unlock();
	}

	else if (scene == 3.2 && keyCode == 13 && !locked){
		lock();
	}

	else if (scene == 4 && keyCode == 13 && locked){
		unlock();
	}

	else if (scene == 5 && keyCode == 13 && !locked){
		lock();
	}

	else if (scene == 6 && keyCode == 13 && locked){
		unlock();
	}
}

function switchvideo(v){

	playing = !playing;

	if (activevideo && activevideo != v) {
		activevideo.pause();
	}
	if (activevideo != v){
		v.play();
		activevideo = v;
	}	
}

function switchscene(newscene){
	if (activevideo) {
		activevideo.pause();
	}
	scene = newscene;
}

function playvideo(){
	// activevideo.play();
	// playing = true;

	if (playing){
		activevideo.pause();
	} else {
		activevideo.play();
	}

	playing = !playing;
	console.log("playing: " + activevideo);
}
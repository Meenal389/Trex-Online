var trex, trexRun, trexjump,trexcollide,trexbend;
var edges;
var ground,groundImage;
var invisible;
var cloud, cloudImage;
var obstacle, ob1,ob2 ,ob3,ob4,ob5,ob6;
var score=0;
var PLAY=0;
var END=1;
var gameState=PLAY;
var obstacleGroup;
var cloudGroup;
var gameOver,goimage;
var restart,rimage;
var jump,die,check;
var bird,birdi,birdcollide;
var currentFrame=0;
var birdGroup;
var obstacleframe=0;

function preload(){
  trexRun= loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage=loadImage("ground2.png");
  trexjump=loadAnimation("trex1.png");
  trexcollide=loadAnimation("trex_collided.png")
  cloudImage=loadImage("cloud2.png");
  ob1=loadImage("obstacle1.png");
  ob2=loadImage("obstacle2.png");
  ob3=loadImage("obstacle3.png");
  ob4=loadImage("obstacle4.png");
  ob5=loadImage("obstacle5.png");
  ob6=loadImage("obstacle6.png");
  goimage=loadImage("gameOver.png");
  rimage=loadImage("restart.png");
  trexbend=loadAnimation("Trex_bend1.png","Trex_bend2.png");
  birdi=loadAnimation("Trex_Bird1.png","Trex_Bird2.png");
  birdcollide=loadImage("Trex_Bird1.png");
  
  //sounds
  jump=loadSound("jump.mp3");
  die=loadSound("die.mp3");
  check=loadSound("checkPoint.mp3");
}

function setup(){
  
 // console.time();
  
  createCanvas(600,200);
  
  //trex
  trex=createSprite(50,150,20,40);
  trex.addAnimation("trexRun",trexRun);
  trex.addAnimation("trexjump", trexjump);
  trex.addAnimation("trexcollide",trexcollide);
  trex.addAnimation("trexbend",trexbend);
  trex.scale=0.5;
 //trex.debug=true;
// trex.setCollider("circle",0,0,45);
  
  
  
  edges= createEdgeSprites();
  
  //ground 
  ground=createSprite(300,180,600,10)
  ground.addImage("groundRun", groundImage);
  
  //invisible ground
  invisible= createSprite(300,190,600,10);
  invisible.visible=false;
  
  //gameover and restart
  gameOver=createSprite(300,100);
  gameOver.addImage("goimage",goimage);
  gameOver.scale=0.5;
  gameOver.visible=false;
  
  restart=createSprite(300,140);
  restart.addImage("rimage",rimage);
  restart.scale=0.4;
  restart.visible=false;
  
  obstacleGroup=new Group();
  cloudGroup=new Group();
  birdGroup=new Group();

  //trex.setCollider("rectangle",0,0,250,trex.height);
  
}

function draw(){
  
  //console.time();
  
  //frameRate(50);
  
  background("white");

  trex.changeAnimation("trexRun");
  
 // console.log(frameRate());
  
  if(gameState===PLAY){
    
    //make trex jump
  if(keyDown("space") && trex.y>=161.5){
     trex.velocityY=-15;
    jump.play();
  }
  
  //to give gravity to trex
  trex.velocityY+=0.8;
  
     //velocity of ground
  ground.velocityX=-(5+score/50);
  
  //reset the ground
  if(ground.x<0){
    ground.x=ground.width/2;
  }
  
  if (trex.y<161){
    trex.changeAnimation("trexjump");
  }
  
  //calling the clouds
  spawnClouds();
  
  //callng the obstacles
  spawnObstacles();
    
    //calling the birds
    spawnbirds();
    
    if(keyDown("down")){
    trex.changeAnimation("trexbend");
    }
    
     score=score+Math.round(getFrameRate()/60);
    
    if(score % 100===0 && score>0 ){
      check.play();       
    }
    
    if(trex.isTouching(obstacleGroup)||trex.isTouching(birdGroup)){
     die.play();
     gameState=END;
      //trex.velocityY=-10;
    //jump.play();
    }
     //console.log(trex.y);
  }
  
  else if(gameState===END){
    ground.velocityX=0;
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    trex.changeAnimation("trexcollide");
    gameOver.visible=true;
    restart.visible=true;
    trex.velocityY=0;
    if(birdGroup.contains(bird)){
    birdGroup.setLifetimeEach(-1);
    birdGroup.setVelocityXEach(0);
    bird.changeAnimation("birdcollide");
    }
    
    //to restart the game
    if(mousePressedOver(restart)){
      reset()
    }
  }

  //trex collides
  trex.collide(invisible);
  
  //console.info("This is Info");
  //console.error();
  //console.warn();
  //console.timeEnd();
  
  text("Score: "+ score,500,50);
  //console.log(trex.y);
  
  drawSprites()
  //text("X: "+mouseX+ " Y: "+mouseY,mouseX,mouseY);
  
}

function spawnClouds(){
  
  var r=Math.round(random(80,100))
  if(frameCount % r===0){
      cloud= createSprite(600,random(50,120),20,20);
  cloud.velocityX=-3;
    cloud.addImage("cloud",cloudImage);
    cloud.scale=0.1;
   cloud.lifetime=220;
    trex.depth=cloud.depth+1;
    cloudGroup.add(cloud)
  }
}

function spawnObstacles(){
  var r=Math.round(random(80,100))
  if(frameCount% 80===0 ){
    obstacle=createSprite(600,165);
    obstacle.velocityX=-(6+score/100);
     var ran=Math.round(random(1,6));
    console.log(ran);
    switch(ran){
   case 1:obstacle.addImage(ob1);
        break;
   case 2:obstacle.addImage(ob2);
        break;
   case 3:obstacle.addImage(ob3);  
        break;
   case 4:obstacle.addImage(ob4);
        break;
   case 5:obstacle.addImage(ob5);   
        break;
   case 6:obstacle.addImage(ob6);
        break;
        default:break;
    }
    
    obstacleframe=frameCount;
    obstacle.scale=0.5;
    obstacle.lifetime=110;
    obstacleGroup.add(obstacle);
  }
}

function spawnbirds(){
  var choice=[41,93,119,255]
  var r=random(choice);
  if(frameCount % r===0 && (frameCount-currentFrame>70) && (obstacleframe-currentFrame>100)){
    currentFrame=frameCount;
    bird=createSprite(600,Math.round(random(50,100)));
    bird.addAnimation("bird",birdi);
    bird.addAnimation("birdcollide",birdcollide);
    bird.velocityX=-(8+score/100);
    bird.scale=0.5;
    bird.lifetime=80;
     // bird.debug=true;
    bird.setCollider("circle",0,0,40)
    birdGroup.add(bird);
  }
  
}

function reset(){
  gameState=PLAY;
  score=0;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("trexRun");
  gameOver.visible=false;
  restart.visible=false;
 birdGroup.destroyEach();  
}

const express   = require('express');
const app       = express();
const multer    = require('multer');
const mysql     = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'bosco1008!',
  database : 'nodejs'
})

connection.connect();

app.set('view engine', 'ejs'); // ejs사용
app.set('views', './views'); //views 폴더에서 읽음

const storage = multer.memoryStorage();

var Upload = multer ({storage: storage}); // 메모리에 저장

// 프론트와 연동 
app.get('/', (req, res) => {  //file.ejs 출력

  res.render('file');
});


app.post('/upload', Upload.single('userfile'), function (req, res, next) {
  const file = req.file;

  if(!file){ // 파일이 없을 시 에러문 출력
    const error = new Error("No data file, please upload the file ");
    return next(error);
  }

  
  var multerText = Buffer.from(file.buffer).toString("utf-8"); // 저장한 값 읽어오기
  // console.log(multerText); // 출력
  multerText = multerText.split('\n');
  let core = [];
  multerText.forEach((item, index) => { 
    if(item.split('\t')[1] == "task1" || item == '\r') return;

    core.push(item.split('\t').slice(1, 6)); // 1번부터 5번까지 배열 값 코어 배열에 저장
  });


  let Task = [[], [], [], [], []];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < core.length;  j++) {
    Task[i][j] = parseInt(core[j][i]);      
  }
}

for (let i = 0; i < Task.length; i++) {
  TaskofCore(i, Task);

  let tc1 = TaskofCoreMax(i,Task);
  let tc2 = TaskofCoreMin(i,Task);
  let tc3 = TaskofCoreAvg(i,Task);
  
  console.log(i+1 + '번 Task-------------------')
  console.log(tc1 + '   MAX입니다.');
  console.log(tc2 + '   MIN값입니다.');
  console.log(tc3 + '   AVG값입니다.');
}


res.render('tograph', { //tograph.ejs 읽기(출력)
  title: 'fileUP'
});
});


app.get('/graph', (req,res) => {
  res.render('graph');
});

app.get('/task2', (req, res)=> {
  res.render('task2');
})

app.get('/task3', (req, res)=> {
  res.render('task3');
})

app.get('/task4', (req, res)=> {
  res.render('task4');
})

app.get('/task5', (req, res)=> {
  res.render('task5');
})
//연동


// 서버
const port = 3000;

app.listen(port, () =>{
  console.log('DB서버 접속 완료!');

  console.log('server on! http://localhost:'+port);
});



//--------------------------------------------------------------------------------//


// 태스크별 코어, 코어별 태스크 MAX MIN AVG 계산 함수
function TaskofCore(TaskNum, Task) {
  let result = [[],[],[],[],[]];
  for (var i = 0; i < Task[0].length; i ++){
    result[i%5].push(Task[TaskNum][i]); // 태스크의 코어별(1~5)
  }
  return result;
}

function TaskofCoreMax(TaskNum, Task){ // 태스크별 코어의 최댓값 구하기
  var result = TaskofCore(TaskNum, Task);
  for (let i = 0; i < 5; i++) {
   result[i] = Math.max(...result[i]);
  }
  return result;
}

function TaskofCoreMin(TaskNum, Task){ // 태스크별 코어의 최솟값 구하기
  var result = TaskofCore(TaskNum, Task);
  for (let i = 0; i < 5; i++) {
   result[i] = Math.min(...result[i]);
  }
  return result;
}

function TaskofCoreAvg(TaskNum, Task){ // 태스크별 코어의 평균 구하기
  var result = TaskofCore(TaskNum, Task);
  for( var i = 0; i < result.length; i++ ){
    var sum = 0;
    for(var j = 0; j < result[i].length; j++){
      sum += parseInt(result[i][j]); 
    }
     result[i] =sum/result[i].length;
  }
  return result;
}

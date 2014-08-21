var names = ['Andrew', 'Chatty', 'David', 'Dawn', 'Jacques',
              'Jan', 'John', 'Jon', 'Luke', 'Mark',
              'Martin', 'Sue', 'Thomas', 'Will'];
var time = ["10:20", "10:40", "11:00", "11:20","11:40",
            "12:00","12:20", "12:40","13:00","13:20", "13:40",
            "14:00","14:20", "14:40","15:00","15:20", "15:40"];
var tableNo = Math.ceil(names.length/4);
var w1t1 = [];
var w1t2 = [];
var w1t3 = [];
var w1t4 = [];
var w1Tables = [];

function w1Dispatch (names){
    for (var i = 0; i < names.length; i++){
        if(i % tableNo == 0){
            w1t1.push(names[i]);
        } else if(i % tableNo == 1){
            w1t2.push(names[i]);
        } else if(i % tableNo == 2){
            w1t3.push(names[i]);
        } else if(i % tableNo == 3){
            w1t4.push(names[i]);
        }
    }
    return w1Tables = [w1t1, w1t2, w1t3, w1t4];
}

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}
//currentWeekNum increment every 2 weeks so that schedule does not change
var currentWeekNum = Math.floor(new Date().getWeek()/2);

function shuffleArrayByWeekNum (currentWeekNum) {
    console.log(names);
    var startIndex = (Math.ceil(currentWeekNum/2) - 1 ) % names.length;
    var newStartArray = names.slice(startIndex);
    var restArray = names.slice(0,startIndex);
    names = newStartArray.concat(restArray);
    names = [
      names[4], names[5], names[6], names[3], names[8], names[9], names[10],
      names[7], names[0], names[1], names[2], names[12], names[13], names[11]
    ];
    console.log(names);
    return names;
}

function getStartDayOfWeek(weekNo){
    var d1 = new Date();
    numOfdaysPastSinceLastThursday = eval(d1.getDay()- 4);
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastThursday);
    return d1;
};

function printHeadingRow (theader, table) {
    theader += "<th> " +" </th>";
    for(var i = 0; i < table.length; i++)
    {
        for(var j = 0; j < table[i].length; j++){
            theader += "<th> "+ table[i][j] +" </th>";
        }
    }
    return theader;
}

function flatToRow (complexArray, index){
    var result = [];
    var row = [];
    for (var j = 0; j < 4; j++){
        result.push(complexArray[j][index]);
    }
    for (var i = 0; i < 4; i++){
        for(var k = 0; k < result[i].length; k++){
            row.push(result[i][k]);
        }
    }
    return row;
}

function twoTableTalk4 (table1, table2){
    var row1 = [table2[0], table2[1], table2[2], table2[3],
                table1[0], table1[1], table1[2], table1[3]
                ];
    var row2 = [table2[1], table2[2], table2[3], table2[0],
                table1[3], table1[0], table1[1], table1[2]];
    var row3 = [table2[2], table2[3], table2[0], table2[1],
                table1[2], table1[3], table1[0], table1[1]];
    var row4 = [table2[3], table2[0], table2[1], table2[2],
                table1[1], table1[2], table1[3], table1[0]];
    return [row1, row2, row3, row4];
}

function twoTableTalk3 (table1, table2){
    var row1 = [" ", " ", " ", " ", " ", " ", " ", " "];
    var row2 = [table2[0], table2[1], table2[2],
                table1[0], table1[1], table1[2]];
    var row3 = [table2[1], table2[2], table2[0],
                table1[2], table1[0], table1[1]];
    var row4 = [table2[2], table2[0], table2[1],
                table1[1], table1[2], table1[0]];
    return [row1, row2, row3, row4];
}

function normalRows (tables){
    var T1 = twoTableTalk4(tables[0], tables[1]);
    var T2 = twoTableTalk3(tables[2], tables[3]);
    var result =[];
    for (var i = 0; i < 4; i++){
        result.push(T1[i].concat(T2[i]));
    }
    return result;
}

function insertTable()
{
    //add remove people
    reset();
    var addPerson = document.getElementById('addP').value;
    if(addPerson) {names.push(addPerson);}
    var removePerson = document.getElementById('removeP').value;
    removePeople(removePerson);

    var timeIndex = document.getElementById('startTime').value;
    var startDate = getStartDayOfWeek(currentWeekNum);

    var theader = "<table id='table1'>";
    var tbody = "";
    names = shuffleArrayByWeekNum(currentWeekNum-1);
    w1Dispatch(names);
    theader += printHeadingRow (theader, w1Tables);
    var firstWeekNormalRows = normalRows(w1Tables);
    //filling one row of cells with data
    for (var k = 0; k < firstWeekNormalRows.length; k++){
        tbody += "<tr>" + "<td>";
        tbody += time[timeIndex];
        tbody += "</td>"
            for (var g = 0; g < firstWeekNormalRows[k].length; g++){
                tbody += "<td>";
                tbody += firstWeekNormalRows[k][g];
                tbody += "</td>";
            }
        tbody += "</tr>";
        timeIndex++;
    }


    var tfooter = "</table>";
    document.getElementById('schedule1').innerHTML = theader + tbody + tfooter;
    currentPeople();
    printTables();
    cleanFields();
}

function currentPeople () {
    var msg = 'Current peers: ';
    for (var i = 0; i < names.length; i++){
        msg+= '  ' + names[i] + '  ';
    }
    document.getElementById('currentNames').innerHTML= msg;
}

function printTable (table, name) {
    var msg = '';
    for (var i = 0; i < table.length; i++) {
        msg += table[i] + '  ';
    }
    document.getElementById(name).innerHTML= "<tr><td>" + msg+"</td></tr>";
}

function printTables () {
    for (var i = 0; i < 4; i++){
        printTable(w1Tables[i], 'table0' + [i+1]);
    }
}

function removePeople(removePerson){
    if(removePerson) {
        var removeIndex = names.indexOf(removePerson);
        if(removeIndex > -1){
            names.splice(removeIndex, 1);
        } else {
            alert('Remove name not found in list, Please refer to string format in the footer');
        }
     }
     return true;
}

function cleanFields(){
    document.getElementById('addP').value='';
    document.getElementById('removeP').value='';
}

function reset (){
    w1t1 = [];
    w1t2 = [];
    w1t3 = [];
    w1t4 = [];
    w2t1 = [];
    w2t2 = [];
    w2t3 = [];
    w2t4 = [];
    w1Tables = [];
    w2Tables = [];
}

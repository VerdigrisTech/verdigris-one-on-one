var names = ['Andrew', 'Chatty', 'David', 'Dawn', 'Jacques',
    'Jan', 'John', 'Jon', 'Luke', 'Mark',
    'Martin', 'Patrick', 'Sue', 'Thomas', 'Will', 'N/A'];
var tableNo = Math.ceil(names.length/4);
var table1 = [];
var table2 = [];
var table3 = [];
var table4 = [];
var tables = [];

function dispatchToTables () {
    for (var i = 0; i < names.length; i++){
        if(i % tableNo == 0){
            table1.push(names[i]);
        } else if(i % tableNo == 1){
            table2.push(names[i]);
        } else if(i % tableNo == 2){
            table3.push(names[i]);
        } else{
            table4.push(names[i]);
        }
    }
    console.log('tables: ');
    console.log([table1, table2, table3, table4]);
    return tables = [table1, table2, table3, table4];
}
//Get week based on current date
Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}
//currentWeekNum increment every 2 weeks so that schedule does not change
var currentWeekNum = Math.floor(new Date().getWeek()/2);

function shuffleArrayByWeekNum (currentWeekNum, numPeople) {
    var startIndex = (Math.ceil(currentWeekNum/2) - 1 ) % numPeople;
    var newStartArray = names.slice(startIndex);
    var restArray = names.slice(0,startIndex);
    names = newStartArray.concat(restArray);
    return names;
}

function getStartDayOfWeek(weekNo){
    var d1 = new Date();
    numOfdaysPastSinceLastThursday = eval(d1.getDay()- 4);
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastThursday);
    return d1;
};

function printHeadingRow (theader, table) {
    //Output names for table heading, ie, people's names
    theader += "<th> " +" </th>";
    for(var i = 0; i < table.length; i++)
    {
        for(var j = 0; j < table[i].length; j++){
            theader += "<th> "+ table[i][j] +" </th>";
        }
    }
    return theader;
}

function minSlots (interval) {
    var len = 60/interval;
    var result = [];
    result[0] = '00';
    for (var i = 1; i <= len; i++) {
        result[i] = 60/len*i
    }
    return result;
}

function lunchPairing(table){
    var row1 = [table[1], table[0], table[3], table[2]];
    var row2 = [table[2], table[3], table[0], table[1]];
    var row3 = [table[3], table[2], table[1], table[0]];
    return [row1, row2, row3];
}

function lunchPairings(tables){
    var result = [];
    for (var i = 0; i < tables.length; i++){
        result.push(lunchPairing(tables[i]));
    }
    return result;
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

function flatLunchTableRows (complexArray){
    var lunchRows = [];
    for (var i = 0; i < 3; i++){
        lunchRows.push(flatToRow(complexArray, i));
    }
    console.log('lunchRows');
    console.log(lunchRows);
    return lunchRows;
}


function twoTableTalk (table1, table2){
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

//rows for normal one on ones in a week
function normalRows (tables){
    var T1 = twoTableTalk(tables[0], tables[1]);
    var T2 = twoTableTalk(tables[2], tables[3]);
    var result =[];
    for (var i = 0; i < 4; i++){
        result.push(T1[i].concat(T2[i]));
    }
    console.log(result);
    return result;
}

function insertTable()
{
    //add/remove people
    reset();
    var addPerson = document.getElementById('addP').value;
    if(addPerson) {names.push(addPerson);}
    var removePerson = document.getElementById('removeP').value;
    removePeople(removePerson);

    var numPeople = names.length;
    var weekThrehold = Math.ceil((numPeople+1)/4);

    var startHr = document.getElementById('startHour').value;
    var hour = Number(startHr)
    var timeInterval = document.getElementById('timeInterval').value;
    var startDate = getStartDayOfWeek(currentWeekNum);

    var minA = minSlots(timeInterval)

    var weekNum = 1;
    var theader = "<table id='table1'>";
    var tbody = "";
    var graph = buildGraph(numPeople);
    // names = shuffleArrayByWeekNum(currentWeekNum, names.length);
    dispatchToTables();


    theader += printHeadingRow (theader, tables);
    lunchPairings(tables);

    var a = flatLunchTableRows(lunchPairings(tables)); //array of 3 rows for lunch table
    var b = normalRows(tables); //array of 4 rows for lunch table
    //Per row:
    var minIndex = 0;
    hour = startHr -1;
    var spanNum = numPeople + 1;
    tbody += "<tr>" + "<td class='highlight' colspan = \"" + spanNum + "\">";
    tbody += ' Week ' + weekNum + ' : ';
    tbody += "</td>" + "</tr>";
    weekNum ++ ;
    minIndex = 0;


    //first column: setting time
    min = minA[minIndex%(60/timeInterval)];
    minIndex ++;
    if ((minIndex-1)%(60/timeInterval) == 0) {
        hour++;
    }

    //filling one row of cells with data
    for (var k = 0; k < b.length; k++){
        tbody += "<tr>" + "<td>";
        tbody += hour + ': ' + min;
        tbody += "</td>"
            for (var g = 0; g < b[k].length; g++){
                tbody += "<td>";
                tbody += b[k][g];
                tbody += "</td>";
            }
        tbody += "</tr>";
    }
    for (var k = 0; k < a.length; k++){
        tbody += "<tr>" + "<td>";
        tbody += hour + ': ' + min;
        tbody += "</td>"
            for (var g = 0; g < a[k].length; g++){
                tbody += "<td>";
                tbody += a[k][g];
                tbody += "</td>";
            }
        tbody += "</tr>";
    }

    var tfooter = "</table>";
    document.getElementById('schedule').innerHTML = theader + tbody + tfooter;
    currentPeople();
    printTables();
    cleanFields();
}

//Print current people in array so can have reference to input format of string for removing people
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
        printTable(tables[i], 'table0' + [i+1]);
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

function buildGraph (numPeople){
    var vertices =[];
    for (var i = 0; i < numPeople; i++){
        var vertex = buildVertex(names[i],i,numPeople);
        vertices.push(vertex);
    }
    return vertices;
}

function buildVertex (name, index, numPeople){
    var vertex = {};
    vertex.id = index;
    vertex.name = name;
    vertex.visited = false;
    var neighbors = [];
    for (var i = 0; i < numPeople; i++){
        if (i == index) {
        } else {
            neighbors.push(names[i]);
        }
    }
    vertex.neighbors = neighbors;
    return vertex;
}

//returns true if there's edge left in graph, that is,
//any vertex's neighbors still have a member in it.
//as condition check in major: while()
function edgesLeft(graph){
    for (var c = 0; c < graph.length; c++){
        if (graph[c].neighbors.length > 0){
            return true;
        }
    }
    return false;
}

//get vertex from its name in the graph, helper fn of longestNeibors
function vertexByName (graph, name){
    for (var i = 0; i < graph.length; i++){
        if (name == graph[i].name){
            return graph[i];
        }
    }
}

function longestNeibors (vertex, graph){
    var edges = vertex.neighbors;
    var max = 0;
    //-1 means not found, so paired up already
    var maxIndex = -1;
    var pos = -1;
    for (var h = 0; h < edges.length; h++){
        var v = vertexByName(graph, edges[h]);
        if (Number(v.neighbors.length) > max && !v.visited) {
            max = Number(v.neighbors.length);
            maxIndex = h;
        }
    }
    if (maxIndex != -1) {
        pos = graph.map(function(n) {return n.name;}).indexOf(edges[maxIndex]);
    }
    return pos;
}

function reset (){
    table1 = [];
    table2 = [];
    table3 = [];
    table4 = [];
    tables = [];
}

